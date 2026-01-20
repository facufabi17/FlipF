import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RegisterProps {
    onShowToast: (text: string, type?: 'success' | 'error') => void;
}

const Register: React.FC<RegisterProps> = ({ onShowToast }) => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !password) {
            onShowToast('Por favor completa todos los campos', 'error');
            return;
        }

        setLoading(true);
        try {
            const result = await register(name, email, password);
            if (result.success) {
                onShowToast('¡Cuenta creada exitosamente!', 'success');
                navigate('/');
            } else {
                onShowToast(result.message, 'error');
            }
        } catch (error) {
            onShowToast('Ocurrió un error inesperado', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <section className="relative flex min-h-[85vh] w-full items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-accent/10 blur-[100px]"></div>
                </div>
                <div className="relative z-10 w-full max-w-md p-6">
                    <div className="glass-card rounded-2xl p-8 border border-white/10 shadow-2xl">
                        <h2 className="text-3xl font-bold text-center text-white mb-2">Crear Cuenta</h2>
                        <p className="text-center text-text-muted mb-8">Únete a la comunidad de creadores.</p>

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Nombre Completo</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="John Doe"
                                        className="w-full rounded-lg border border-white/10 bg-surface-dark px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                                    />
                                </div>
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
                                <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-purple-600 text-white font-bold py-3.5 rounded-lg transition-all shadow-lg shadow-primary/20 disabled:opacity-50">
                                    {loading ? 'Creando cuenta...' : 'Registrarse'}
                                </button>
                            </div>
                        </form>
                        <p className="mt-6 text-center text-sm text-gray-400">
                            ¿Ya tienes cuenta? <Link to="/login" className="text-white font-bold hover:underline">Inicia Sesión</Link>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Register;