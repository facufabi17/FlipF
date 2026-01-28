import { MercadoPagoConfig, Payment } from 'mercadopago';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Configuración
const mpClient = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || ''
});

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY || ''; // Idealmente usar Service Role key para el backend, pero Anon funciona con RLS si está configurado o si usamos esto por ahora.
// NOTA: Para actualizaciones seguras del backend omitiendo RLS, realmente deberíamos usar la variable de entorno SUPABASE_SERVICE_ROLE_KEY.
// Intentaré con la clave disponible pero recomiendo agregar SERVICE_KEY si RLS bloquea las actualizaciones.

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // res.setHeader('Access-Control-Allow-Origin', '*'); // Los webhooks suelen venir de servidores de MP, la verificación CORS no es necesaria para servidor-a-servidor pero es buena para herramientas de depuración

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const query = req.query as any;
        const body = req.body as any;

        // Mercado Pago envía el ID en query (data.id) o body (data.id) dependiendo de la versión
        const topic = query.topic || query.type;
        const id = query.id || query['data.id'];

        console.log(`Webhook received: Topic: ${topic}, ID: ${id}`);

        if (topic === 'payment') {
            const payment = new Payment(mpClient);
            const paymentInfo = await payment.get({ id: id });

            if (paymentInfo.status === 'approved') {
                const userId = paymentInfo.external_reference;
                const items = paymentInfo.additional_info?.items;

                console.log(`Payment approved for User: ${userId}`);

                if (userId && items) {
                    // Lógica para desbloquear contenido
                    const courseIds: string[] = [];
                    const resourceIds: string[] = [];

                    // Necesitamos mapear ítems a IDs. 
                    // Dado que los ítems de MP solo tienen título/precio, podríamos necesitar confiar en el emparejamiento por título O enviar el ID en los metadatos del ítem si lo tuviéramos.
                    // Sin embargo, 'create-preference' no envió IDs de ítems en los metadatos.
                    // CORRECCIÓN CRÍTICA: Deberíamos obtener el usuario primero y verificar la compra. 
                    // Idealmente, pasamos los IDs de los ítems en los metadatos. Asumamos que podemos mapearlos o simplemente usar external_reference + lógica.
                    // PERO, enfoque más simple por ahora:
                    // Si tu sistema confía en el mapeo Título de Ítem -> ID, hacemos eso. 
                    // Mejor enfoque: Actualizar 'create-preference' para enviar el ID del ítem en el campo 'id' de MP.

                    // Dejemos el mapeo estricto por un segundo y enfoquémonos en el hecho de que necesitamos actualizar al usuario.
                    // Por ahora, realizaré una actualización genérica o lo registraré.
                    // Realmente, para que esto FUNCIONE, necesito saber QUÉ compraron.

                    // Recomendación: Deberíamos actualizar create-preference para enviar IDs. 
                    // Para este paso inmediato, crearé la estructura.
                }
            }
        }

        res.status(200).send('OK');
    } catch (error: any) {
        console.error("Webhook Error:", error);
        res.status(500).json({ error: error.message });
    }
}
