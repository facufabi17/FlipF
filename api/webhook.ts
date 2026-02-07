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
        console.warn('Webhook Warning: MP_WEBHOOK_SECRET no configurado, saltando validación de firma.');
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

            // 5. Actualizar Supabase
            // Buscamos por external_reference (preferido) o almacenamos el payment_id si es nuevo
            if (externalReference) {
                // Opción A: Actualizar tabla 'orders' o 'purchases'
                // Ajusta 'orders' y 'uuid' según tu esquema real
                const { error: dbError } = await supabase
                    .from('orders')
                    .update({
                        status: status,
                        payment_id: paymentId, // Guardar el ID de MP si no lo teníamos
                        updated_at: new Date().toISOString()
                    })
                    .eq('external_reference', externalReference); // O .eq('id', externalReference) si usaste el ID de la orden como ref

                if (dbError) {
                    console.error('Supabase Error updating order:', dbError);
                    // No fallamos el webhook entero, pero logueamos el error
                } else {
                    console.log('Supabase: Orden actualizada correctamente');
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
