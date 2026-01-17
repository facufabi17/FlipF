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
        <div className="animate-fade-in min-h-screen">
            <section className="p-6 lg:p-12 max-w-7xl mx-auto">
                <Link to="/academia" className="flex items-center gap-2 text-text-muted hover:text-white mb-8 transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span> Volver al catálogo
                </Link>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div>
                        <div className="relative rounded-2xl overflow-hidden border border-white/10 mb-8">
                            <img src={selectedCourse.image} alt={selectedCourse.title} className="w-full object-cover" />
                        </div>
                        <h2 className="text-4xl font-bold mb-6 text-white">{selectedCourse.title}</h2>
                        <p className="text-text-muted text-lg font-body mb-6">{selectedCourse.description}</p>
                        
                        <h3 className="text-xl font-bold text-white mb-4">Plan de Estudios</h3>
                        <div className="space-y-6">
                            {selectedCourse.modules.map((module, modIdx) => (
                                <div key={module.id}>
                                    <h4 className="text-primary font-bold uppercase text-sm tracking-wider mb-3 ml-1">
                                        {module.title}
                                    </h4>
                                    <div className="space-y-2">
                                        {module.lessons.map((lesson, lessonIdx) => (
                                            <div key={lesson.id} className="flex items-center justify-between p-4 bg-surface-dark rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-xs font-bold text-gray-300">
                                                        {modIdx + 1}.{lessonIdx + 1}
                                                    </span>
                                                    <div>
                                                        <span className="text-gray-200 font-bold block text-sm sm:text-base">{lesson.title}</span>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-500 bg-black/20 px-2 py-1 rounded whitespace-nowrap">{lesson.duration}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="lg:pl-10">
                        <div className="sticky top-24 glass-card p-8 rounded-3xl border border-primary/20">
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Precio Total</span>
                            <h4 className="text-4xl font-bold mb-6 text-white">${selectedCourse.price.toLocaleString()} ARS</h4>
                            
                            <ul className="space-y-4 mb-8 text-sm text-gray-300">
                                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary">check</span> Acceso de por vida</li>
                                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary">check</span> Certificado de finalización</li>
                                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary">check</span> Soporte prioritario</li>
                                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary">check</span> {selectedCourse.modules.length} Módulos / {totalLessons} Lecciones</li>
                            </ul>

                            {isEnrolled ? (
                                <button onClick={() => navigate(`/aula-virtual/${selectedCourse.id}`)} className="w-full bg-tech hover:bg-teal-400 text-black py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-tech/20">
                                    Ir al Aula Virtual <span className="material-symbols-outlined">school</span>
                                </button>
                            ) : isInCart ? (
                                <button onClick={() => navigate('/checkout')} className="w-full bg-accent hover:bg-pink-600 py-4 rounded-xl font-bold text-lg text-white transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-2">
                                    Ver en el Carrito <span className="material-symbols-outlined">shopping_cart_checkout</span>
                                </button>
                            ) : (
                                <button onClick={handleAddToCartClick} className="w-full bg-primary hover:bg-purple-600 py-4 rounded-xl font-bold text-lg text-white transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
                                    Agregar al Carrito <span className="material-symbols-outlined">add_shopping_cart</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CourseDetails;