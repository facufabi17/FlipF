import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { COURSES } from '../data/courses';
import { FREE_RESOURCES, PAID_RESOURCES } from '../data/resources';

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
        // 1. Verificar Autenticación usando el Bearer Token enviado desde el Frontend
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Missing or invalid authorization header' });
        }

        const token = authHeader.split(' ')[1];
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            console.error('Error verificando usuario:', authError);
            return res.status(401).json({ error: 'Unauthorized user' });
        }

        const { itemId, itemType } = req.body;

        if (!itemId || !itemType) {
            return res.status(400).json({ error: 'Missing itemId or itemType' });
        }

        // 2. Validar que el curso/recurso sea GRATUITO
        let isFree = false;

        if (itemType === 'course') {
            const course = COURSES.find(c => c.id === itemId);
            if (course && course.price === 0) {
                isFree = true;
            }
        } else if (itemType === 'resource') {
            const freeResource = FREE_RESOURCES.find(r => r.id === itemId);
            if (freeResource) {
                isFree = true;
            } else {
                const paidResource = PAID_RESOURCES.find(r => r.id === itemId);
                if (paidResource && paidResource.price === 0) {
                    isFree = true;
                }
            }
        }

        if (!isFree) {
            return res.status(403).json({ error: 'The requested item is not free and requires purchase.' });
        }

        // 3. Obtener el perfil del usuario para traer los arreglos actuales
        const { data: profileData, error: profileFetchError } = await supabase
            .from('profiles')
            .select('enrolled_courses, owned_resources')
            .eq('id', user.id)
            .single();

        if (profileFetchError) {
            console.error('Error obteniendo perfil:', profileFetchError);
            return res.status(500).json({ error: 'Failed to fetch user profile' });
        }

        const currentCourses = profileData.enrolled_courses || [];
        const currentResources = profileData.owned_resources || [];

        let updatePayload = {};

        // 4. Determinar si se agrega a cursos o recursos, sin duplicar
        if (itemType === 'course') {
            if (currentCourses.includes(itemId)) {
                return res.status(200).json({ message: 'User already enrolled', status: 'success' });
            }
            updatePayload = { enrolled_courses: [...currentCourses, itemId] };
        } else if (itemType === 'resource') {
            if (currentResources.includes(itemId)) {
                return res.status(200).json({ message: 'User already owns resource', status: 'success' });
            }
            updatePayload = { owned_resources: [...currentResources, itemId] };
        } else {
            return res.status(400).json({ error: 'Invalid itemType' });
        }

        // 5. Realizar el update en la base de datos mediante Service Role Client (seguro)
        const { error: updateError } = await supabase
            .from('profiles')
            .update(updatePayload)
            .eq('id', user.id);

        if (updateError) {
            console.error('Error actualizando perfil:', updateError);
            return res.status(500).json({ error: 'Database update failed' });
        }

        return res.status(200).json({ status: 'success', message: 'Item successfully assigned to user' });

    } catch (err: any) {
        console.error('Enroll API Error:', err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
}
