import React, { useState, useMemo } from 'react';
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

    // --- State ---
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedResource, setSelectedResource] = useState<typeof PAID_RESOURCES[0] | null>(null);

    // --- Derived Data ---
    const categories = useMemo(() => {
        const cats = new Set(PAID_RESOURCES.map(r => r.category));
        return Array.from(cats);
    }, []);

    const filteredResources = useMemo(() => {
        return PAID_RESOURCES.filter(resource => {
            // 1. Text Search
            const matchesSearch = (
                resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resource.category.toLowerCase().includes(searchTerm.toLowerCase())
            );

            // 2. Category Filter
            const matchesCategory = selectedCategory ? resource.category === selectedCategory : true;

            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory]);

    // --- Handlers ---
    const handleAddToCart = (resource: typeof PAID_RESOURCES[0]) => {
        if (!isAuthenticated) {
            if (onShowToast) onShowToast('Debes iniciar sesión para comprar', 'error');
            navigate('/login');
            return;
        }

        addToCart({
            id: resource.id,
            title: resource.title,
            price: resource.price,
            image: resource.image,
            type: 'resource'
        });

        if (onShowToast) onShowToast('Agregado al carrito', 'success');
        if (selectedResource) setSelectedResource(null);
    };

    const handleCategoryFilter = (cat: string | null) => {
        setSelectedCategory(prev => prev === cat ? null : cat);
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-black text-white font-sans selection:bg-[#8B5CF6] selection:text-white">

            {/* --- SECCIÓN 1: HERO (VIOLETA) --- */}
            <section className="relative w-full flex flex-col items-center text-center min-h-[50vh] justify-center pb-12 pt-20">
                {/* Background Animation */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black"></div>
                </div>

                <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 backdrop-blur-md mb-6 animate-fade-in-up">
                        <span className="material-symbols-outlined text-[#8B5CF6] text-sm">verified</span>
                        <span className="text-xs font-bold text-[#8B5CF6] tracking-wide uppercase">Sistemas & Procesos</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight animate-fade-in-up delay-100">
                        Biblioteca de <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#8B5CF6] to-[#8B5CF6]">Alto Impacto.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
                        Herramientas operativas, guiones tácticos y sistemas de crecimiento diseñados para descargar e implementar hoy mismo.
                    </p>
                </div>
            </section>

            {/* --- SECCIÓN 2: WORKSPACE & FILTROS --- */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 pb-24">

                {/* --- SEARCH & FILTER UI --- */}
                <div className="mb-12 space-y-6 animate-fade-in-up delay-300">
                    <div className="flex flex-col md:flex-row gap-6 items-end justify-between">
                        {/* Search Bar */}
                        <div className="relative w-full md:max-w-xl">
                            <input
                                type="text"
                                placeholder="Buscar recurso premium..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[#0a0a0a]/80 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#8B5CF6]/50 focus:ring-1 focus:ring-[#8B5CF6]/50 transition-all font-medium"
                            />
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                        </div>

                        {/* Category Filters */}
                        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
                            <button
                                onClick={() => handleCategoryFilter(null)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${!selectedCategory ? 'bg-[#8B5CF6] text-white border-[#8B5CF6]' : 'bg-white/5 text-gray-300 border-white/5 hover:border-white/20'}`}
                            >
                                Todos
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => handleCategoryFilter(cat)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${selectedCategory === cat ? 'bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]' : 'bg-white/5 text-gray-300 border-white/5 hover:border-white/20'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- GRID DE RECURSOS --- */}
                {filteredResources.length === 0 ? (
                    <div className="text-center py-20 border border-white/5 rounded-2xl bg-white/5 mx-auto max-w-2xl animate-fade-in">
                        <span className="material-symbols-outlined text-gray-500 text-5xl mb-4">search_off</span>
                        <h3 className="text-xl font-bold text-white mb-2">No encontramos recursos</h3>
                        <p className="text-gray-400">Intenta ajustar tu búsqueda.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedCategory(null); }}
                            className="mt-6 text-[#8B5CF6] hover:underline font-bold"
                        >
                            Ver todo el catálogo
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredResources.map((resource, index) => {
                            const isOwned = user?.ownedResources?.includes(resource.id);
                            const isInCart = cart.some(item => item.id === resource.id);

                            return (
                                <div
                                    key={resource.id}
                                    className="group relative flex flex-col bg-gray-900/40 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden hover:border-[#8B5CF6]/50 transition-all duration-500 hover:shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)] hover:-translate-y-1"
                                    onClick={() => setSelectedResource(resource)}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Image & Type */}
                                    <div className="relative aspect-video w-full overflow-hidden cursor-pointer">
                                        <div className="absolute top-3 left-3 z-10 flex gap-2">
                                            <span className="inline-flex items-center rounded-md bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md border border-white/10 uppercase tracking-wider">
                                                {resource.type}
                                            </span>
                                        </div>
                                        <div
                                            className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                            style={{ backgroundImage: `url("${resource.image}")` }}
                                        ></div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-1 flex-col p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-wider border border-[#8B5CF6]/20 px-2 py-0.5 rounded bg-[#8B5CF6]/5">
                                                {resource.category}
                                            </span>
                                        </div>

                                        <h3 className="mb-2 text-xl font-bold text-white group-hover:text-[#8B5CF6] transition-colors leading-tight cursor-pointer">
                                            {resource.title}
                                        </h3>
                                        <p className="mb-6 text-sm text-gray-400 leading-relaxed line-clamp-2">
                                            {resource.description}
                                        </p>

                                        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                                            <span className="text-xl font-bold text-white">${resource.price.toLocaleString()}</span>

                                            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => setSelectedResource(resource)}
                                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
                                                    title="Ver Detalles"
                                                >
                                                    <span className="material-symbols-outlined text-xl">visibility</span>
                                                </button>

                                                {isOwned ? (
                                                    <button
                                                        onClick={() => navigate('/mis-recursos')}
                                                        className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 font-bold text-sm border border-green-500/30 hover:bg-green-500/30 transition-all flex items-center gap-2"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">folder_open</span>
                                                        Abrir
                                                    </button>
                                                ) : isInCart ? (
                                                    <button
                                                        onClick={() => navigate('/checkout')}
                                                        className="px-4 py-2 rounded-lg bg-[#8B5CF6]/20 text-[#8B5CF6] font-bold text-sm border border-[#8B5CF6]/30 flex items-center gap-2 cursor-default"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">shopping_cart</span>
                                                        En carrito
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleAddToCart(resource)}
                                                        className="px-4 py-2 rounded-lg bg-[#8B5CF6] text-white font-bold text-sm hover:bg-white hover:text-[#8B5CF6] transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] flex items-center gap-2"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                                                        Comprar
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* RESOURCE INFO MODAL - ESTILO VIOLETA */}
            {selectedResource && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#0a0a0a] w-full max-w-2xl rounded-2xl border border-white/10 overflow-hidden shadow-[0_0_50px_-10px_rgba(139,92,246,0.3)] flex flex-col md:flex-row relative">
                        <button
                            onClick={() => setSelectedResource(null)}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors border border-white/10"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        <div className="md:w-1/2 h-64 md:h-auto relative">
                            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${selectedResource.image}")` }}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent md:bg-gradient-to-r"></div>
                        </div>

                        <div className="md:w-1/2 p-8 flex flex-col">
                            <div className="mb-4">
                                <span className="inline-block px-2 py-1 rounded bg-[#8B5CF6]/20 text-[#8B5CF6] text-xs font-bold uppercase tracking-wider mb-3 border border-[#8B5CF6]/30">
                                    {selectedResource.category}
                                </span>
                                <h2 className="text-2xl font-bold text-white mb-3 leading-tight">{selectedResource.title}</h2>
                                <p className="text-gray-400 text-sm leading-relaxed">{selectedResource.description}</p>
                            </div>

                            <div className="mt-auto pt-6 border-t border-white/5">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm text-gray-500 font-bold uppercase tracking-wider">Inversión</span>
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
                                        Finalizar Compra
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleAddToCart(selectedResource)}
                                        className="w-full bg-[#8B5CF6] text-white font-bold py-3 rounded-lg hover:bg-white hover:text-[#8B5CF6] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#8B5CF6]/20"
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