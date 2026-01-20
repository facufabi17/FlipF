import React, { useState } from 'react';
import { PAID_RESOURCES } from '../data/resources';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface PaidResourcesProps {
    onShowToast?: (text: string, type?: 'success' | 'error') => void;
}

const PaidResources: React.FC<PaidResourcesProps> = ({ onShowToast }) => {
    const { addToCart, cart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [filter, setFilter] = useState('Todos');
    const [selectedResource, setSelectedResource] = useState<typeof PAID_RESOURCES[0] | null>(null);

    // Filtro de categorías
    const categories = ['Todos', ...Array.from(new Set(PAID_RESOURCES.map(r => r.category)))];
    
    const filteredResources = filter === 'Todos' 
        ? PAID_RESOURCES 
        : PAID_RESOURCES.filter(r => r.category === filter);

    const handleAddToCart = (resource: typeof PAID_RESOURCES[0]) => {
        // 1. Obligar a iniciar sesión
        if (!isAuthenticated) {
            if (onShowToast) onShowToast('Debes iniciar sesión para comprar', 'error');
            navigate('/login');
            return;
        }

        // 2. Agregar al carrito unificado
        addToCart({
            id: resource.id,
            title: resource.title,
            price: resource.price,
            image: resource.image,
            type: 'resource'
        });

        if (onShowToast) onShowToast('Agregado al carrito', 'success');
        if (selectedResource) setSelectedResource(null); // Cerrar modal si se agrega desde ahí
    };

    return (
        <div className="animate-fade-in">
            <section className="relative overflow-hidden bg-[#1b131f] py-16 px-4 md:py-24">
                <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#842db4 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/20 blur-[100px]"></div>
                
                <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
                    <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-tech backdrop-blur-sm">
                        <span className="material-symbols-outlined mr-1 text-[16px]">verified</span> Recursos Verificados
                    </div>
                    <h1 className="font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl text-white">
                        Biblioteca de <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#b39ac1]">Conocimiento</span>
                    </h1>
                    <p className="max-w-xl text-lg text-[#b39ac1]">Herramientas operativas, guiones tácticos y sistemas de crecimiento. Diseñados para descargar e implementar hoy mismo.</p>
                </div>
            </section>

            <div className="mx-auto max-w-[1200px] px-4 pb-20 md:px-10">
                {/* Filtros */}
                <div className="mb-10 overflow-x-auto pb-2">
                    <div className="flex gap-3">
                        {categories.map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`flex shrink-0 items-center gap-2 rounded-lg border px-5 py-2 text-sm font-bold transition-colors ${filter === cat ? 'border-primary bg-primary/20 text-white' : 'border-white/10 bg-card-bg text-[#b39ac1] hover:border-white/30'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                     {filteredResources.map(resource => {
                         const isOwned = user?.ownedResources?.includes(resource.id);
                         const isInCart = cart.some(item => item.id === resource.id);

                         return (
                            <article key={resource.id} className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-card-bg transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
                                <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-800">
                                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(27,19,31,0.9) 100%), url("${resource.image}")` }}></div>
                                    <div className="absolute left-3 top-3 rounded bg-tech/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-black backdrop-blur-md">
                                        {resource.type}
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col p-5">
                                    <h3 className="mb-2 text-lg font-bold leading-tight text-white group-hover:text-primary transition-colors">{resource.title}</h3>
                                    <p className="mb-4 line-clamp-3 text-sm text-[#b39ac1]">{resource.description}</p>
                                    
                                    <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4 gap-2">
                                        <span className="text-xl font-bold text-white">${resource.price.toLocaleString()}</span>
                                        
                                        <div className="flex items-center gap-2">
                                            {/* Info Button */}
                                            <button 
                                                onClick={() => setSelectedResource(resource)}
                                                className="flex items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10"
                                                title="Ver Información"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">info</span>
                                            </button>

                                            {isOwned ? (
                                                <button 
                                                    onClick={() => navigate('/mis-recursos')}
                                                    className="flex items-center gap-1 rounded-lg bg-green-500/20 border border-green-500/50 px-4 py-2 text-sm font-bold text-green-400 hover:bg-green-500/30"
                                                >
                                                    <span>Ver</span>
                                                    <span className="material-symbols-outlined text-[16px]">folder_open</span>
                                                </button>
                                            ) : isInCart ? (
                                                <button 
                                                    onClick={() => navigate('/checkout')}
                                                    className="flex items-center gap-1 rounded-lg bg-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/20"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
                                                    En carrito
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => handleAddToCart(resource)}
                                                    className="flex items-center gap-1 rounded-lg bg-cta px-4 py-2 text-sm font-bold text-white shadow-lg shadow-cta/20 hover:bg-[#d9006c] active:scale-95 transition-transform"
                                                >
                                                    <span>Agregar</span>
                                                    <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </article>
                         );
                     })}
                </div>
            </div>

            {/* RESOURCE INFO MODAL */}
            {selectedResource && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-surface-dark w-full max-w-2xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
                        <button 
                            onClick={() => setSelectedResource(null)}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        <div className="md:w-1/2 h-64 md:h-auto relative">
                             <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${selectedResource.image}")` }}></div>
                             <div className="absolute inset-0 bg-gradient-to-t from-surface-dark to-transparent md:bg-gradient-to-r"></div>
                        </div>

                        <div className="md:w-1/2 p-8 flex flex-col">
                            <div className="mb-4">
                                <span className="inline-block px-2 py-1 rounded bg-tech/20 text-tech text-xs font-bold uppercase tracking-wider mb-2 border border-tech/30">
                                    {selectedResource.category}
                                </span>
                                <h2 className="text-2xl font-bold text-white mb-2">{selectedResource.title}</h2>
                                <p className="text-gray-400 text-sm leading-relaxed">{selectedResource.description}</p>
                            </div>

                            <div className="mt-auto pt-6 border-t border-white/5">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm text-gray-400">Precio</span>
                                    <span className="text-3xl font-bold text-white">${selectedResource.price.toLocaleString()}</span>
                                </div>

                                {user?.ownedResources?.includes(selectedResource.id) ? (
                                    <button 
                                        onClick={() => navigate('/mis-recursos')}
                                        className="w-full bg-green-500/20 border border-green-500/50 text-green-400 font-bold py-3 rounded-lg hover:bg-green-500/30 transition-all flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">folder_open</span>
                                        Ir a Mis Recursos
                                    </button>
                                ) : cart.some(i => i.id === selectedResource.id) ? (
                                    <button 
                                        onClick={() => navigate('/checkout')}
                                        className="w-full bg-white/10 text-white font-bold py-3 rounded-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">shopping_cart_checkout</span>
                                        Ver Carrito
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => handleAddToCart(selectedResource)}
                                        className="w-full bg-cta text-white font-bold py-3 rounded-lg hover:bg-[#d9006c] transition-all flex items-center justify-center gap-2 shadow-lg shadow-cta/20"
                                    >
                                        <span className="material-symbols-outlined">add_shopping_cart</span>
                                        Agregar al Carrito
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaidResources;