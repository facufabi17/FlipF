import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RegisterProps {
    onShowToast: (text: string, type?: 'success' | 'error') => void;
}

const Register: React.FC<RegisterProps> = ({ onShowToast }) => {
    const navigate = useNavigate();
    const { register, loginWithGoogle } = useAuth();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dni, setDni] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!firstName || !lastName || !email || !password) {
            onShowToast('Por favor completa todos los campos', 'error');
            return;
        }

        setLoading(true);
        try {
            const result = await register(firstName, lastName, email, password, dni);
            if (result.success) {
                onShowToast('¡Cuenta creada! Por favor verifica tu email para continuar.', 'success');
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

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const result = await loginWithGoogle();
            if (!result.success) {
                onShowToast(result.message || 'Error al registrarse con Google', 'error');
                setLoading(false);
            }
            // Si es exitoso, redirección automática
        } catch (error) {
            console.error(error);
            onShowToast('Error inesperado', 'error');
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
                            <span className="group-hover:text-black transition-colors">Registrarse con Google</span>
                        </button>

                        <div className="relative flex items-center gap-4 mb-6">
                            <div className="h-px bg-white/10 flex-1"></div>
                            <span className="text-sm text-gray-500 font-medium">O completa el formulario</span>
                            <div className="h-px bg-white/10 flex-1"></div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            placeholder="Juan"
                                            className="w-full rounded-lg border border-white/10 bg-surface-dark px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Apellido</label>
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            placeholder="Pérez"
                                            className="w-full rounded-lg border border-white/10 bg-surface-dark px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                                        />
                                    </div>
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        DNI / Identificación <span className="text-gray-500 text-xs">(Opcional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={dni}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, '');
                                            setDni(val);
                                        }}
                                        placeholder="Solo números"
                                        className="w-full rounded-lg border border-white/10 bg-surface-dark px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                                    />
                                    <p className="text-xs text-yellow-500/80 mt-1">
                                        ⚠️ Esta información no se podrá modificar una vez guardada.
                                    </p>
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