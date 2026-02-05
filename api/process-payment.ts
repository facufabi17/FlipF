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

        // Using the logic from snippet.js but wrapping in response handling
        const result = await payment.create({ body });

        return res.status(200).json(result);
    } catch (error: any) {
        console.error('Error processing payment:', error);
        return res.status(500).json({
            error: 'Error processing payment',
            details: error.message || error
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
