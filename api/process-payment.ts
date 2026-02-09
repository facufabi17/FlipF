import { MercadoPagoConfig, Payment } from 'mercadopago';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || process.env.VITE_MP_ACCESS_TOKEN || ''
});

const payment = new Payment(client);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const body = req.body;

        console.log('--- Processing Payment Request ---');
        console.log('Payment Data received:', JSON.stringify(body, null, 2));

        // Validar campos mínimos necesarios
        if (!body.transaction_amount || !body.token || !body.payment_method_id || !body.payer || !body.payer.email) {
            console.warn('Missing required payment fields');
            // No retornamos error aquí para dejar que MP valide, pero logueamos warning
        }

        // Asegurar que haya una descripción y referencia externa si no vienen
        // Nota: Es mejor que el frontend los mande, pero aquí podemos poner fallbacks
        if (!body.description) body.description = 'Compra en Flip';
        if (!body.external_reference) console.warn('Warning: No external_reference provided for this payment.');

        // Configuración adicional del request
        const paymentData = {
            ...body,
            notification_url: body.notification_url || process.env.WEBHOOK_URL
        };

        const result = await payment.create({ body: paymentData });

        console.log('Payment created successfully:', result.id);

        return res.status(200).json(result);
    } catch (error: any) {
        console.error('Error processing payment:', error);

        // Mejor manejo de errores de Mercado Pago
        const errorDetails = error.cause || error.message || error;
        console.error('MP Error Details:', JSON.stringify(errorDetails, null, 2));

        return res.status(500).json({
            error: 'Error processing payment',
            details: errorDetails
        });
    }
}

// Local Server Runner
// @ts-ignore
if (import.meta.url === `file://${process.argv[1]}`) {
    (async () => {
        const express = (await import('express')).default;
        const app = express();
        const port = 3002; // Different port to avoid conflict or use same via concurrency if managed

        app.use(express.json());

        app.post('/process_payment', (req: any, res: any) => handler(req, res));
        app.post('/api/process-payment', (req: any, res: any) => handler(req, res)); // Match common pattern

        app.listen(port, () => {
            console.log(`> Local Payment Processor running at http://localhost:${port}`);
        });
    })();
}
