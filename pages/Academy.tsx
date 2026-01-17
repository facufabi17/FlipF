import React from 'react';
import { useNavigate } from 'react-router-dom';
import { COURSES } from '../data/courses';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Academy: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { addToCart, cart } = useCart();

    const handleAddToCart = (e: React.MouseEvent, course: typeof COURSES[0]) => {
        e.stopPropagation(); // Evitar navegar al detalle
        
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        addToCart({
            id: course.id,
            title: course.title,
            price: course.price,
            image: course.image,
            type: 'course'
        });
    };

    return (
        <div className="animate-fade-in min-h-screen">
            <section className="p-6 lg:p-12 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Lleva tu Negocio al <span className="text-primary">siguiente nivel</span></h2>
                        <p className="text-text-muted text-lg font-body">Aprende las estrategias que usamos en Flip para escalar operaciones.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {COURSES.map(course => {
                        const isEnrolled = user?.enrolledCourses?.includes(course.id);
                        const isInCart = cart.some(item => item.id === course.id);

                        return (
                            <div key={course.id} className="glass-card rounded-2xl overflow-hidden group hover:border-primary transition-all duration-300 flex flex-col cursor-pointer" onClick={() => navigate(`/academia/${course.id}`)}>
                                <div className="relative h-48 bg-gray-900 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark to-transparent z-10"></div>
                                    <img src={course.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={course.title} />
                                    <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                                        {course.category}
                                    </div>
                                </div>
                                <div className="p-6 space-y-4 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{course.title}</h3>
                                    <p className="text-sm text-text-muted flex-1">{course.description}</p>
                                    <div className="flex items-center justify-between pt-4 border-t border-white/5 gap-2">
                                        <span className="text-2xl font-bold text-white">${course.price.toLocaleString()} <span className="text-sm font-normal text-text-muted">ARS</span></span>
                                        
                                        <div className="flex items-center gap-2">
                                            {/* Info Button */}
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); navigate(`/academia/${course.id}`); }}
                                                className="flex items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10"
                                                title="Ver Información"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">info</span>
                                            </button>

                                            {isEnrolled ? (
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); navigate(`/aula-virtual/${course.id}`); }}
                                                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all"
                                                >
                                                    Ver Aula
                                                </button>
                                            ) : isInCart ? (
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); navigate('/checkout'); }}
                                                    className="bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all"
                                                >
                                                    En Carrito
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={(e) => handleAddToCart(e, course)}
                                                    className="bg-primary hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                                                    Agregar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default Academy;