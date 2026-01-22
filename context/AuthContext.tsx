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
    const [loading, setLoading] = useState(true);

    // 1. Define fetchProfile first so it's available and stable
    const fetchProfile = async (supabaseUser: any): Promise<boolean> => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', supabaseUser.id)
                .single();

            if (error) {
                console.error("Error fetching profile:", error);
                // Critical: If profile fails to load, we cannot consider the user "logged in" fully
                // as they might be missing critical data.
                setUser(null);
                return false;
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
            return true;
        } catch (err) {
            console.error("Fetch profile exception:", err);
            setUser(null);
            return false;
        }
    };

    // 2. Auth Implementation
    useEffect(() => {
        let mounted = true;

        // A. Initial Session Check
        const initSession = async () => {
            try {
                // Check if we have a session token in storage simply to avoid flash if possible,
                // but rely on getSession for truth.
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) throw error;

                if (session?.user && mounted) {
                    await fetchProfile(session.user);
                } else if (mounted) {
                    // No session
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

        // B. Auth Listener - MUST BE SYNCHRONOUS
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                console.log(`Supabase Auth Event: ${event}`);

                if (event === 'SIGNED_OUT' || !session) {
                    if (mounted) {
                        setUser(null);
                        setLoading(false);
                    }
                    return;
                }

                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
                    // CRITICAL: Do not await here. Break the deadlock with setTimeout.
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
            // No strict need to clear explicitly if Supabase client handles it, 
            // but signing out first ensures clean slate.
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

    const logout = async () => {
        try {
            // Optimistic UI update
            setUser(null);
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

        try {
            // 1. Update Auth (Email/Password)
            if (data.email || data.password) {
                const attrs: any = {};
                if (data.email && data.email !== user.email) attrs.email = data.email;
                if (data.password) attrs.password = data.password;

                if (Object.keys(attrs).length > 0) {
                    const { error: authError } = await supabase.auth.updateUser(attrs);
                    if (authError) throw authError;
                }
            }

            // 2. Update Public Profile (Name)
            if (data.name && data.name !== user.name) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({ full_name: data.name })
                    .eq('id', user.id);

                if (profileError) throw profileError;
            }

            // 3. Update Local State
            setUser({ ...user, ...data });

        } catch (error: any) {
            console.error("Error updating profile:", error);
            throw error; // Propagate to UI
        }
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background-dark">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-opacity-50"></div>
            </div>
        );
    }

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