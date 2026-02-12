import { supabase } from '../lib/supabase';
import { User } from '../types';

export const authService = {
    // 1. REGISTRO: Envía los datos a Supabase Auth
    register: async ({ name, email, password }: any) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                // 'full_name' es capturado por el Trigger que creaste en la DB
                data: { full_name: name }
            }
        });

        if (error) return { success: false, message: error.message };

        return {
            success: true,
            user: {
                id: data.user?.id,
                name,
                email,
                enrolledCourses: [],
                ownedResources: [],
                progress: {}
            }
        };
    },

    // 2. LOGIN: Valida credenciales contra la base de datos real
    login: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) return { success: false, message: error.message };

        return {
            success: true,
            user: {
                id: data.user?.id,
                email: data.user?.email,
                name: data.user?.user_metadata?.full_name || 'Usuario',
                enrolledCourses: [],
                ownedResources: [],
                progress: {}
            }
        };
    },

    // 3. LOGOUT: Cierra la sesión en el servidor
    logout: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error("Error al cerrar sesión:", error.message);
    },

    // 4. PERSISTENCIA: Recupera la sesión activa al recargar la web
    getCurrentUser: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        return {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name,
            enrolledCourses: [],
            ownedResources: [],
            progress: {}
        };
    },

    // 5. OAUTH: Iniciar sesión con Google
    signInWithGoogle: async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        });

        if (error) return { success: false, message: error.message };
        return { success: true, data };
    }
};