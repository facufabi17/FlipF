import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Inicializar cliente de Mercado Pago
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || process.env.VITE_MP_ACCESS_TOKEN || ''
});

const payment = new Payment(client);

// Inicializar Supabase (Cliente Servidor)
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    }
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // 1. Validar Método
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const secret = process.env.MP_WEBHOOK_SECRET;

    // 2. Validar Firma (Solo si existe el secreto, recomendado en producción)
    if (secret) {
        const xSignature = req.headers['x-signature'] as string;
        const xRequestId = req.headers['x-request-id'] as string;

        if (!xSignature || !xRequestId) {
            console.error('Webhook Error: Falta x-signature o x-request-id');
            return res.status(401).json({ error: 'Missing headers' });
        }

        // Parsear x-signature (ej: ts=12345678,v1=abcdef...)
        const parts = xSignature.split(',');
        let ts;
        let v1;

        parts.forEach(part => {
            const [key, value] = part.split('=');
            if (key === 'ts') ts = value;
            if (key === 'v1') v1 = value;
        });

        // Crear Manifest
        // Template: "id:[data.id];request-id:[x-request-id];ts:[ts];"
        const dataId = req.body?.data?.id;
        if (!dataId) {
            // Es una notificación de prueba o desconocida sin ID de data
            console.log('Webhook: Recibido sin data.id', req.body);
            return res.status(200).send('OK');
        }

        const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

        // Generar HMAC
        const hmac = crypto.createHmac('sha256', secret).update(manifest).digest('hex');

        if (hmac !== v1) {
            console.error('Webhook Error: Firma inválida');
            return res.status(401).json({ error: 'Invalid signature' });
        }
    } else {
        console.warn('Webhook Warning: MP_WEBHOOK_SECRET no configurado. Deteniendo ejecución.');
        return res.status(500).json({ error: 'Webhook secret missing' });
    }

    try {
        const { type, data } = req.body;

        // 3. Procesar solo eventos de pago
        if (type === 'payment' || req.body.topic === 'payment') {
            const paymentId = data?.id || req.body.resource; // data.id para webhook v1/v2, resource para IPN legacy

            if (!paymentId) {
                return res.status(400).json({ error: 'No payment ID found' });
            }

            console.log(`Webhook: Procesando pago ${paymentId}`);

            // 4. Consultar estado actual a Mercado Pago
            const paymentInfo = await payment.get({ id: paymentId });

            if (!paymentInfo) {
                return res.status(404).json({ error: 'Payment not found in MP' });
            }

            const status = paymentInfo.status;
            const externalReference = paymentInfo.external_reference;

            console.log(`Webhook: Pago ${paymentId} está ${status} (Ref: ${externalReference})`);

            // 5. Actualizar Supabase (Orden y Perfil)
            if (externalReference) {
                // 5a. Obtener la orden completa para saber usuario e items comprados
                const { data: orderData, error: fetchOrderError } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('id', externalReference)
                    .single();

                if (fetchOrderError) {
                    console.error('Supabase Error fetching order:', fetchOrderError);
                }

                // 5b. Validar prevención contra Fraude de precio
                if (status === 'approved' && orderData) {
                    if (paymentInfo.transaction_amount < orderData.total) {
                        console.error(`Fraude detectado: Pago ${paymentId} por ${paymentInfo.transaction_amount} es menor al total de la orden ${orderData.total}.`);

                        await supabase
                            .from('orders')
                            .update({
                                status: 'fraud_attempt',
                                payment_id: paymentId,
                                updated_at: new Date().toISOString()
                            })
                            .eq('id', externalReference);

                        return res.status(400).json({ error: 'Fraud attempt detected: amount mismatch' });
                    }
                }

                // 5c. Actualizar estado de la orden
                const { error: dbError } = await supabase
                    .from('orders')
                    .update({
                        status: status,
                        payment_id: paymentId,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', externalReference);

                if (dbError) {
                    console.error('Supabase Error updating order:', dbError);
                } else {
                    console.log('Supabase: Orden actualizada correctamente a', status);
                }

                // 5d. Asignar los items comprados al perfil si el estado es 'approved'
                if (status === 'approved' && orderData && orderData.user_id && orderData.items) {
                    console.log(`Webhook: Intentando asignar items al usuario ${orderData.user_id}`);

                    try {
                        // Obtener perfil actual para no sobreescribir compras anteriores
                        const { data: profileData, error: profileFetchError } = await supabase
                            .from('profiles')
                            .select('enrolled_courses, owned_resources')
                            .eq('id', orderData.user_id)
                            .single();

                        if (profileFetchError) throw profileFetchError;

                        const currentCourses = profileData.enrolled_courses || [];
                        const currentResources = profileData.owned_resources || [];

                        // Añadir nuevos items
                        let hasChanges = false;
                        const items = orderData.items as Array<any>;

                        items.forEach((item: any) => {
                            if (item.type === 'course' && !currentCourses.includes(item.id || item.item_id)) {
                                currentCourses.push(item.id || item.item_id);
                                hasChanges = true;
                            } else if (item.type === 'resource' && !currentResources.includes(item.id || item.item_id)) {
                                currentResources.push(item.id || item.item_id);
                                hasChanges = true;
                            }
                        });

                        if (hasChanges) {
                            const { error: profileUpdateError } = await supabase
                                .from('profiles')
                                .update({
                                    enrolled_courses: currentCourses,
                                    owned_resources: currentResources
                                })
                                .eq('id', orderData.user_id);

                            if (profileUpdateError) {
                                console.error('Supabase Error asignando items al perfil:', profileUpdateError);
                            } else {
                                console.log(`Webhook: Items asignados exitosamente al usuario ${orderData.user_id}`);
                            }
                        } else {
                            console.log(`Webhook: El usuario ${orderData.user_id} ya contaba con los items comprados.`);
                        }
                    } catch (assignmentError) {
                        console.error('Webhook: Error durante el flujo de asignación al perfil:', assignmentError);
                    }
                }
            }
        }

        // Responder rápido con 200
        return res.status(200).json({ status: 'OK' });

    } catch (error: any) {
        console.error('Webhook Handler Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
