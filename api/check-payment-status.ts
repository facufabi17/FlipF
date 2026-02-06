
import { MercadoPagoConfig, Payment } from 'mercadopago';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Inicializar cliente
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || process.env.VITE_MP_ACCESS_TOKEN || ''
});

const payment = new Payment(client);

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

        let paymentStatus;

        if (payment_id) {
            // Consultar por ID directo
            paymentStatus = await payment.get({ id: payment_id as string });
        } else if (external_reference) {
            // Buscar por referencia externa
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
            } else {
                return res.status(200).json({ status: 'pending_search', message: 'No payments found yet' });
            }
        }

        return res.status(200).json({
            id: paymentStatus.id,
            status: paymentStatus.status,
            status_detail: paymentStatus.status_detail,
            date_approved: paymentStatus.date_approved
        });

    } catch (error: any) {
        console.error('Error verificando pago:', error);
        return res.status(500).json({
            error: 'Error al verificar estado del pago',
            details: error.message
        });
    }
}
