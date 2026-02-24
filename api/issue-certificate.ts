import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

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
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Missing or invalid authorization header' });
        }

        const token = authHeader.split(' ')[1];
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return res.status(401).json({ error: 'Unauthorized user' });
        }

        const { courseId } = req.body;
        if (!courseId) {
            return res.status(400).json({ error: 'Missing courseId' });
        }

        // Obtener certificados actuales
        const { data: currentData, error: fetchError } = await supabase
            .from('profiles')
            .select('certificates')
            .eq('id', user.id)
            .single();

        if (fetchError) throw fetchError;

        const dbCertificates = (currentData?.certificates || {}) as Record<string, string>;

        if (dbCertificates[courseId]) {
            return res.status(200).json({ status: 'success', certificateId: dbCertificates[courseId] });
        }

        const newCertId = `FLIP-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
        const newCertificates = { ...dbCertificates, [courseId]: newCertId };

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ certificates: newCertificates })
            .eq('id', user.id);

        if (updateError) throw updateError;

        return res.status(200).json({ status: 'success', certificateId: newCertId });

    } catch (err: any) {
        console.error('Issue Certificate API Error:', err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
}
