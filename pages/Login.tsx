import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface LoginProps {
    onShowToast: (text: string, type?: 'success' | 'error') => void;
}

const Login: React.FC<LoginProps> = ({ onShowToast }) => {
    const navigate = useNavigate();
    const { login, loginWithGoogle } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Recovery Mode State
    const [isRecoveryMode, setIsRecoveryMode] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // --- LÓGICA DE RECUPERACIÓN ---
        if (isRecoveryMode) {
            if (!email) {
                onShowToast('Ingresa tu email para recuperar la contraseña', 'error');
                return;
            }
            setIsSubmitting(true);
            try {
                // redirectTo debe apuntar al dominio base donde corre la app
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: window.location.origin + '/',
                });

                if (error) throw error;

                onShowToast('Correo de recuperación enviado. Revisa tu bandeja.', 'success');
                setIsRecoveryMode(false); // Volver al login
            } catch (error: any) {
                console.error("Recovery error:", error);
                onShowToast(error.message || 'Error al enviar correo', 'error');
            } finally {
                setIsSubmitting(false);
            }
            return;
        }

        // --- LÓGICA DE LOGIN NORMAL ---
        if (!email || !password) {
            onShowToast('Por favor completa todos los campos', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await login(email, password);
            setIsSubmitting(false);

            if (result.success) {
                onShowToast('¡Bienvenido de nuevo!', 'success');
                navigate('/');
            } else {
                onShowToast(result.message, 'error');
            }
        } catch (error) {
            setIsSubmitting(false);
            onShowToast('Error al iniciar sesión', 'error');
        }
    };

    const handleGoogleLogin = async () => {
        setIsSubmitting(true);
        try {
            const result = await loginWithGoogle();
            if (!result.success) {
                onShowToast(result.message || 'Error al iniciar sesión con Google', 'error');
                setIsSubmitting(false);
            }
            // Si es exitoso, la redirección la maneja Supabase OAuth
        } catch (error) {
            console.error(error);
            onShowToast('Error inesperado', 'error');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <section className="relative flex min-h-[85vh] w-full items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]"></div>
                </div>
                <div className="relative z-10 w-full max-w-md p-6">
                    <div className="glass-card rounded-2xl p-8 border border-white/10 shadow-2xl">
                        {isRecoveryMode ? (
                            // --- VISTA DE RECUPERACIÓN ---
                            <div className="animate-fade-in">
                                <h2 className="text-3xl font-bold text-center text-white mb-2">Recuperar Contraseña</h2>
                                <p className="text-center text-text-muted mb-8">Ingresa tu email y te enviaremos un enlace.</p>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Correo Electrónico</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="tu@email.com"
                                            className="w-full rounded-lg border border-white/10 bg-surface-dark px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-primary hover:bg-purple-600 text-white font-bold py-3.5 rounded-lg transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsRecoveryMode(false)}
                                        className="w-full text-gray-400 hover:text-white transition-colors text-sm"
                                    >
                                        &larr; Volver al Inicio de Sesión
                                    </button>
                                </form>
                            </div>
                        ) : (
                            // --- VISTA DE LOGIN ---
                            <div className="animate-fade-in">
                                <h2 className="text-3xl font-bold text-center text-white mb-2">Iniciar Sesión</h2>
                                <p className="text-center text-text-muted mb-8">Bienvenido de nuevo a Flip.</p>

                                {/* Botón de Google */}
                                <button
                                    onClick={handleGoogleLogin}
                                    type="button"
                                    className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-bold py-3.5 rounded-lg transition-all mb-6 group border border-transparent hover:shadow-lg hover:border-gray-300"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    <span className="group-hover:text-black transition-colors">Continuar con Google</span>
                                </button>

                                <div className="relative flex items-center gap-4 mb-6">
                                    <div className="h-px bg-white/10 flex-1"></div>
                                    <span className="text-sm text-gray-500 font-medium">O usa tu email</span>
                                    <div className="h-px bg-white/10 flex-1"></div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Correo Electrónico</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="hola@ejemplo.com"
                                            className="w-full rounded-lg border border-white/10 bg-surface-dark px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Contraseña</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full rounded-lg border border-white/10 bg-surface-dark px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                                            <input type="checkbox" className="rounded border-gray-600 bg-transparent text-primary focus:ring-0" />
                                            Recordarme
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setIsRecoveryMode(true)}
                                            className="text-primary hover:text-accent transition-colors"
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </button>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-primary hover:bg-purple-600 text-white font-bold py-3.5 rounded-lg transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Ingresando...' : 'Ingresar'}
                                    </button>
                                </form>
                                <p className="mt-6 text-center text-sm text-gray-400">
                                    ¿No tienes cuenta? <Link to="/register" className="text-white font-bold hover:underline">Regístrate</Link>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Login;