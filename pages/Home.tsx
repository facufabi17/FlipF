import React from 'react';
import { Link } from 'react-router-dom';
import FlowGradient from '../components/ui/flow-gradient-hero-section';

const Home: React.FC = () => {
    return (
        <div className="w-full relative animate-fade-in overflow-hidden">

            {/* 1. HERO SECTION (Segmentación Dual) */}
            <section className="relative w-full min-h-[90vh] flex flex-col justify-center items-center text-center px-6 pt-20 pb-12 overflow-hidden bg-background">

                {/* Animación de Fondo */}
                <FlowGradient className="opacity-80" />
                <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                {/* Contenido */}
                <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-8 leading-[1.1]">
                        Transformamos Negocios. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5F1] to-[#842DB4]">Entrenamos Expertos.</span>
                    </h1>

                    <p className="text-lg md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                        La agencia de marketing digital que no solo ejecuta estrategias, sino que te enseña a dominarlas.
                    </p>

                    {/* Botones CTA Duales */}
                    <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl justify-center items-stretch md:items-center">
                        {/* Botón A: Aprender (Cian) */}
                        <Link to="/academia" className="group relative flex-1 bg-[#00F5F1]/10 border border-[#00F5F1]/50 hover:bg-[#00F5F1] hover:text-black hover:border-[#00F5F1] text-[#00F5F1] transition-all duration-300 rounded-xl px-8 py-6 flex flex-col items-center justify-center text-center gap-2 overflow-hidden">
                            <span className="absolute inset-0 bg-[#00F5F1]/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></span>
                            <span className="font-bold text-lg relative z-10 tracking-wide">Quiero Aprender Marketing</span>
                            <span className="text-xs opacity-70 relative z-10 font-medium">Para Estudiantes y Futuros Expertos</span>
                            <span className="material-symbols-outlined absolute right-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">school</span>
                        </Link>

                        {/* Botón B: Contratar (Púrpura) */}
                        <Link to="/consultas" className="group relative flex-1 bg-[#842DB4]/10 border border-[#842DB4]/50 hover:bg-[#842DB4] hover:text-white hover:border-[#842DB4] text-[#842DB4] transition-all duration-300 rounded-xl px-8 py-6 flex flex-col items-center justify-center text-center gap-2 overflow-hidden">
                            <span className="absolute inset-0 bg-[#842DB4]/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></span>
                            <span className="font-bold text-lg relative z-10 tracking-wide">Quiero Contratar la Agencia</span>
                            <span className="text-sm opacity-70 relative z-10 font-medium">Para Dueños de Negocios y CEOs</span>
                            <span className="material-symbols-outlined absolute right-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">rocket_launch</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 2. ESCALERA DE VALOR (Content Sections) */}

            {/* Nivel DIY (Cursos) - Tema Cian */}
            <section className="relative w-full py-24 px-6 border-t border-white/5 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-[#00F5F1]/5 blur-[100px] pointer-events-none"></div>

                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
                    <div className="order-2 md:order-1 relative">
                        {/* Representación visual abstracta de herramientas/aprendizaje */}
                        <div className="aspect-square rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#00F5F1]/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <span className="material-symbols-outlined text-9xl text-[#00F5F1]/50 group-hover:scale-110 transition-transform duration-500">handyman</span>

                            {/* Tarjetas flotantes */}
                            <div className="absolute top-10 right-10 p-4 bg-black/80 border border-white/10 rounded-lg shadow-xl backdrop-blur-md transform rotate-3 hover:rotate-0 transition-transform duration-300">
                                <div className="h-2 w-20 bg-gray-700 rounded mb-2"></div>
                                <div className="h-2 w-16 bg-[#00F5F1] rounded"></div>
                            </div>
                            <div className="absolute bottom-10 left-10 p-4 bg-black/80 border border-white/10 rounded-lg shadow-xl backdrop-blur-md transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                                <span className="text-[#00F5F1] text-xs font-bold uppercase tracking-wider">Metodología</span>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 md:order-2">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Herramientas de <span className="text-[#00F5F1]">Ejecución Inmediata</span></h2>
                        <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                            No te damos teoría abstracta. Usamos <strong>Andragogía</strong> (aprendizaje práctico para adultos) para entregarte sistemas que puedes implementar hoy mismo.
                        </p>
                        <ul className="space-y-4 mb-8">
                            {[
                                'Plantillas de Copywriting probadas',
                                'Sistemas de Automatización paso a paso',
                                'Estrategias de IA aplicadas a ventas'
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-300">
                                    <span className="material-symbols-outlined text-[#00F5F1] text-sm">check_circle</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <Link to="/academia" className="text-[#00F5F1] font-bold hover:text-white transition-colors flex items-center gap-2 group">
                            Ver Cursos Disponibles
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Nivel DFY (Agencia) - Tema Púrpura */}
            <section className="relative w-full py-24 px-6 border-t border-white/5 bg-white/[0.02] overflow-hidden">
                <div className="absolute bottom-0 left-0 w-1/3 h-full bg-[#842DB4]/5 blur-[100px] pointer-events-none"></div>

                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Gestionamos tu <span className="text-[#842DB4]">Crecimiento</span></h2>
                        <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                            ¿Necesitas resultados sin la curva de aprendizaje? Usamos en tu negocio las mismas estrategias de alto nivel que enseñamos en nuestra academia.
                        </p>
                        <ul className="space-y-4 mb-8">
                            {[
                                'Gestión integral de tráfico pago (Ads)',
                                'Embudos de venta automatizados',
                                'Consultoría estratégica personalizada'
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-300">
                                    <span className="material-symbols-outlined text-[#842DB4] text-sm">verified</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <Link to="/consultas" className="text-[#842DB4] font-bold hover:text-white transition-colors flex items-center gap-2 group">
                            Agendar Consultoría
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </Link>
                    </div>

                    <div className="relative">
                        {/* Representación visual abstracta de crecimiento/agencia */}
                        <div className="aspect-square rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-bl from-[#842DB4]/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <span className="material-symbols-outlined text-9xl text-[#842DB4]/50 group-hover:scale-110 transition-transform duration-500">monitoring</span>

                            {/* Flotante de Estadísticas */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[200px] bg-black/90 border border-[#842DB4]/30 p-4 rounded-xl shadow-2xl">
                                <div className="flex justify-between items-end mb-2">
                                    <div className="h-8 w-8 bg-[#842DB4] rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-white text-xs">trending_up</span>
                                    </div>
                                    <span className="text-[#00ff00] text-xs font-bold">+127% ROI</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full w-3/4 bg-[#842DB4]"></div>
                                    </div>
                                    <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full w-1/2 bg-[#842DB4]/50"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. SECCIÓN LEAD MAGNET */}
            <section className="w-full py-24 px-6 bg-gradient-to-b from-black to-[#1a1a1a]">
                <div className="max-w-4xl mx-auto rounded-3xl bg-white/5 border border-white/10 p-8 md:p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00F5F1] via-white to-[#842DB4]"></div>
                    <div className="absolute -left-20 -top-20 w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none"></div>

                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">¿No estás listo para invertir?</h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto relative z-10">
                        Comienza con nuestros recursos gratuitos. Ebooks, plantillas y guías para dar tus primeros pasos con firmeza.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10 max-w-md mx-auto">
                        <Link to="/recursos-gratis" className="w-full bg-white text-black hover:bg-gray-200 font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined">download</span>
                            Ver Recursos Gratuitos
                        </Link>
                    </div>

                    <p className="text-xs text-gray-500 mt-6 relative z-10">Únete a más de 5,000 profesionales recibiendo nuestros correos.</p>
                </div>
            </section>

            {/* 4. AUTORIDAD Y FACTOR HUMANO (Prueba Social + Nosotros) */}
            <section className="w-full py-24 px-6 border-t border-white/5 bg-background">
                <div className="max-w-7xl mx-auto">

                    {/* Testimonios / Logos */}
                    <div className="text-center mb-20">
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-8">Empresas y alumnos que confían en Flip</p>
                        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            {/* Espacios reservados para logos - Reemplazado con estilo de texto genérico por ahora */}
                            {['TechCorp', 'Innova Market', 'Growth Lab', 'Future Academy', 'ScaleUp'].map((logo, i) => (
                                <div key={i} className="text-xl md:text-2xl font-bold text-gray-400 flex items-center gap-2">
                                    <div className="size-6 bg-gray-700 rounded-full"></div>
                                    {logo}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bloque Sobre Nosotros */}
                    <div className="grid md:grid-cols-2 gap-12 items-center bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-12">
                        <div>
                            <h3 className="text-3xl font-bold text-white mb-4">Más que una agencia. <br /> Una filosofía.</h3>
                            <div className="w-12 h-1 bg-gradient-to-r from-[#00F5F1] to-[#842DB4] mb-6"></div>
                            <p className="text-gray-400 mb-6 leading-relaxed">
                                En <strong>Flip</strong>, creemos en el <em>Marketing Operativo</em> potenciado por Inteligencia Artificial. No creemos en "hacks" mágicos, sino en sistemas robustos que construyen marcas personales duraderas.
                            </p>
                            <p className="text-gray-400 mb-8 leading-relaxed">
                                Nuestro equipo lidera con el ejemplo, aplicando cada estrategia que recomendamos.
                            </p>
                            <Link to="/nosotros" className="text-white hover:text-primary underline decoration-primary decoration-2 underline-offset-4 transition-all">
                                Conoce nuestra historia &rarr;
                            </Link>
                        </div>
                        <div className="relative h-64 md:h-full min-h-[300px] rounded-xl overflow-hidden bg-black/50 border border-white/5">
                            {/* Marcador de posición de elemento humano abstracto */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="size-20 mx-auto bg-gradient-to-br from-[#842DB4] to-[#00F5F1] rounded-full mb-4 flex items-center justify-center text-white font-bold text-2xl shadow-lg border-2 border-white/10">F</div>
                                    <p className="text-white font-medium">El Equipo Flip</p>
                                    <p className="text-xs text-gray-500">Expertos en diversas disciplinas</p>
                                </div>
                            </div>

                            {/* Cuadrícula de fondo */}
                            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;