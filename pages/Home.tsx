import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className="w-full px-6 pt-16 pb-8 md:pt-24 md:pb-12 max-w-5xl mx-auto text-center relative animate-fade-in">
            {/* Decorative Glow */}
            <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#842db4 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-primary/20 blur-[100px] -z-10 rounded-full pointer-events-none"></div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 leading-[1.1]">
                Construyendo el futuro <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">de la creación</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 font-light">
                Del caos operativo al crecimiento estructurado. El centro neurálgico para figuras de autoridad listas para crecer.
            </p>

            {/* Video Player Container */}
            <div className="relative group w-full aspect-video rounded-xl md:rounded-2xl border border-white/10 bg-black shadow-2xl overflow-hidden mb-10">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative h-full w-full z-10 bg-black">
                    <video
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        controls
                        src="/videos/video-flip.mp4"
                    >
                        <source src="/videos/video-flip.mp4" type="video/mp4" />
                        Tu navegador no soporta el elemento de video.
                    </video>
                </div>
            </div>

            {/* Main CTA */}
            <div className="flex justify-center">
                <Link to="/recursos-gratis" className="relative group overflow-hidden rounded-full bg-accent px-8 py-4 text-white shadow-[0_0_20px_rgba(255,0,127,0.3)] hover:shadow-[0_0_30px_rgba(255,0,127,0.5)] transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                    <span className="text-lg font-bold tracking-wide flex items-center gap-2">
                        Explorar recursos gratuitos
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </span>
                </Link>
            </div>

            {/* Value Ladder Section */}
            <div className="w-full px-6 py-20 max-w-4xl mx-auto text-left">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white mb-2">Tu camino hacia la autoridad</h2>
                    <p className="text-gray-400">Navega por las etapas de crecimiento diseñadas para tu evolución.</p>
                </div>
                <div className="relative md:pl-0">
                    {/* Vertical Line */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/80 via-primary/40 hidden md:block"></div>
                    <div className="absolute left-7 top-0 bottom-0 w-px bg-gradient-to-b from-primary/80 via-primary/40 md:hidden"></div>

                    {/* Level 1 */}
                    <div className="relative flex flex-col md:flex-row items-center gap-8 mb-16 group">
                        <div className="md:w-1/2 md:text-right order-2 md:order-1 flex-1 pl-20 md:pl-0">
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">Nivel 1: El kit de herramientas</h3>
                            <p className="text-sm font-bold text-primary mb-2 uppercase tracking-wider">Hazlo tú mismo</p>
                            <p className="text-gray-400 text-sm leading-relaxed">Acceda a nuestra biblioteca de plantillas y herramientas operativas de alto impacto. Construya sus bases con precisión.</p>
                        </div>
                        <div className="absolute left-0 md:relative md:left-auto order-1 md:order-2 z-10 flex items-center justify-center shrink-0">
                            <div className="size-14 rounded-full bg-[#1b1320] border border-primary/50 group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(132,45,180,0.5)] transition-all flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-2xl">construction</span>
                            </div>
                        </div>
                        <div className="md:w-1/2 order-3 flex-1 md:block hidden"></div>
                    </div>

                    {/* Level 2 */}
                    <div className="relative flex flex-col md:flex-row items-center gap-8 mb-16 group">
                        <div className="md:w-1/2 order-3 flex-1 md:block hidden"></div>
                        <div className="absolute left-0 md:left-1/2 translate-x-0 md:-translate-x-1/2 z-10 flex items-center justify-center shrink-0">
                            <div className="size-14 rounded-full bg-[#1b1320] border border-white/20 group-hover:border-white/60 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-2xl">school</span>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 ml-auto md:text-left order-2 md:order-3 flex-1 pl-20 md:pl-16">
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-white transition-colors">Nivel 2: La Academia</h3>
                            <p className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Terminado contigo</p>
                            <p className="text-gray-400 text-sm leading-relaxed">Talleres interactivos y cursos por cohorte. Acorta la distancia entre la teoría y la práctica con la guía de expertos.</p>
                        </div>
                    </div>

                    {/* Level 3 */}
                    <div className="relative flex flex-col md:flex-row items-center gap-8 group">
                        <div className="md:w-1/2 md:text-right order-2 md:order-1 flex-1 pl-20 md:pl-0">
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-accent transition-colors">Nivel 3: La sala de juntas</h3>
                            <p className="text-sm font-bold text-accent mb-2 uppercase tracking-wider">Hecho para ti</p>
                            <p className="text-gray-400 text-sm leading-relaxed">Consultoría estratégica personalizada de alto nivel. Intervenimos para optimizar sus operaciones y aumentar sus ingresos.</p>
                        </div>
                        <div className="absolute left-0 md:relative md:left-auto order-1 md:order-2 z-10 flex items-center justify-center shrink-0">
                            <div className="size-14 rounded-full bg-[#1b1320] border border-accent/50 group-hover:border-accent group-hover:shadow-[0_0_15px_rgba(255,0,127,0.5)] transition-all flex items-center justify-center">
                                <span className="material-symbols-outlined text-accent text-2xl">diversity_3</span>
                            </div>
                        </div>
                        <div className="md:w-1/2 order-3 flex-1 md:block hidden"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;