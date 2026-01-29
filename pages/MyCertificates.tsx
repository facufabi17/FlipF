import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { COURSES } from '../data/courses';
import CertificateDisplay from '../components/CertificateDisplay';

const MyCertificates: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, loading } = useAuth();
    const [selectedCert, setSelectedCert] = useState<{ courseId: string, certId: string } | null>(null);

    // Redirigir si no está autenticado (aunque AuthHandler debería manejarlo, doble seguridad)
    if (!loading && !isAuthenticated) {
        navigate('/login');
        return null;
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-opacity-50"></div>
            </div>
        );
    }

    // Filtrar cursos para los cuales el usuario tiene certificado
    const userCertificates = user?.certificates || {};
    const certificateCourses = COURSES.filter(course => userCertificates[course.id]);

    return (
        <div className="animate-fade-in min-h-screen py-12 px-4 md:px-8 max-w-7xl mx-auto">
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">Mis <span className="text-primary">Certificados</span></h1>
                <p className="text-gray-400 text-lg">Aquí encontrarás todos los reconocimientos obtenidos por completar nuestros cursos.</p>
            </div>

            {certificateCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {certificateCourses.map(course => (
                        <div key={course.id} className="bg-surface-dark border border-white/5 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 group shadow-lg">
                            <div className="relative h-48 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute bottom-4 left-4 z-20">
                                    <span className="text-xs font-bold bg-primary/20 text-primary px-2 py-1 rounded border border-primary/20 mb-2 inline-block">
                                        COMPLETADO
                                    </span>
                                    <h3 className="text-xl font-bold text-white leading-tight">{course.title}</h3>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6 text-sm text-gray-400">
                                    <span>ID: {userCertificates[course.id]}</span>
                                    <span className="material-symbols-outlined text-yellow-500">verified</span>
                                </div>

                                <button
                                    onClick={() => setSelectedCert({ courseId: course.id, certId: userCertificates[course.id] })}
                                    className="w-full bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border border-white/5 group-hover:border-primary/30"
                                >
                                    <span className="material-symbols-outlined">visibility</span>
                                    Ver Certificado
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-surface-dark rounded-3xl border border-white/5 text-center px-4">
                    <div className="bg-white/5 p-6 rounded-full mb-6">
                        <span className="material-symbols-outlined text-6xl text-gray-600">workspace_premium</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Aún no tienes certificados</h2>
                    <p className="text-gray-400 max-w-md mb-8">Completa cursos en nuestra academia para obtener tus certificaciones profesionales.</p>
                    <button
                        onClick={() => navigate('/academia')}
                        className="bg-primary hover:bg-purple-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
                    >
                        Ir a la Academia
                    </button>
                </div>
            )}

            {/* Modal de Certificado */}
            {selectedCert && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedCert(null)}>
                    <div className="bg-[#1a1a2e] rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative shadow-2xl border border-white/10" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedCert(null)}
                            className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        <div className="p-4 md:p-8">
                            <CertificateDisplay
                                studentName={user?.name || 'Estudiante'}
                                studentDni={user?.dni || ''}
                                courseName={COURSES.find(c => c.id === selectedCert.courseId)?.title || 'Curso'}
                                completionDate={new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                                uniqueId={selectedCert.certId}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyCertificates;
