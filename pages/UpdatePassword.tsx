import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const UpdatePassword: React.FC = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (password !== confirmPassword) {
            setMessage({ text: 'Las contraseñas no coinciden', type: 'error' });
            return;
        }

        if (password.length < 6) {
            setMessage({ text: 'La contraseña debe tener al menos 6 caracteres', type: 'error' });
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({ password: password });

            if (error) {
                throw error;
            }

            setMessage({ text: '¡Contraseña actualizada con éxito!', type: 'success' });

            // Redirigir al login o home después de unos segundos
            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (error: any) {
            console.error('Error updating password:', error);
            setMessage({ text: error.message || 'Error al actualizar la contraseña', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in min-h-screen flex items-center justify-center bg-background px-4">
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-md glass-card rounded-2xl p-8 border border-white/10 shadow-2xl">
                <h2 className="text-3xl font-bold text-center text-white mb-2">Nueva Contraseña</h2>
                <p className="text-center text-gray-400 mb-8">Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta.</p>

                {message && (
                    <div className={`p-4 rounded-lg mb-6 text-sm font-bold text-center ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Nueva Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-lg border border-white/10 bg-surface-dark px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Confirmar Contraseña</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repite la contraseña"
                            className="w-full rounded-lg border border-white/10 bg-surface-dark px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-purple-600 text-white font-bold py-3.5 rounded-lg transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                        {loading ? 'Actualizando...' : 'Establecer Contraseña'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdatePassword;
