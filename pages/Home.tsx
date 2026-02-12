import React from 'react';
import { Link } from 'react-router-dom';
import FlowGradient from "../components/background/AnimacionEntrada";
import { COURSES } from '../data/courses';
import { CardCarousel } from '../components/ui/Tarjetas de Cursos HOME';

const Home: React.FC = () => {
    const featuredCourses = [
        COURSES[0], // Investigación de Audiencias
        COURSES[1], // Fundamentos Marketing
        COURSES[2], // Branding
        COURSES[3], // Estrategia Contenidos
        COURSES[4], // UX
        COURSES[7], // Email Marketing
        COURSES[12], // Python
        COURSES[13], // SQL
        COURSES[14], // AI Operativa
        COURSES[17], // PowerBI
        COURSES[23],
        COURSES[24],
    ];

    const featuredCoursesContent = featuredCourses.map(course => ({
        title: course.title,
        description: course.description,
        content: (
            <div className="h-full w-full flex items-center justify-center text-white">
                <img
                    src={course.image}
                    width={300}
                    height={300}
                    className="h-full w-full object-cover"
                    alt={course.title}
                />
            </div>
        )
    }));

    // Datos para el Carrusel de Cursos Recomendados
    const carouselItems = COURSES.slice(0, 15).map(course => ({
        src: course.image,
        title: course.title,
        description: course.description,
        category: course.category
    }));

    return (
        <div className="w-full relative animate-fade-in overflow-hidden">

            {/* 1. HERO SECTION (Segmentación Dual) */}
            <section className="relative w-full min-h-[90vh] flex flex-col justify-center items-center text-center px-6 pt-20 pb-12 overflow-hidden">


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

            {/* 4. AUTORIDAD Y FACTOR HUMANO (Prueba Social + Nosotros) */}
            <section className="w-full py-12 px-6 border-t border-white/5 bg-background">
                <div className="max-w-7xl mx-auto">

                    {/* Testimonios / Logos */}
                    <div className="text-center">
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-8">Empresas y alumnos que confían en Flip</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 justify-center gap-8 md:gap-12 transition-all duration-500">
                            {/* Métricas de Impacto */}
                            {[
                                { number: '+500', label: 'Alumnos Entrenados', onlyDesktop: false },
                                { number: '98%', label: 'Tasa de Satisfacción', onlyDesktop: true },
                                { number: '+50', label: 'Proyectos Lanzados', onlyDesktop: true },
                                { number: '24/7', label: 'Soporte Activo', onlyDesktop: false }
                            ].map((stat, i) => (
                                <div
                                    key={i}
                                    className={`flex-col items-center p-4 ${stat.onlyDesktop ? 'hidden md:flex' : 'flex'}`}
                                >
                                    <span className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00F5F1] to-[#842DB4] mb-2">
                                        {stat.number}
                                    </span>
                                    <span className="text-sm text-gray-400 uppercase tracking-widest">
                                        {stat.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>


            {/* Nivel DIY (Cursos) - Tema Cian */}
            <section
                className="hidden md:block relative w-full py-24 px-6 border-t border-white/5 bg-black overflow-hidden group"
                onMouseMove={(e) => {
                    const { currentTarget, clientX, clientY } = e;
                    const { left, top } = currentTarget.getBoundingClientRect();
                    currentTarget.style.setProperty('--mouse-x', `${clientX - left}px`);
                    currentTarget.style.setProperty('--mouse-y', `${clientY - top}px`);
                }}
            >
                {/* Fondo dinámico mouse-follow */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: 'radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(0, 245, 241, 0.1), transparent 40%)'
                    }}
                />

                <div className="absolute top-0 right-0 w-1/3 h-full bg-[#00F5F1]/5 blur-[120px] pointer-events-none"></div>

                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">

                    {/* COLUMNA VISUAL (IZQUIERDA) - Panel con CardCarousel */}
                    <div className="order-2 md:order-1 relative">
                        {/* Bordes de luz */}
                        <div className="absolute top-0 left-0 w-32 h-32 bg-[#00F5F1]/20 blur-[50px] rounded-full pointer-events-none"></div>

                        {/* Carrusel Integrado */}
                        <div className="w-full h-full relative z-10 p-4">
                            <CardCarousel items={carouselItems} />
                        </div>

                        {/* Badges Flotantes Decorativos */}
                        <div className="absolute -top-4 -right-4 z-20 animate-float-slow">
                        </div>
                    </div>

                    {/* COLUMNA TEXTO (DERECHA) */}
                    <div className="order-1 md:order-2">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            Domina las <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00F5F1]">Herramientas Digitales</span>
                        </h2>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed font-light">
                            Accede a la misma biblioteca de conocimientos que utilizamos internamente. Cursos prácticos, directos al grano y diseñados para la ejecución inmediata.
                        </p>

                        {/* Grid de Beneficios (Cards) */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                            {[
                                { icon: 'rocket_launch', title: 'Ejecución', desc: '100% Práctico' },
                                { icon: 'update', title: 'Actualizado', desc: 'Tendencias 2026' },
                                { icon: 'workspace_premium', title: 'Certificado', desc: 'Validez Real' }
                            ].map((item, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl hover:border-[#00F5F1]/50 transition-colors group/card">
                                    <span className="material-symbols-outlined text-[#00F5F1] mb-2 group-hover/card:scale-110 transition-transform">{item.icon}</span>
                                    <h4 className="font-bold text-white text-sm">{item.title}</h4>
                                    <p className="text-xs text-gray-400">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col items-start gap-3">
                            <Link to="/academia" className="bg-[#00F5F1] text-black font-bold hover:bg-[#4dfaf7] transition-all px-8 py-4 rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(0,245,241,0.3)] hover:shadow-[0_0_30px_rgba(0,245,241,0.5)]">
                                Explorar Academia
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </Link>
                            <p className="text-xs text-gray-500 italic pl-1">
                                Únete a más de +500 alumnos activos hoy.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Nivel DFY (Agencia) - Tema Púrpura */}
            <section
                className="relative w-full py-24 px-6 border-t border-white/5 bg-black overflow-hidden group"
                onMouseMove={(e) => {
                    const { currentTarget, clientX, clientY } = e;
                    const { left, top } = currentTarget.getBoundingClientRect();
                    currentTarget.style.setProperty('--mouse-x', `${clientX - left}px`);
                    currentTarget.style.setProperty('--mouse-y', `${clientY - top}px`);
                }}
            >
                {/* Fondo dinámico mouse-follow */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: 'radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(132, 45, 180, 0.15), transparent 40%)'
                    }}
                />

                <div className="absolute bottom-0 left-0 w-1/3 h-full bg-[#842DB4]/10 blur-[120px] pointer-events-none"></div>

                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
                    <div className="order-1">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            Tu Partner Estratégico en <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-400">Escalabilidad</span>
                        </h2>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed font-light">
                            ¿Necesitas resultados sin la curva de aprendizaje? Implementamos sistemas de adquisición de clientes con Inteligencia Artificial que integran tráfico, conversión y ventas.
                        </p>

                        {/* Grid de Servicios (Cards) */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                            {[
                                { icon: 'ads_click', title: 'Traffic', desc: 'Ads & Outreach' },
                                { icon: 'hub', title: 'Funnels', desc: 'Conversión' },
                                { icon: 'psychology', title: 'Strategy', desc: 'Growth Partner' }
                            ].map((item, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl hover:border-[#842DB4]/50 transition-colors group/card">
                                    <span className="material-symbols-outlined text-[#842DB4] mb-2 group-hover/card:scale-110 transition-transform">{item.icon}</span>
                                    <h4 className="font-bold text-white text-sm">{item.title}</h4>
                                    <p className="text-xs text-gray-400">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col items-start gap-3">
                            <Link to="/consultas" className="bg-[#842DB4] text-white font-bold hover:bg-[#9d36d6] transition-all px-8 py-4 rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(132,45,180,0.3)] hover:shadow-[0_0_30px_rgba(132,45,180,0.5)]">
                                Agendar Consultoría
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </Link>
                            <p className="text-xs text-gray-500 italic pl-1">
                                Cupos limitados para consultoría mensual personalizada.
                            </p>
                        </div>
                    </div>

                    <div className="order-2 relative">
                        {/* Panel de Control Futurista (Glassmorphism) */}
                        <div className="aspect-square rounded-3xl border border-[#842DB4]/30 bg-black/40 backdrop-blur-xl p-8 relative overflow-hidden shadow-2xl group/panel">
                            {/* Bordes de luz */}
                            <div className="absolute inset-0 border-2 border-[#842DB4]/20 rounded-3xl pointer-events-none"></div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#842DB4]/20 blur-[50px] rounded-full pointer-events-none"></div>

                            {/* Header del Panel */}
                            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                                <div>
                                    <h4 className="text-white font-bold">Rendimiento en Tiempo Real</h4>
                                </div>
                                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#00ff00]"></div>
                            </div>

                            {/* Gráfico SVG Animado */}
                            <div className="relative h-60 w-full mb-6 flex items-end overflow-hidden">
                                {/* Scanline Effect */}
                                <div className="animate-scan pointer-events-none z-0"></div>

                                <svg className="w-full h-full overflow-visible relative z-10" viewBox="0 0 300 100">
                                    {/* Grid lines */}
                                    <line x1="0" y1="0" x2="300" y2="0" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                                    <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                                    <line x1="0" y1="100" x2="300" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                                    {/* Area Gradient (Pulsing) */}
                                    <defs>
                                        <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                            <stop offset="0%" stopColor="#842DB4" stopOpacity="0.5" />
                                            <stop offset="100%" stopColor="#842DB4" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <path d="M0,100 Q50,90 100,60 T200,40 T300,10 V100 H0 Z" fill="url(#chartGradient)" className="animate-pulse-slow" />

                                    {/* Line Path */}
                                    <path
                                        d="M0,100 Q50,90 100,60 T200,40 T300,10"
                                        fill="none"
                                        stroke="#842DB4"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        className="drop-shadow-[0_0_10px_rgba(132,45,180,0.8)] animate-dash"
                                    />

                                    {/* Data Points */}
                                    <circle cx="100" cy="60" r="3" fill="white" />
                                    <circle cx="200" cy="40" r="3" fill="white" />

                                    {/* Last Point (Live) */}
                                    <circle cx="300" cy="10" r="8" fill="#842DB4" opacity="0.5" className="animate-ping" />
                                    <circle cx="300" cy="10" r="4" fill="white" className="animate-pulse" />
                                </svg>

                                {/* Etiqueta FLotante ROI */}
                                <div className="absolute top-0 right-0 bg-[#842DB4] text-white text-xs font-bold px-3 py-1 rounded-full shadow-[0_0_15px_rgba(132,45,180,0.5)] transform -translate-y-1 translate-x-1">
                                    +127% ROI
                                </div>
                            </div>

                            {/* Stats Secundarias */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                    <p className="text-gray-400 text-[10px] uppercase">Retorno</p>
                                    <p className="text-white font-bold text-lg">12.5x</p>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                    <p className="text-gray-400 text-[10px] uppercase">Leads/Mes</p>
                                    <p className="text-white font-bold text-lg">+850</p>
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
        </div>
    );
};

export default Home;