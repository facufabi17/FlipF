import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

// Definir tipo de perfil de BD para coincidir con columnas de Supabase
interface DbProfile {
    id: string;
    full_name: string;
    first_name?: string;
    last_name?: string;
    email: string;
    enrolled_courses: string[];
    owned_resources: string[];
    completed_modules: Record<string, string[]>;
    certificates: Record<string, string>;
    dni: string;
    avatar_url?: string;
    deletion_scheduled_at?: string | null;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
    loginWithGoogle: () => Promise<{ success: boolean; message?: string }>;
    register: (firstName: string, lastName: string, email: string, password: string, dni?: string) => Promise<{ success: boolean; message: string }>;
    logout: () => Promise<void>;
    enrollInCourse: (courseId: string) => Promise<void>;
    addResourceToUser: (resourceId: string) => Promise<void>;
    markModuleCompleted: (courseId: string, moduleId: string) => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<void>;
    issueCertificate: (courseId: string) => Promise<string | null>;
    purchaseItems: (items: { id: string, type: 'course' | 'resource' }[]) => Promise<void>;
    isAuthenticated: boolean;
    loading: boolean;
    createOrder: (items: any[], total: number, paymentMethod: string, status?: 'pending' | 'approved', billingData?: any) => Promise<any>;
    getOrders: () => Promise<any[]>;
    deleteAccount: () => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // 1. Definir fetchProfile primero para que esté disponible y estable
    const fetchProfile = async (supabaseUser: any): Promise<boolean> => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', supabaseUser.id)
                .single();

            if (error) {
                console.error("Error fetching profile:", error);
                // Crítico: Si el perfil falla al cargar, no podemos considerar al usuario "conectado" completamente
                // ya que podría faltarle datos críticos.
                setUser(null);
                return false;
            }

            // Mapeo seguro de tipos usando la estructura implícita de la interfaz DbProfile
            const profileData = data as DbProfile;

            // Si la cuenta estaba programada para eliminarse, la RECUPERAMOS automáticamente
            if (profileData.deletion_scheduled_at) {
                console.log("Account was scheduled for deletion. Restoring account automatically...");

                // Actualizar en base de datos para quitar el soft-delete inmediatamente
                const { error: restoreError } = await supabase
                    .from('profiles')
                    .update({ deletion_scheduled_at: null })
                    .eq('id', supabaseUser.id);

                if (restoreError) {
                    console.error("Error restoring account:", restoreError);
                } else {
                    // Notificar al usuario (usamos alert por simplicidad global en el contexto auth)
                    window.setTimeout(() => {
                        window.alert('¡Bienvenido de vuelta! La eliminación de tu cuenta ha sido cancelada.');
                    }, 500);
                }
            }

