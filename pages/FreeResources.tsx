import React from 'react';

const FreeResources: React.FC = () => {
    return (
        <div className="animate-fade-in">
            <div className="relative w-full border-b border-border-dark bg-background-dark">
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)", backgroundSize: '40px 40px' }}></div>
                <div className="relative flex flex-col items-center justify-center px-6 py-20 text-center md:py-32 max-w-5xl mx-auto">
                    <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-tech mb-6 backdrop-blur-sm">
                        <span className="material-symbols-outlined mr-2 text-[16px]">verified</span> Material 100% Gratuito
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black leading-[1.1] tracking-[-0.033em] mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
                        Recursos Gratuitos para Creadores
                    </h1>
                    <p className="text-text-muted text-lg md:text-xl font-normal max-w-2xl mb-10 leading-relaxed">
                        Descarga herramientas tácticas, hojas de trabajo y guías operativas diseñadas para escalar tu negocio digital hoy mismo. Sin trucos.
                    </p>
                    <div className="w-full max-w-lg relative group">
                        <form className="relative flex w-full items-center rounded-xl border border-border-dark bg-surface-dark p-2 shadow-2xl">
                            <div className="flex h-12 w-12 items-center justify-center text-text-muted">
                                <span className="material-symbols-outlined">mail</span>
                            </div>
                            <input className="h-full flex-1 bg-transparent px-2 text-white placeholder-text-muted focus:outline-none text-base border-none focus:ring-0" placeholder="Tu mejor correo electrónico" required type="email"/>
                            <button className="flex h-12 items-center justify-center rounded-lg bg-primary px-6 text-base font-bold text-white shadow-md hover:bg-primary/90 transition-all whitespace-nowrap" type="button">Suscribirse</button>
                        </form>
                    </div>
                </div>
            </div>
            
            <div className="w-full max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-b border-border-dark pb-6">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Herramientas Destacadas</h2>
                        <p className="text-text-muted text-sm md:text-base">Seleccionadas a mano para maximizar tu productividad.</p>
                    </div>
                </div>
                {/* Grid Recursos Gratis */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Item 1 */}
                    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border-dark bg-surface-dark transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
                        <div className="relative aspect-video w-full overflow-hidden bg-surface-dark">
                             <div className="absolute top-3 left-3 z-10 flex gap-2">
                                <span className="inline-flex items-center rounded bg-black/50 px-2 py-1 text-xs font-medium text-white backdrop-blur-md border border-white/10">PDF</span>
                            </div>
                            <div className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: 'linear-gradient(to top, rgba(27, 19, 32, 0.9) 0%, rgba(27, 19, 32, 0) 50%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuC5CM7rICU3OPbJP2WY94Ey3XzO0oztRZ4GkulbTgDk5S4B2WCl3vbvqytzGLxBkdrwbHG4Ro0um1_e38oIGfTiupXdFSN1YZBjLG1lf8D6iRwvjBrlrconzfFNx_IaB1rCBCO4DUqzsPvbxAsi3Q9gPGflhS5qL87QYK2m0FzdNpsQ9-VJHGzzEfIP8eW0Tw9WQJmIzTinZxVMYAqgualf0QZ5-Fj0E9ydtbivn2yWGfoFcn7Mi3y3J9N0-7oJULtbnevCMMk-rII")' }}></div>
                        </div>
                        <div className="flex flex-1 flex-col p-5">
                            <h3 className="mb-2 text-xl font-bold text-white group-hover:text-primary transition-colors">Hoja de Trabajo del Avatar</h3>
                            <p className="mb-6 text-sm text-text-muted line-clamp-3">Define quién es tu comprador perfecto en 15 minutos.</p>
                            <button className="mt-auto flex w-full items-center justify-center gap-2 rounded-lg bg-white/5 border border-white/10 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary">Descargar Ahora</button>
                        </div>
                    </div>
                    {/* Item 2 */}
                    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border-dark bg-surface-dark transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
                        <div className="relative aspect-video w-full overflow-hidden bg-surface-dark">
                            <div className="absolute top-3 left-3 z-10 flex gap-2">
                                <span className="inline-flex items-center rounded bg-black/50 px-2 py-1 text-xs font-medium text-white backdrop-blur-md border border-white/10">Notion</span>
                            </div>
                            <div className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: 'linear-gradient(to top, rgba(27, 19, 32, 0.9) 0%, rgba(27, 19, 32, 0) 50%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAZPFBULjM_lizrfkE1khtGAySyqmOWCRMeBOUT9jUJn4wqZwZnIVEvq3GU111BYMjA7yWkdzKNmJXiph-bOQzKk2HfzjBRZH3oxfnHWLpZ6kjBv3Sj4MSk6M-GWW4UwnWMjw5VsIm0C0MUAj8EhQhdSBUisLtiaH64UEIR7XIUKb5X98lRD8_c5KThWVoF2CNpgTvnX6Au6W3TqDmE7mx0ObOfepZcQOVbSwvGHHjd_CZ0VvEpYPJVghs-o37wrCveSxMuWpbcraM")' }}></div>
                        </div>
                        <div className="flex flex-1 flex-col p-5">
                            <h3 className="mb-2 text-xl font-bold text-white group-hover:text-primary transition-colors">Dashboard de Contenidos</h3>
                            <p className="mb-6 text-sm text-text-muted line-clamp-3">Organiza tu calendario editorial con esta plantilla de Notion.</p>
                            <button className="mt-auto flex w-full items-center justify-center gap-2 rounded-lg bg-white/5 border border-white/10 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary">Duplicar Plantilla</button>
                        </div>
                    </div>
                    {/* Item 3 */}
                    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border-dark bg-surface-dark transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
                        <div className="relative aspect-video w-full overflow-hidden bg-surface-dark">
                            <div className="absolute top-3 left-3 z-10 flex gap-2">
                                <span className="inline-flex items-center rounded bg-black/50 px-2 py-1 text-xs font-medium text-white backdrop-blur-md border border-white/10">Excel</span>
                            </div>
                            <div className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: 'linear-gradient(to top, rgba(27, 19, 32, 0.9) 0%, rgba(27, 19, 32, 0) 50%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBs9_5l2SQEqk35_RH9Eqkc0RvAQjPehJ19Huu1AngWiK4p2mZHkXJ4WKmoDeob5cR_GLymfhnBSidv0GzF53CKo2STUEnyL0yuW9H5TZ2CuuIZPh9IygYRrYo3GDLm_3Ns-FayRk5UAffg4_aNV_imMBV89ZPtYlPJaLYsAXzov2QPqJu0Z6g_PZPFO2JRU5cQvM3dUv8bgVog2CHOQMrvmq4mca8UoqWTAsG_8B6jvuzcBMnpDUQK21mrGyAgf3VxblsPAE9k0fc")' }}></div>
                        </div>
                        <div className="flex flex-1 flex-col p-5">
                            <h3 className="mb-2 text-xl font-bold text-white group-hover:text-primary transition-colors">Calculadora de ROI</h3>
                            <p className="mb-6 text-sm text-text-muted line-clamp-3">Descubre cuánto realmente ganas por proyecto.</p>
                            <button className="mt-auto flex w-full items-center justify-center gap-2 rounded-lg bg-white/5 border border-white/10 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary">Descargar Ahora</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FreeResources;