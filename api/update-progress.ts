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

        const { courseId, moduleId } = req.body;
        if (!courseId || !moduleId) {
            return res.status(400).json({ error: 'Missing courseId or moduleId' });
        }

        // Obtener el registro actual
        const { data: currentData, error: fetchError } = await supabase
            .from('profiles')
            .select('completed_modules')
            .eq('id', user.id)
            .single();

        if (fetchError) throw fetchError;

        const dbProgress = (currentData?.completed_modules || {}) as Record<string, string[]>;
        const courseProgress = dbProgress[courseId] || [];

        if (!courseProgress.includes(moduleId)) {
            const newProgress = {
                ...dbProgress,
                [courseId]: [...courseProgress, moduleId]
            };

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ completed_modules: newProgress })
                .eq('id', user.id);

            if (updateError) throw updateError;

            return res.status(200).json({ status: 'success', newProgress });
        }

        return res.status(200).json({ status: 'success', newProgress: dbProgress, message: 'Already marked' });

    } catch (err: any) {
        console.error('Update Progress API Error:', err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
}