            setUser({
                id: supabaseUser.id,
                email: supabaseUser.email || '',
                name: profileData?.full_name || supabaseUser.user_metadata?.full_name || 'Usuario', // Fallback
                // firstName y lastName con soporte dual para registro por correo (first_name) y Google (given_name)
                firstName: profileData?.first_name || supabaseUser.user_metadata?.first_name || supabaseUser.user_metadata?.given_name,
                lastName: profileData?.last_name || supabaseUser.user_metadata?.last_name || supabaseUser.user_metadata?.family_name,

                enrolledCourses: profileData?.enrolled_courses || [],
                ownedResources: profileData?.owned_resources || [],
                progress: profileData?.completed_modules || {},
                certificates: profileData?.certificates || {},
                dni: profileData?.dni,
                avatar_url: profileData?.avatar_url || supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture
            });
            return true;
        } catch (err) {
            console.error("Fetch profile exception:", err);
            setUser(null);
            return false;
        }
    };

    // 2. Implementación de Auth
    useEffect(() => {
        let mounted = true;

        // A. Verificación Inicial de Sesión
        const initSession = async () => {
            try {
                // Verificar si tenemos un token de sesión en almacenamiento simplemente para evitar parpadeo si es posible,
                // pero confiar en getSession para la verdad.
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) throw error;

                if (session?.user && mounted) {
                    await fetchProfile(session.user);
                } else if (mounted) {
                    // Sin sesión
                    setUser(null);
                }
            } catch (error) {
                console.error("Session init error:", error);
                if (mounted) setUser(null);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        initSession();

        // B. Escucha de Auth - DEBE SER SÍNCRONO
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                //console.log(`Supabase Auth Event: ${event}`);

                if (event === 'SIGNED_OUT' || !session) {
                    if (mounted) {
                        setUser(null);
                        setLoading(false);
                    }
                    return;
                }

                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
                    // CRÍTICO: No esperar (await) aquí. Romper el bloqueo con setTimeout.
                    setTimeout(() => {
                        if (mounted && session?.user) {
                            fetchProfile(session.user).finally(() => {
                                if (mounted) setLoading(false);
                            });
                        }
                    }, 0);
                }
            }
        );

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const register = async (firstName: string, lastName: string, email: string, password: string, dni?: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: `${firstName} ${lastName}`.trim(),
                    first_name: firstName,
                    last_name: lastName,
                    ...(dni ? { dni } : {})
                }
            }
        });

        if (error) return { success: false, message: error.message };
        return { success: true, message: "Cuenta creada. ¡Ya puedes iniciar sesión!" };
    };

    const login = async (email: string, password: string) => {
        try {
            // No hay necesidad estricta de limpiar explícitamente si el cliente Supabase lo maneja, 
            // pero cerrar sesión primero asegura un estado limpio.
            await supabase.auth.signOut();

            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            return { success: true, message: "Bienvenido" };
        } catch (error: any) {
            console.error("Login error:", error);
            return { success: false, message: error.message || "Error al iniciar sesión" };
        }
    };

    const loginWithGoogle = async () => {
        try {
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

            if (error) throw error;
            return { success: true };
        } catch (error: any) {
            console.error("Google Login error:", error);
            return { success: false, message: error.message || "Error al iniciar sesión con Google" };
        }
    };

    const logout = async () => {
        try {
            // Actualización optimista de UI
            setUser(null);
            await supabase.auth.signOut();
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const deleteAccount = async () => {
        try {
            const { error } = await supabase.rpc('schedule_account_deletion');
            if (error) throw error;

            // Si la llamada fue exitosa cierro la sesión del usuario para "desactivarlo"
            await logout();
            return { success: true, message: "Cuenta programada para eliminación exitosamente." };
        } catch (error: any) {
            console.error("Error scheduling account deletion:", error);
            return { success: false, message: error.message || "No se pudo solicitar la eliminación de la cuenta." };
        }
    };

    // --- GUARDADO PERMANENTE EN BASE DE DATOS ---

    const enrollInCourse = async (courseId: string) => {
        if (!user) return;
        const newCourses = [...(user.enrolledCourses || []), courseId];

        const { error } = await supabase
            .from('profiles')
            .update({ enrolled_courses: newCourses })
            .eq('id', user.id);

        if (!error) setUser({ ...user, enrolledCourses: newCourses });
    };

    const addResourceToUser = async (resourceId: string) => {
        if (!user) return;
        const newResources = [...(user.ownedResources || []), resourceId];

        const { error } = await supabase
            .from('profiles')
            .update({ owned_resources: newResources })
            .eq('id', user.id);

        if (!error) setUser({ ...user, ownedResources: newResources });
    };

    const markModuleCompleted = async (courseId: string, moduleId: string) => {
        if (!user) return;

        try {
            // 1. Obtener el último progreso de la BD para asegurar atomicidad
            const { data: currentData, error: fetchError } = await supabase
                .from('profiles')
                .select('completed_modules')
                .eq('id', user.id)
                .single();

            if (fetchError) throw fetchError;

            // 2. Calcular nuevo progreso
            const dbProgress = (currentData?.completed_modules || {}) as Record<string, string[]>;
            const courseProgress = dbProgress[courseId] || [];

            if (!courseProgress.includes(moduleId)) {

                const newProgress = {
                    ...dbProgress,
                    [courseId]: [...courseProgress, moduleId]
                };

                // 3. Actualizar BD
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({ completed_modules: newProgress })
                    .eq('id', user.id);

                if (updateError) throw updateError;

                // 4. Actualizar estado local explícitamente con los nuevos datos confirmados
                setUser(prev => prev ? ({ ...prev, progress: newProgress }) : null);
            }
        } catch (error) {
            console.error("Error marking module completed:", error);
        }
    };

    const updateProfile = async (data: Partial<User>) => {
        if (!user) return;

        try {
            // 1. Actualizar Auth (Email/Password)
            if (data.email || data.password) {
                const attrs: any = {};
                if (data.email && data.email !== user.email) attrs.email = data.email;
                if (data.password) attrs.password = data.password;

                if (Object.keys(attrs).length > 0) {
                    const { error: authError } = await supabase.auth.updateUser(attrs);
                    if (authError) throw authError;
                }
            }

            // 2. Actualizar Perfil Público (Nombre, Apellido y DNI)
            if ((data.name && data.name !== user.name) || (data.dni && data.dni !== user.dni) || data.firstName || data.lastName) {
                const updates: any = {};
                // Si viene name antiguo, tratamos de guess? Mejor no tocar si no es explicito.
                // Pero si viene firstName/lastName, actualizamos full_name también
                if (data.firstName) updates.first_name = data.firstName;
                if (data.lastName) updates.last_name = data.lastName;

                // Sincronizar full_name si cambian las partes
                const newFirst = data.firstName || user.firstName || '';
                const newLast = data.lastName || user.lastName || '';
                if (data.firstName || data.lastName) {
                    updates.full_name = `${newFirst} ${newLast}`.trim();
                } else if (data.name) {
                    updates.full_name = data.name;
                }

                if (data.dni) updates.dni = data.dni;

                const { error: profileError } = await supabase
                    .from('profiles')
                    .update(updates)
                    .eq('id', user.id);

                if (profileError) throw profileError;
            }

            // 3. Actualizar Estado Local
            setUser({ ...user, ...data });

        } catch (error: any) {
            console.error("Error updating profile:", error);
            throw error; // Propagar a UI
        }
    };

    // --- CERTIFICADOS ---
    const issueCertificate = async (courseId: string): Promise<string | null> => {
        if (!user) return null;

        // 1. Verificar si ya existe
        if (user.certificates && user.certificates[courseId]) {
            return user.certificates[courseId];
        }

        // 2. Generar nuevo ID
        const newCertId = `FLIP-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
        const newCertificates = { ...(user.certificates || {}), [courseId]: newCertId };

        try {
            // 3. Guardar en Supabase
            // Intentamos actualizar la columna certificates. Si falla (por ejemplo, si no existe la columna), capturamos el error.
            const { error } = await supabase
                .from('profiles')
                .update({ certificates: newCertificates })
                .eq('id', user.id);

            if (error) {
                console.error("Error saving certificate to Supabase:", error);
                // Si el error es porque la columna no existe, podríamos intentar crearla o avisar
                // Por ahora, retornamos el ID generado localmente para que el usuario pueda ver su certificado,
                // aunque no persista si recarga.
                // throw error; 
            }

            // 4. Actualizar estado local
            setUser({ ...user, certificates: newCertificates });
            return newCertId;

        } catch (error) {
            console.error("Certificate issuance error:", error);
            // Retorno fallback local para no bloquear al usuario
            return newCertId;
        }
    };


    const purchaseItems = async (items: { id: string, type: 'course' | 'resource' }[]) => {
        if (!user) return;

        // 1. Calcular nuevo estado basado en el estado actual del usuario
        const newCourses = [...(user.enrolledCourses || [])];
        const newResources = [...(user.ownedResources || [])];

        let hasChanges = false;

        items.forEach(item => {
            if (item.type === 'course') {
                if (!newCourses.includes(item.id)) {
                    newCourses.push(item.id);
                    hasChanges = true;
                }
            } else if (item.type === 'resource') {
                if (!newResources.includes(item.id)) {
                    newResources.push(item.id);
                    hasChanges = true;
                }
            }
        });

        if (!hasChanges) return;

        // 2. Realizar actualización atómica única a Supabase
        const { error } = await supabase
            .from('profiles')
            .update({
                enrolled_courses: newCourses,
                owned_resources: newResources
            })
            .eq('id', user.id);

        if (error) {
            console.error("Error processing purchase:", error);
            throw error; // Relanzar para ser manejado por quien llama
        }

        // 3. Actualizar estado local inmediatamente
        setUser({
            ...user,
            enrolledCourses: newCourses,
            ownedResources: newResources
        });
    };

    return (
        <AuthContext.Provider value={{
            user, login, loginWithGoogle, register, logout, enrollInCourse, addResourceToUser,
            markModuleCompleted, updateProfile, purchaseItems, issueCertificate, deleteAccount, isAuthenticated: !!user, loading,
            createOrder: async (items: any[], total: number, paymentMethod: string, status: 'pending' | 'approved' = 'pending', billingData?: any) => {
                if (!user) return null;
                const { data, error } = await supabase
                    .from('orders')
                    .insert({
                        user_id: user.id,
                        items,
                        total,
                        payment_method: paymentMethod,
                        status,
                        ...(billingData || {})
                    })
                    .select()
                    .single();
                if (error) {
                    console.error("Error creating order:", error);
                    return null;
                }
                return data;
            },
            getOrders: async () => {
                if (!user) return [];
                const { data, error } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });
                if (error) {
                    console.error("Error fetching orders:", error);
                    return [];
                }
                return data;
            }
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};