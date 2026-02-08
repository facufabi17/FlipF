import { MercadoPagoConfig, Preference } from 'mercadopago';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fileURLToPath } from 'url';
import { createServer } from 'http';

// Helper para UUID seguro sin dependencias de Node
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

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
        // Initialize Mercado Pago inside handler to ensure env vars are loaded
        const accessToken = process.env.MP_ACCESS_TOKEN || process.env.VITE_MP_ACCESS_TOKEN || '';
        if (!accessToken) {
            throw new Error("Missing MP_ACCESS_TOKEN in server environment");
        }

        const client = new MercadoPagoConfig({ accessToken });

        const { items, baseUrl } = req.body;
        const appOrigin = (baseUrl || 'https://flip-f.vercel.app').replace(/\/$/, '').replace(/#$/, '');

        console.error('--- Debug Create Preference (STDERR) ---');
        console.error('Token (masked):', `${accessToken.substring(0, 10)}...${accessToken.substring(accessToken.length - 5)}`);

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ error: 'Items are required' });
        }

        const externalReference = generateUUID();

        const body = {
            items: items.map((item: any) => ({
                id: item.id,
                title: item.title,
                quantity: Number(item.quantity || 1),
                unit_price: Number(item.price),
                currency_id: 'ARS',
            })),
            external_reference: externalReference,
            back_urls: {
                success: `${appOrigin}/#/pago_apro`,
                failure: `${appOrigin}/#/checkout`,
                pending: `${appOrigin}/#/checkout`,
            },
            ...(!appOrigin.includes('localhost') && !appOrigin.includes('127.0.0.1')
                ? { auto_return: 'approved' }
                : {}
            ),
            binary_mode: true,
            notification_url: process.env.WEBHOOK_URL || `${baseUrl}/api/webhook`
        };

        console.error('Preference Body:', JSON.stringify(body, null, 2));

        const preference = new Preference(client);
        const result = await preference.create({ body });

        console.error('Preference Created ID:', result.id);
        return res.status(200).json({
            id: result.id,
            init_point: result.init_point,
            external_reference: externalReference
        });
    } catch (error: any) {
        console.error('Error creating preference:', error);
        const errorMsg = error.message || 'Unknown error';
        const errorCause = error.cause ? JSON.stringify(error.cause) : undefined;

        return res.status(500).json({
            error: 'Internal Server Error',
            details: errorMsg,
            cause: errorCause
        });
    }
}

// Local Server Runner (if executed directly)
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
