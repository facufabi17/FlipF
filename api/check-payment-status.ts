import { MercadoPagoConfig, Payment } from 'mercadopago';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Inicializar cliente MP
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || process.env.VITE_MP_ACCESS_TOKEN || ''
});
const payment = new Payment(client);

// Inicializar Supabase (Backend)
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const { payment_id, external_reference } = req.query;

        if (!payment_id && !external_reference) {
            return res.status(400).json({ error: 'Falta payment_id o external_reference' });
        }

        // 1. ESTRATEGIA OPTIMIZADA: Consultar primero a la Base de Datos (Supabase)
        // El Webhook debería haber actualizado esto mucho más rápido
        if (external_reference) {
            const { data: order } = await supabase
                .from('orders')
                .select('status, payment_id')
                .eq('external_reference', external_reference as string)
                .single();

            // Si la orden existe y ya está aprobada, retornamos éxito inmediato (Fast Path)
            if (order && (order.status === 'approved' || order.status === 'accredited')) {
                console.log('API Check: Pago aprobado encontrado en DB', external_reference);
                return res.status(200).json({
                    id: order.payment_id || payment_id,
                    status: order.status,
                    status_detail: 'accredited', // Asumimos accredited si es approved
                    source: 'database'
                });
            }
        }

        // 2. FALLBACK: Consultar a Mercado Pago (Slow Path)
        // Solo si la DB no tiene la data actualizada (ej. webhook demorado o falló)
        let paymentStatus;

        if (payment_id) {
            paymentStatus = await payment.get({ id: payment_id as string });
        } else if (external_reference) {
            const searchResult = await payment.search({
                options: {
                    external_reference: external_reference as string,
                    limit: 1,
                    sort: 'date_created',
                    criteria: 'desc'
                }
            });

            if (searchResult.results && searchResult.results.length > 0) {
                paymentStatus = searchResult.results[0];
            }
        }

        if (paymentStatus) {
            return res.status(200).json({
                id: paymentStatus.id,
                status: paymentStatus.status,
                status_detail: paymentStatus.status_detail,
                date_approved: paymentStatus.date_approved,
                source: 'mercadopago'
            });
        }

        return res.status(200).json({ status: 'pending', message: 'Payment not found yet' });

    } catch (error: any) {
        console.error('Error verificando pago:', error);
        return res.status(500).json({
            error: 'Error al verificar estado del pago',
            details: error.message
        });
    }
}
