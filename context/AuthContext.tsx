import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

// Define DB Profile type to match Supabase columns
interface DbProfile {
    id: string;
    full_name: string;
    email: string;
    enrolled_courses: string[];
    owned_resources: string[];
    completed_modules: Record<string, string[]>;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
    register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
    logout: () => Promise<void>;
    enrollInCourse: (courseId: string) => Promise<void>;
    addResourceToUser: (resourceId: string) => Promise<void>;
    markModuleCompleted: (courseId: string, moduleId: string) => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<void>;
    purchaseItems: (items: { id: string, type: 'course' | 'resource' }[]) => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    // Initial Session Check with robust error handling
    useEffect(() => {
        let mounted = true;

        const getInitialSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) throw error;

                if (session?.user && mounted) {
                    await fetchProfile(session.user);
                }
            } catch (error) {
                console.error("Session check failed:", error);
                // If session is invalid, force sign out to clean state
                await supabase.auth.signOut();
                if (mounted) setUser(null);
            }
        };

        getInitialSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            // Manejo explícito de eventos
            if (event === 'SIGNED_IN' && session?.user && mounted) {
                await fetchProfile(session.user);
            } else if (event === 'SIGNED_OUT' || !session) {
                if (mounted) {
                    setUser(null);
                    // Opcional: limpiar localStorage si queda basura de sesiones viejas
                    localStorage.removeItem('supabase.auth.token');
                }
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const fetchProfile = async (supabaseUser: any) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', supabaseUser.id)
                .single();

            if (error) {
                console.error("Error fetching profile:", error);
                return;
            }

            // Type-safe mapping using DbProfile interface implicit structure
            const profileData = data as DbProfile;

            setUser({
                id: supabaseUser.id,
                email: supabaseUser.email || '',
                name: profileData?.full_name || supabaseUser.user_metadata?.full_name || 'Usuario',
                enrolledCourses: profileData?.enrolled_courses || [],
                ownedResources: profileData?.owned_resources || [],
                progress: profileData?.completed_modules || {}
            });
        } catch (err) {
            console.error("Fetch profile exception:", err);
        }
    };

    const register = async (name: string, email: string, password: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: name }
            }
        });

        if (error) return { success: false, message: error.message };
        return { success: true, message: "Cuenta creada. ¡Ya puedes iniciar sesión!" };
    };

    const login = async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) return { success: false, message: error.message };
            return { success: true, message: "Bienvenido" };
        } catch (error: any) {
            return { success: false, message: error.message || "Error desconocido al iniciar sesión" };
        }
    };

    const logout = async () => {
        try {
            setUser(null); // Clear local state immediately for UI responsiveness
            await supabase.auth.signOut();
        } catch (error) {
            console.error("Error signing out:", error);
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
            // 1. Fetch latest progress from DB to ensure atomicity
            const { data: currentData, error: fetchError } = await supabase
                .from('profiles')
                .select('completed_modules')
                .eq('id', user.id)
                .single();

            if (fetchError) throw fetchError;

            // 2. Calculate new progress
            const dbProgress = (currentData?.completed_modules || {}) as Record<string, string[]>;
            const courseProgress = dbProgress[courseId] || [];

            if (!courseProgress.includes(moduleId)) {

                const newProgress = {
                    ...dbProgress,
                    [courseId]: [...courseProgress, moduleId]
                };

                // 3. Update DB
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({ completed_modules: newProgress })
                    .eq('id', user.id);

                if (updateError) throw updateError;

                // 4. Update local state explicitly with the new confirmed data
                setUser(prev => prev ? ({ ...prev, progress: newProgress }) : null);
            }
        } catch (error) {
            console.error("Error marking module completed:", error);
        }
    };

    const updateProfile = async (data: Partial<User>) => {
        if (!user) return;
        const { error } = await supabase
            .from('profiles')
            .update({ full_name: data.name })
            .eq('id', user.id);

        if (!error) setUser({ ...user, ...data });
    };

    const purchaseItems = async (items: { id: string, type: 'course' | 'resource' }[]) => {
        if (!user) return;

        // 1. Calculate new state based on current user state
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

        // 2. Perform single atomic update to Supabase
        const { error } = await supabase
            .from('profiles')
            .update({
                enrolled_courses: newCourses,
                owned_resources: newResources
            })
            .eq('id', user.id);

        if (error) {
            console.error("Error processing purchase:", error);
            throw error; // Re-throw to be handled by caller
        }

        // 3. Update local state immediately
        setUser({
            ...user,
            enrolledCourses: newCourses,
            ownedResources: newResources
        });
    };

    return (
        <AuthContext.Provider value={{
            user, login, register, logout, enrollInCourse, addResourceToUser,
            markModuleCompleted, updateProfile, purchaseItems, isAuthenticated: !!user
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