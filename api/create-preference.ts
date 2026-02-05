import { MercadoPagoConfig, Preference } from 'mercadopago';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Initialize Mercado Pago
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || process.env.VITE_MP_ACCESS_TOKEN || ''
});

// Vercel Handler
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
        const { items, baseUrl } = req.body;
        const origin = baseUrl || 'https://flip-f.vercel.app';

        console.error('--- Debug Create Preference (STDERR) ---');
        const token = client.accessToken;
        console.error('Token (masked):', token ? `${token.substring(0, 10)}...${token.substring(token.length - 5)}` : 'MISSING');

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ error: 'Items are required' });
        }

        const body = {
            items: items.map((item: any) => ({
                id: item.id,
                title: item.title,
                quantity: Number(item.quantity || 1),
                unit_price: Number(item.price),
                currency_id: 'ARS',
            })),
            back_urls: {
                success: `${origin}/mis-cursos`,
                failure: `${origin}/checkout`,
                pending: `${origin}/checkout`,
            },
            // auto_return: 'approved',
        };

        console.error('Preference Body:', JSON.stringify(body, null, 2));

        const preference = new Preference(client);
        const result = await preference.create({ body });

        console.error('Preference Created ID:', result.id);
        return res.status(200).json({ id: result.id });
    } catch (error: any) {
        console.error('Error creating preference:', error);
        // Log detailed Mercado Pago error if available
        if (error.cause) {
            console.error('Error cause:', JSON.stringify(error.cause, null, 2));
        }
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Local Server Runner (if executed directly)
import { fileURLToPath } from 'url';
import { createServer } from 'http';

// Check if running directly in Node
// @ts-ignore
if (import.meta.url === `file://${process.argv[1]}`) {
    (async () => {
        const express = (await import('express')).default;
        const app = express();
        const port = 3001;

        app.use(express.json());

        // Wrap handler
        app.all('/api/create-preference', (req: any, res: any) => {
            // Mock Vercel Request/Response if needed or just pass express req/res
            // Express req/res are compatible enough for this simple handler
            handler(req, res);
        });

        // Also serve at root if testing direct script
        app.post('/create-preference', (req: any, res: any) => handler(req, res));

        app.listen(port, () => {
            console.log(`> Local API running at http://localhost:${port}`);
        });
    })();
}
