import { MercadoPagoConfig, Preference } from 'mercadopago';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// No usamos express, usamos el cliente de Mercado Pago directamente
const client = new MercadoPagoConfig({ 
    accessToken: process.env.MP_ACCESS_TOKEN || '' 
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // IMPORTANTE: Manejo de CORS para Vercel
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        const { items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: "No hay productos en el carrito" });
        }

        const preference = new Preference(client);
        
        const result = await preference.create({
            body: {
                items: items.map((item: any) => ({
                    title: item.title,
                    quantity: Number(item.quantity),
                    unit_price: Number(item.price),
                    currency_id: 'ARS' 
                })),
                back_urls: {
                    success: "https://flip-f.vercel.app/#/mis-cursos",
                    failure: "https://flip-f.vercel.app/#/checkout",
                    pending: "https://flip-f.vercel.app/#/checkout"
                },
                auto_return: "approved",
            }
        });

        // Respondemos directamente
        return res.status(200).json({
            preference_id: result.id,
            preference_url: result.init_point,
        });

    } catch (error: any) {
        console.error("Error en MP:", error);
        return res.status(500).json({ 
            error: "error creating preference", 
            details: error.message 
        });
    }
}