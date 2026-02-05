import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { FREE_RESOURCES, FreeResource } from '../data/resources';
import LeadMagnetModal from '../components/LeadMagnetModal';


const FreeResources: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const [selectedResource, setSelectedResource] = useState<FreeResource | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // --- Derived Data ---
    const categories = useMemo(() => {
        const cats = new Set(FREE_RESOURCES.map(r => r.type));
        return Array.from(cats);
    }, []);

    const filteredResources = useMemo(() => {
        return FREE_RESOURCES.filter(resource => {
            // 1. Text Search
            const matchesSearch = (
                resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resource.type.toLowerCase().includes(searchTerm.toLowerCase())
            );

            // 2. Category Filter
            const matchesCategory = selectedCategory ? resource.type === selectedCategory : true;

            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory]);

    const handleDownloadClick = (resource: FreeResource) => {
        if (isAuthenticated) {
            window.open(resource.downloadUrl, '_blank');
        } else {
            setSelectedResource(resource);
        }
    };

    const handleCategoryFilter = (cat: string | null) => {
        setSelectedCategory(prev => prev === cat ? null : cat);
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-black text-white font-sans selection:bg-[#00F5F1] selection:text-black">

            {/* --- SECCIÓN 1: HERO --- */}
            <section className="relative w-full flex flex-col items-center text-center min-h-[50vh] justify-center pb-12 pt-20">
                {/* Background Animation */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>
                </div>

                <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F5F1]/10 border border-[#00F5F1]/20 backdrop-blur-md mb-6 animate-fade-in-up">
                        <span className="material-symbols-outlined text-[#00F5F1] text-sm">verified</span>
                        <span className="text-xs font-bold text-[#00F5F1] tracking-wide uppercase">Material 100% Gratuito</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight animate-fade-in-up delay-100">
                        Herramientas para <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00F5F1] to-[#00F5F1]">Escalar tu Agencia.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
                        Descarga tácticas probadas, plantillas operativas y sistemas que usamos internamente. Sin teoría, solo ejecución.
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
                                placeholder="Buscar recurso..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[#0a0a0a]/80 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#00F5F1]/50 focus:ring-1 focus:ring-[#00F5F1]/50 transition-all font-medium"
                            />
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                        </div>

                        {/* Category Filters */}
                        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
                            <button
                                onClick={() => handleCategoryFilter(null)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${!selectedCategory ? 'bg-[#00F5F1] text-black border-[#00F5F1]' : 'bg-white/5 text-gray-300 border-white/5 hover:border-white/20'}`}
                            >
                                Todos
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => handleCategoryFilter(cat)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${selectedCategory === cat ? 'bg-[#00F5F1]/20 text-[#00F5F1] border-[#00F5F1]' : 'bg-white/5 text-gray-300 border-white/5 hover:border-white/20'}`}
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
                        <span className="material-symbols-outlined text-gray-500 text-5xl mb-4">folder_off</span>
                        <h3 className="text-xl font-bold text-white mb-2">No encontramos recursos</h3>
                        <p className="text-gray-400">Intenta con otra búsqueda o categoría.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedCategory(null); }}
                            className="mt-6 text-[#00F5F1] hover:underline font-bold"
                        >
                            Ver todos los recursos
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredResources.map((resource, index) => (
                            <div
                                key={resource.id}
                                className="group relative flex flex-col bg-gray-900/40 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden hover:border-[#00F5F1]/50 transition-all duration-500 hover:shadow-[0_0_30px_-10px_rgba(0,245,241,0.15)] hover:-translate-y-1"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Image & Type */}
                                <div className="relative aspect-video w-full overflow-hidden">
                                    <div className="absolute top-3 left-3 z-10">
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
                                    <h3 className="mb-3 text-xl font-bold text-white group-hover:text-[#00F5F1] transition-colors leading-tight">
                                        {resource.title}
                                    </h3>
                                    <p className="mb-6 text-sm text-gray-400 leading-relaxed line-clamp-3">
                                        {resource.description}
                                    </p>

                                    <div className="mt-auto pt-4 border-t border-white/5">
                                        <button
                                            onClick={() => handleDownloadClick(resource)}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 py-3 text-sm font-bold text-white transition-all hover:bg-[#00F5F1] hover:text-black hover:border-[#00F5F1] group/btn"
                                        >
                                            <span className="material-symbols-outlined text-lg transition-transform group-hover/btn:-translate-y-0.5">
                                                {resource.type === 'Template' ? 'content_copy' : 'download'}
                                            </span>
                                            {resource.type === 'Template' ? 'Duplicar Plantilla' : 'Descargar Ahora'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de Captura */}
            <LeadMagnetModal
                resource={selectedResource}
                isOpen={!!selectedResource}
                onClose={() => setSelectedResource(null)}
            />
        </div>
    );
};

export default FreeResources;