import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface UserProfileProps {
    onShowToast: (text: string, type?: 'success' | 'error') => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onShowToast }) => {
    const { user, updateProfile, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [isAuthenticated, user, navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword && newPassword !== confirmPassword) {
            onShowToast('Las contraseñas no coinciden', 'error');
            return;
        }

        const updates: any = { name, email };
        if (newPassword) {
            updates.password = newPassword;
        }

        updateProfile(updates);
        onShowToast('Perfil actualizado correctamente', 'success');
        setIsEditing(false);
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="animate-fade-in">
            <section className="relative flex min-h-[85vh] w-full items-center justify-center overflow-hidden py-20">
                <div className="absolute inset-0 z-0">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]"></div>
                </div>
                
                <div className="relative z-10 w-full max-w-2xl px-6">
                    <div className="glass-card rounded-2xl p-8 md:p-12 border border-white/10 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-white">Información de Usuario</h2>
                                <p className="text-text-muted">Gestiona tus datos personales y seguridad.</p>
                            </div>
                            <div className="size-16 rounded-full bg-gradient-to-br from-primary to-accent p-[2px]">
                                <div className="w-full h-full rounded-full bg-[#1b131f] flex items-center justify-center">
                                    <span className="font-bold text-white text-2xl">{name.charAt(0).toUpperCase()}</span>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Nombre Completo</label>
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full rounded-lg border border-white/10 bg-surface-dark px-4 py-3 text-white focus:border-primary focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Correo Electrónico</label>
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full rounded-lg border border-white/10 bg-surface-dark px-4 py-3 text-white focus:border-primary focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {isEditing && (
                                <div className="space-y-4 pt-4 border-t border-white/5 animate-fade-in">
                                    <h3 className="text-lg font-bold text-white">Cambiar Contraseña</h3>
                                    <p className="text-xs text-gray-400">Deja estos campos vacíos si no deseas cambiar tu contraseña.</p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Nueva Contraseña</label>
                                            <input 
                                                type="password" 
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full rounded-lg border border-white/10 bg-surface-dark px-4 py-3 text-white focus:border-primary focus:outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Confirmar Contraseña</label>
                                            <input 
                                                type="password" 
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full rounded-lg border border-white/10 bg-surface-dark px-4 py-3 text-white focus:border-primary focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="pt-6 flex gap-4">
                                {isEditing ? (
                                    <>
                                        <button 
                                            type="submit" 
                                            className="bg-primary hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined">save</span>
                                            Guardar Cambios
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => { setIsEditing(false); setName(user?.name || ''); setEmail(user?.email || ''); setNewPassword(''); setConfirmPassword(''); }}
                                            className="bg-white/5 hover:bg-white/10 text-white font-bold py-3 px-6 rounded-lg transition-all border border-white/10"
                                        >
                                            Cancelar
                                        </button>
                                    </>
                                ) : (
                                    <button 
                                        type="button" 
                                        onClick={() => setIsEditing(true)}
                                        className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-lg transition-all border border-white/10 flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">edit</span>
                                        Editar Perfil
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default UserProfile;