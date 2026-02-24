import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Inicializar Supabase con Service Role Key (salta RLS)
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

        // 2. Extraer y sanear los campos permitidos del body
        const { userId, firstName, lastName, dni } = req.body;

        // Validar que el usuario solo pueda actualizar su propio perfil
        if (!userId || userId !== user.id) {
            return res.status(403).json({ error: 'Forbidden: Cannot update another user\'s profile' });
        }

        const updates: any = {};
        let updateFullName = false;

        if (firstName !== undefined) {
            updates.first_name = firstName;
            updateFullName = true;
        }
        if (lastName !== undefined) {
            updates.last_name = lastName;
            updateFullName = true;
        }
        if (dni !== undefined) {
            updates.dni = dni;
        }

        // Si se modificó nombre o apellido, calcular el nuevo full_name
        if (updateFullName) {
            // Necesitamos el primer y último nombre actuales si solo se envió uno de ellos.
            // Para simplificar y siendo un update, consultaremos el estado actual si falta alguno,
            // o asumimos que el cliente envía ambos si cambia el full_name.
            const newFirst = firstName !== undefined ? firstName : user.user_metadata?.first_name || '';
            const newLast = lastName !== undefined ? lastName : user.user_metadata?.last_name || '';
            updates.full_name = `${newFirst} ${newLast}`.trim();
        }

        // Si no hay nada que actualizar, retornar OK.
        if (Object.keys(updates).length === 0) {
            return res.status(200).json({ status: 'success', message: 'No changes provided' });
        }

        // 3. Ejecutar el UPDATE de manera autoritativa
        const { error: updateError } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId);

        if (updateError) {
            console.error('Error actualizando perfil en BD:', updateError);
            return res.status(500).json({ error: 'Database update failed' });
        }

        return res.status(200).json({ status: 'success', message: 'Profile updated successfully' });

    } catch (err: any) {
        console.error('Update Profile API Error:', err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
}
