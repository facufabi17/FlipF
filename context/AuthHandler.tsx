import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// Componente que maneja eventos de autenticación globales
// Especialmente útil para interceptar recuperación de contraseña en HashRouter
const AuthHandler: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                console.log('Evento de Recuperación de Contraseña detectado');

                // Limpiar el hash de la URL para evitar conflictos con el router
                // (Opcional, pero recomendado si el router se confunde)

                // Redirigir a la página de actualización de contraseña
                navigate('/actualizar-password');
            }
        });

        // Verificamos si hay un hash de recuperación en la URL al montar
        // A veces el evento dispara antes de que el componente monte, 
        // pero con HashRouter + supabase-js suele funcionar bien el listener.
        // Si hay problemas, podemos parsear window.location.hash aquí.

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [navigate]);

    return null; // Este componente no renderiza nada visualmente por sí mismo (o podría renderizar un Loading global)
};

export default AuthHandler;
