import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

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
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { orderId, couponCode, userId } = req.body;

        if (!orderId || !userId) {
            return res.status(400).json({ error: 'Missing orderId or userId' });
        }

        console.log(`Verifying free order: ${orderId} for user: ${userId}`);

        // 1. Obtener la orden
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .eq('user_id', userId)
            .single();

        if (orderError || !orderData) {
            console.error('Order fetching error:', orderError);
            return res.status(404).json({ error: 'Order not found or access denied' });
        }

        // 2. Validar que la orden sea realmente gratuita
        if (Number(orderData.total) !== 0) {
            return res.status(400).json({ error: 'Order total is not zero' });
        }

        if (orderData.status !== 'pending') {
            return res.status(400).json({ error: 'Order is not in pending state' });
        }

        // 3. Aprobar la orden
        const { error: updateError } = await supabase
            .from('orders')
            .update({
                status: 'approved',
                payment_id: `free_${Date.now()}`,
                updated_at: new Date().toISOString()
            })
            .eq('id', orderId);

        if (updateError) {
            console.error('Error updating order status:', updateError);
            return res.status(500).json({ error: 'Failed to update order' });
        }

        // 4. Asignar los items al usuario
        const items = orderData.items as Array<any>;
        if (items && items.length > 0) {
            const { data: profileData, error: profileFetchError } = await supabase
                .from('profiles')
                .select('enrolled_courses, owned_resources')
                .eq('id', userId)
                .single();

            if (!profileFetchError && profileData) {
                const currentCourses = profileData.enrolled_courses || [];
                const currentResources = profileData.owned_resources || [];

                let hasChanges = false;

                items.forEach((item: any) => {
                    const itemId = item.id || item.item_id;
                    if (item.type === 'course' && !currentCourses.includes(itemId)) {
                        currentCourses.push(itemId);
                        hasChanges = true;
                    } else if (item.type === 'resource' && !currentResources.includes(itemId)) {
                        currentResources.push(itemId);
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
                        .eq('id', userId);

                    if (profileUpdateError) {
                        console.error('Error assigning items to profile:', profileUpdateError);
                    } else {
                        console.log(`Items successfully assigned to user ${userId}`);
                    }
                }
            }
        }

        // 5. Enviar a GA4 si es posible
        try {
            const measurementId = process.env.GA4_MEASUREMENT_ID;
            const apiSecret = process.env.GA4_API_SECRET;

            if (measurementId && apiSecret && items && items.length > 0) {
                const ga4Payload = {
                    client_id: orderData.ga_client_id || userId,
                    events: [{
                        name: 'purchase',
                        params: {
                            transaction_id: orderId,
                            value: 0,
                            currency: 'ARS',
                            payment_type: 'free_coupon_or_direct',
                            coupon: couponCode || undefined,
                            items: items.map((item: any) => ({
                                item_id: item.id || item.item_id,
                                item_name: item.title || item.name || `Item ${item.id}`,
                                price: 0,
                                quantity: 1
                            }))
                        }
                    }]
                };

                const ga4Response = await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`, {
                    method: 'POST',
                    body: JSON.stringify(ga4Payload),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!ga4Response.ok) {
                    console.error('GA4 API Error', ga4Response.status, await ga4Response.text());
                } else {
                    console.log(`GA4 free purchase event sent for order ${orderId}`);
                }
            }
        } catch (gaError) {
            console.error('Exception sending GA4 event:', gaError);
        }

        return res.status(200).json({ success: true, message: 'Free order approved' });

    } catch (error: any) {
        console.error('Verify Free Handler Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}