import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { COURSES } from '../data/courses';

const MyCourses: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, loading } = useAuth();

    React.useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login');
        }
    }, [loading, isAuthenticated, navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary border-opacity-50"></div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    const myCourses = COURSES.filter(course => user?.enrolledCourses?.includes(course.id));

    return (
        <div className="animate-fade-in min-h-screen">
            <section className="p-6 lg:p-12 max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate('/academia')} className="text-text-muted hover:text-white transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h2 className="text-4xl font-bold">Mi Aula Virtual</h2>
                </div>

                {myCourses.length === 0 ? (
                    <div className="text-center py-20 bg-surface-dark rounded-2xl border border-white/5">
                        <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">school</span>
                        <h3 className="text-xl font-bold text-white mb-2">Aún no tienes cursos</h3>
                        <p className="text-gray-400 mb-6">Explora nuestro catálogo para comenzar a aprender.</p>
                        <button onClick={() => navigate('/academia')} className="bg-primary px-6 py-2 rounded-lg text-white font-bold">Ir al Catálogo</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {myCourses.map(course => {
                            // Calcular el total de lecciones sumando los arrays de lecciones de cada módulo
                            const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);

                            return (
                                <div key={course.id} className="glass-card rounded-2xl overflow-hidden group hover:border-tech transition-all duration-300 cursor-pointer" onClick={() => navigate(`/aula-virtual/${course.id}`)}>
                                    <div className="relative h-40 bg-gray-900 overflow-hidden">
                                        <img src={course.image} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" alt={course.title} />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background-dark/40">
                                            <span className="material-symbols-outlined text-white text-5xl">play_circle</span>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <h3 className="text-lg font-bold group-hover:text-tech transition-colors">{course.title}</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                                <span className="text-text-muted">Progreso</span>
                                                <span className="text-tech">0%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-tech" style={{ width: '0%' }}></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-gray-400 border-t border-white/5 pt-3">
                                            <span>{course.modules.length} Módulos</span>
                                            <span>{totalLessons} Lecciones</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
};

export default MyCourses;