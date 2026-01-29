import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { COURSES } from '../data/courses';
import CertificateDisplay from '../components/CertificateDisplay';

interface UserProfileProps {
    onShowToast: (text: string, type?: 'success' | 'error') => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onShowToast }) => {
    const { user, updateProfile, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [dni, setDni] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Changing from boolean to explicit mode
    const [editingMode, setEditingMode] = useState<'none' | 'info' | 'password'>('none');

    // Certificate Viewer State
    const [viewingCertificate, setViewingCertificate] = useState<typeof COURSES[0] | null>(null);

    useEffect(() => {
        if (loading) return;

        if (!isAuthenticated) {
            navigate('/login');
        } else if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setDni(user.dni || '');
        }
    }, [isAuthenticated, user, navigate, loading]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary border-opacity-50"></div>
            </div>
        );
    }

    const handleUpdateInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const emailChanged = user && email !== user.email;
            await updateProfile({ name, email, dni });

            if (emailChanged) {
                onShowToast('Información actualizada. Por favor verifica tu nuevo email.', 'success');
            } else {
                onShowToast('Información actualizada correctamente', 'success');
            }
            setEditingMode('none');
        } catch (error: any) {
            console.error("Info update error:", error);
            onShowToast(error?.message || 'Error al actualizar información', 'error');
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            onShowToast('Las contraseñas no coinciden', 'error');
            return;
        }
        if (newPassword.length < 6) {
            onShowToast('La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }

        try {
            await updateProfile({ password: newPassword });
            onShowToast('Contraseña actualizada correctamente', 'success');
            setEditingMode('none');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            console.error("Password update error:", error);
            onShowToast(error?.message || 'Error al actualizar contraseña', 'error');
        }
    };

    const cancelEditing = () => {
        setEditingMode('none');
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
        }
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

                        <div className="space-y-8">
                            {/* --- Sección Información Personal --- */}
                            <form onSubmit={handleUpdateInfo} className="space-y-6">
                                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">person</span>
                                        Información Personal
                                    </h3>
                                    {editingMode === 'info' ? (
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={cancelEditing}
                                                className="text-xs bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                className="text-xs bg-primary hover:bg-purple-600 text-white px-3 py-1.5 rounded-lg transition-colors font-bold shadow-lg shadow-primary/20"
                                            >
                                                Guardar
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setEditingMode('info')}
                                            disabled={editingMode !== 'none'}
                                            className="text-xs bg-white/5 hover:bg-white/10 text-primary px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            <span className="material-symbols-outlined text-sm">edit</span>
                                            Editar
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Nombre Completo</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            disabled={editingMode !== 'info'}
                                            className="w-full rounded-lg border border-white/10 bg-surface-dark px-4 py-3 text-white focus:border-primary focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Correo Electrónico</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={editingMode !== 'info'}
                                            className="w-full rounded-lg border border-white/10 bg-surface-dark px-4 py-3 text-white focus:border-primary focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">
                                            DNI / Identificación
                                            {user?.dni && <span className="ml-2 text-xs text-green-500 font-bold">(Verificado)</span>}
                                        </label>
                                        <input
                                            type="text"
                                            value={dni}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                setDni(val);
                                            }}
                                            disabled={!!user?.dni || editingMode !== 'info'}
                                            placeholder={user?.dni ? user.dni : "Ingresa tu DNI"}
                                            className={`w-full rounded-lg border border-white/10 bg-surface-dark px-4 py-3 text-white focus:border-primary focus:outline-none 
                                                ${!!user?.dni ? 'opacity-50 cursor-not-allowed text-gray-400' : 'placeholder-gray-500'}`}
                                        />
                                        {!user?.dni && editingMode === 'info' && (
                                            <p className="text-xs text-yellow-500/80 mt-1">
                                                ⚠️ Una vez guardado, el DNI será permanente y no podrás modificarlo.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </form>

                            {/* --- Sección Seguridad --- */}
                            <form onSubmit={handleUpdatePassword} className="space-y-6 pt-6 border-t border-white/5">
                                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">lock</span>
                                        Seguridad
                                    </h3>
                                    {editingMode === 'password' ? (
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={cancelEditing}
                                                className="text-xs bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                className="text-xs bg-primary hover:bg-purple-600 text-white px-3 py-1.5 rounded-lg transition-colors font-bold shadow-lg shadow-primary/20"
                                            >
                                                Actualizar Contraseña
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setEditingMode('password')}
                                            disabled={editingMode !== 'none'}
                                            className="text-xs bg-white/5 hover:bg-white/10 text-primary px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            <span className="material-symbols-outlined text-sm">key</span>
                                            Cambiar Contraseña
                                        </button>
                                    )}
                                </div>

                                {editingMode === 'password' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Nueva Contraseña</label>
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Mínimo 6 caracteres"
                                                className="w-full rounded-lg border border-white/10 bg-surface-dark px-4 py-3 text-white focus:border-primary focus:outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Confirmar Contraseña</label>
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Repite la contraseña"
                                                className="w-full rounded-lg border border-white/10 bg-surface-dark px-4 py-3 text-white focus:border-primary focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                )}
                                {editingMode !== 'password' && (
                                    <div className="p-4 bg-surface-dark border border-white/5 rounded-lg text-sm text-gray-400">
                                        La contraseña está oculta por seguridad. Haz clic en "Cambiar Contraseña" para actualizarla.
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>

                {/* --- Certificate Modal --- */}
                {viewingCertificate && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                        <div className="relative w-full max-w-5xl bg-background-dark rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0f0f13]">
                                <h3 className="text-lg font-bold text-white">Vista de Certificado</h3>
                                <button
                                    onClick={() => setViewingCertificate(null)}
                                    className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <div className="overflow-y-auto p-4 md:p-8 bg-[#0f0f13]">
                                <CertificateDisplay
                                    studentName={user?.name || 'Estudiante'}
                                    studentDni={user?.dni || ''}
                                    courseName={viewingCertificate.title}
                                    completionDate={new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default UserProfile;