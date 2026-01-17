import { createClient } from '@supabase/supabase-js';

// Intentamos obtener las variables de entorno de diferentes fuentes comunes
// para asegurar compatibilidad.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase URL or Key is missing. Please check your environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).');
}

export const supabase = createClient(supabaseUrl, supabaseKey);