import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { COURSES } from '../data/courses';

interface CourseDetailsProps {
    onShowToast: (text: string, type?: 'success' | 'error') => void;
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ onShowToast }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { addToCart, cart } = useCart();

    const selectedCourse = COURSES.find(c => c.id === id);

    if (!selectedCourse) {
        return <div className="p-20 text-center text-white">Curso no encontrado</div>;
    }

    const isEnrolled = user?.enrolledCourses?.includes(selectedCourse.id);
    const isInCart = cart.some(item => item.id === selectedCourse.id);

    // Calcular total de lecciones para mostrar
    const totalLessons = selectedCourse.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);

    const handleAddToCartClick = () => {
        // Obligar inicio de sesión
        if (!isAuthenticated) {
            onShowToast('Debes iniciar sesión para agregar al carrito', 'error');
            navigate('/login');
            return;
        }

        if (isInCart) {
            navigate('/checkout');
            return;
        }

        addToCart({
            id: selectedCourse.id,
            title: selectedCourse.title,
            price: selectedCourse.price,
            image: selectedCourse.image,
            type: 'course'
        });

        onShowToast('Curso agregado al carrito', 'success');
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none mix-blend-overlay"></div>
            <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#00F5F1]/5 to-transparent pointer-events-none"></div>

            <section className="relative px-6 py-24 lg:pt-8 lg:pb-24 max-w-7xl mx-auto">
                <Link to="/academia" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00F5F1] mb-8 transition-colors group">
                    <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    Volver a la Biblioteca
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Course Info & Curriculum */}
                    <div className="lg:col-span-8">
                        {/* Course Header */}
                        <div className="mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="inline-block px-3 py-1 rounded-full bg-[#00F5F1]/10 text-[#00F5F1] text-xs font-bold border border-[#00F5F1]/20 uppercase tracking-wider">
                                    {selectedCourse.category}
                                </div>
                                <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold border border-white/20 uppercase tracking-wider">
                                    Nivel {selectedCourse.level || 'Intermedio'}
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                                {selectedCourse.title}
                            </h1>
                            <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-3xl">
                                {selectedCourse.description}
                            </p>
                        </div>

                        {/* Curriculum Section */}
                        <div className="mb-12">
                            <div className="flex items-center gap-3 mb-8">
                                <span className="material-symbols-outlined text-[#00F5F1] text-2xl">menu_book</span>
                                <h2 className="text-2xl font-bold">Plan de Estudios</h2>
                            </div>

                            <div className="space-y-8">
                                {selectedCourse.modules.length > 0 ? (
                                    selectedCourse.modules.map((module, modIdx) => (
                                        <div key={module.id} className="relative pl-6 border-l border-white/10 ml-3">
                                            {/* Module Title */}
                                            <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-[#00F5F1] shadow-[0_0_10px_rgba(0,245,241,0.5)]"></div>
                                            <h3 className="text-lg font-bold text-white mb-4 -mt-1.5 flex items-center gap-3">
                                                <span className="text-gray-500 font-mono text-sm">Módulo {modIdx + 1}:</span>
                                                {module.title}
                                            </h3>

                                            {/* Lessons List */}
                                            <div className="space-y-3">
                                                {module.lessons.map((lesson, lessonIdx) => (
                                                    <div key={lesson.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:border-white/10 transition-all group">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-xs text-gray-400 font-mono border border-white/5 group-hover:text-[#00F5F1] group-hover:border-[#00F5F1]/30 transition-colors">
                                                                {lessonIdx + 1}
                                                            </div>
                                                            <span className="text-gray-300 font-medium group-hover:text-white transition-colors">
                                                                {lesson.title}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-gray-500 font-mono bg-black/40 px-2 py-1 rounded border border-white/5">
                                                            {lesson.duration}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 bg-white/5 border border-dashed border-white/10 rounded-2xl text-center text-gray-400">
                                        No hay módulos cargados para este curso aún.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Pricing Card */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-32">
                            <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
                                {/* Course Image */}
                                <div className="h-48 relative overflow-hidden">
                                    <img src={selectedCourse.image} alt={selectedCourse.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent"></div>
                                </div>

                                <div className="p-8 pt-2">
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Precio Único</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl font-black text-white">${selectedCourse.price.toLocaleString()}</span>
                                            <span className="text-sm text-gray-400">ARS</span>
                                        </div>
                                    </div>

                                    <ul className="space-y-4 mb-6">
                                        <li className="flex items-start gap-3 text-gray-300 text-sm">
                                            <span className="material-symbols-outlined text-[#00F5F1] text-lg mt-0.5">check_circle</span>
                                            <span>Acceso inmediato y de por vida</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-gray-300 text-sm">
                                            <span className="material-symbols-outlined text-[#00F5F1] text-lg mt-0.5">check_circle</span>
                                            <span>Certificado avalado por Flip</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-gray-300 text-sm">
                                            <span className="material-symbols-outlined text-[#00F5F1] text-lg mt-0.5">check_circle</span>
                                            <span>{selectedCourse.modules.length} Módulos estratégicos</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-gray-300 text-sm">
                                            <span className="material-symbols-outlined text-[#00F5F1] text-lg mt-0.5">check_circle</span>
                                            <span>Recursos y plantillas descargables</span>
                                        </li>
                                    </ul>

                                    <div className="space-y-3">
                                        {isEnrolled ? (
                                            <button
                                                onClick={() => navigate(`/aula-virtual/${selectedCourse.id}`)}
                                                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00F5F1] to-[#00d8d5] text-black font-bold text-lg hover:shadow-[0_0_20px_rgba(0,245,241,0.4)] transition-all flex items-center justify-center gap-2"
                                            >
                                                <span className="material-symbols-outlined">school</span>
                                                Ir al Aula Virtual
                                            </button>
                                        ) : isInCart ? (
                                            <button
                                                onClick={() => navigate('/checkout')}
                                                className="w-full py-4 rounded-xl bg-gray-800 text-white font-bold text-lg border border-white/10 hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
                                            >
                                                <span className="material-symbols-outlined">shopping_cart_checkout</span>
                                                Finalizar Compra
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleAddToCartClick}
                                                className="w-full py-4 rounded-xl bg-[#00F5F1]/10 text-[#00F5F1] font-bold text-lg border border-[#00F5F1]/50 hover:bg-[#00F5F1] hover:text-black transition-all flex items-center justify-center gap-2 group"
                                            >
                                                <span className="material-symbols-outlined group-hover:scale-110 transition-transform">add_shopping_cart</span>
                                                Agregar al Carrito
                                            </button>
                                        )}

                                        {!isEnrolled && (
                                            <p className="text-xs text-center text-gray-500 mt-4">
                                                Garantía de satisfacción de 7 días.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CourseDetails;