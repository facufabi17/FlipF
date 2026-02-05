import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { COURSES } from '../data/courses';

interface VerificationResult {
    isValid: boolean;
    data?: {
        studentName: string;
        studentDni: string;
        courseName: string;
        issueDate?: string; // Por ahora usaremos la fecha actual o genérica si no está disponible
    };
    error?: string;
}

const VerifyCertificate: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState<VerificationResult | null>(null);

    useEffect(() => {
        const verify = async () => {
            if (!id) {
                setResult({ isValid: false, error: 'ID de certificado no proporcionado.' });
                setLoading(false);
                return;
            }

            try {
                // Llamada a la RPC creada en Supabase
                const { data, error } = await supabase
                    .rpc('get_profile_by_certificate', { cert_id_input: id });

                if (error) throw error;

                if (data && data.length > 0) {
                    const profile = data[0];
                    const course = COURSES.find(c => c.id === profile.course_id);

                    setResult({
                        isValid: true,
                        data: {
                            studentName: profile.full_name,
                            studentDni: profile.dni,
                            courseName: course?.title || 'Curso no encontrado',
                            issueDate: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
                            // TODO: Si guardamos fecha real, usarla.
                        }
                    });
                } else {
                    setResult({ isValid: false, error: 'No se encontró ningún certificado con este ID.' });
                }

            } catch (err) {
                console.error("Verification error:", err);
                setResult({ isValid: false, error: 'Hubo un error al verificar el certificado.' });
            } finally {
                setLoading(false);
            }
        };

        verify();
    }, [id]);

    return (
        <div className="min-h-screen bg-[#0f0f13] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[128px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[128px] pointer-events-none"></div>

            <div className="w-full max-w-2xl z-10 animate-fade-in text-center">
                {/* Header Logo */}
                <Link to="/" className="inline-flex items-center gap-3 mb-12 hover:opacity-80 transition-opacity">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 border border-white/5">
                        <svg className="w-8 h-8 fill-white" viewBox="0 0 1080 1080">
                            <defs>
                                <style>{`.cls-1 { fill: #FFF; stroke-width: 0px; }`}</style>
                            </defs>
                            <path className="cls-1" d="M748.89,237.28h-364.86c-10.55,0-20.67,4.19-28.13,11.65l-56.26,56.26c-7.46,7.46-11.65,17.58-11.65,28.13v444.42c0,10.55,4.19,20.67,11.65,28.13l56.26,56.26c7.46,7.46,17.58,11.65,28.13,11.65h46.64c10.55,0,20.67-4.19,28.13-11.65l67.87-67.89v-.02h142.65c10.55,0,20.67-4.19,28.13-11.65l56.26-56.27c7.46-7.46,11.65-17.58,11.65-28.13v-46.61c0-10.55-4.19-20.67-11.65-28.13l-56.26-56.26c-7.46-7.46-17.58-11.65-28.13-11.65h-102.87c-21.97,0-39.78-17.81-39.78-39.78h0c0-21.97,17.81-39.78,39.78-39.78h182.43c10.55,0,20.67-4.19,28.13-11.65l56.26-56.26c7.46-7.46,11.65-17.58,11.65-28.13v-46.61c0-10.55-4.19-20.67-11.65-28.13l-56.26-56.26c-7.46-7.46-17.58-11.65-28.13-11.65ZM725.59,396.4h-182.43c-10.55,0-20.67,4.19-28.13,11.65l-56.26,56.26c-7.46,7.46-11.65,17.58-11.65,28.13v46.61c0,10.55,4.19,20.67,11.65,28.13l56.26,56.26c7.46,7.46,17.58,11.65,28.13,11.65h102.87c21.97,0,39.78,17.81,39.78,39.78h0c0,21.97-17.81,39.78-39.78,39.78h-102.87c-10.55,0-20.67,4.19-28.14,11.66l-56.22,56.25c-7.46,7.46-17.58,11.66-28.14,11.66h-23.33c-21.97,0-39.78-17.81-39.78-39.78v-397.81c0-21.97,17.81-39.78,39.78-39.78h318.25c21.97,0,39.78,17.81,39.78,39.78h0c0,21.97-17.81,39.78-39.78,39.78Z" />
                        </svg>
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-white">Flip Manager</span>
                </Link>

                {loading ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-surface-dark/50 backdrop-blur border border-white/5 rounded-3xl">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-opacity-50 mb-4"></div>
                        <p className="text-gray-400">Verificando autenticidad del certificado...</p>
                    </div>
                ) : result?.isValid ? (
                    <div className="relative bg-[#1a1a2e] border border-primary/20 p-8 md:p-12 rounded-3xl shadow-2xl overflow-hidden">

                        {/* Status Badge */}
                        <div className="absolute top-0 right-0 bg-green-500/10 text-green-400 px-6 py-2 rounded-bl-2xl font-bold text-sm uppercase tracking-wider border-b border-l border-green-500/20 flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">verified</span>
                            Certificado Validado
                        </div>

                        <div className="mb-8">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary border border-primary/20">
                                <span className="material-symbols-outlined text-4xl">workspace_premium</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Certificado de Finalización</h1>
                            <p className="text-gray-400">Verificación Oficial de Flip Manager</p>
                        </div>

                        <div className="space-y-6 text-left bg-black/20 p-6 rounded-2xl border border-white/5">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Estudiante</p>
                                <p className="text-xl text-white font-bold">{result.data?.studentName}</p>
                                <p className="text-sm text-gray-400 font-mono">DNI: {result.data?.studentDni}</p>
                            </div>

                            <div className="h-px bg-white/5 w-full"></div>

                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Curso Completado</p>
                                <p className="text-xl text-primary font-bold">{result.data?.courseName}</p>
                            </div>

                            <div className="h-px bg-white/5 w-full"></div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">ID del Certificado</p>
                                    <p className="text-sm text-white font-mono">{id}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Estado</p>
                                    <p className="text-sm text-green-400 font-bold flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        Válido
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col gap-3">
                            <p className="text-xs text-gray-500 mb-2">Este documento certifica que el estudiante ha completado satisfactoriamente todos los requisitos académicos del curso.</p>
                            <Link to="/academia" className="text-primary hover:text-white text-sm font-bold transition-colors">
                                Ver más cursos en Flip Manager
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="bg-red-500/10 border border-red-500/20 p-8 md:p-12 rounded-3xl text-center">
                        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 border border-red-500/20">
                            <span className="material-symbols-outlined text-4xl">gpp_bad</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">Certificado No Encontrado</h2>
                        <p className="text-gray-300 mb-8 max-w-md mx-auto">{result?.error || 'El ID proporcionado no corresponde a ningún certificado válido en nuestros registros.'}</p>

                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <Link to="/" className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-all">
                                Ir al Inicio
                            </Link>
                            <Link to="/ayuda" className="bg-primary hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20">
                                Contactar Soporte
                            </Link>
                        </div>
                    </div>
                )}

                <div className="mt-12 text-center">
                    <p className="text-xs text-gray-600">
                        © {new Date().getFullYear()} Flip Manager. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyCertificate;
