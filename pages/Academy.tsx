import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { COURSES } from '../data/courses';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import AnimacionCian from '../components/Fondos/AnimacionCian';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

// --- Types & Data for Career Paths ---
interface CareerPath {
    id: string;
    title: string;
    description: string;
    totalCourses: number;
    completedCourses: number;
    icon: string;
    incentive: string;
    steps: { name: string; isCompleted: boolean }[];
}

const CAREER_PATHS: CareerPath[] = [
    {
        id: 'path-analyst',
        title: 'Especialista en Adquisición',
        description: 'Domina el tráfico pagado en todas las plataformas.',
        totalCourses: 5,
        completedCourses: 2, // Example progress for visualization
        icon: 'radar',
        incentive: 'Insignia Verificada',
        steps: [
            { name: "Fundamentos de Media Buying", isCompleted: true },
            { name: "Facebook Ads Avanzado", isCompleted: true },
            { name: "Google & YouTube Ads", isCompleted: false },
            { name: "TikTok Ads & Creativos", isCompleted: false },
            { name: "Analítica de Conversión", isCompleted: false }
        ]
    },
    {
        id: 'path-strategist',
        title: 'Arquitecto de Embudos',
        description: 'Diseña sistemas que convierten descongelados en clientes.',
        totalCourses: 4,
        completedCourses: 0,
        icon: 'hub',
        incentive: 'Sesión 1:1 de Estrategia',
        steps: [
            { name: "Psicología de Ventas", isCompleted: false },
            { name: "Diseño de Embudos", isCompleted: false },
            { name: "Email Marketing Táctico", isCompleted: false },
            { name: "Automatización de Procesos", isCompleted: false }
        ]
    },
    {
        id: 'path-ops',
        title: 'Director de Operaciones',
        description: 'Escala agencias sin morir en el caos operativo.',
        totalCourses: 6,
        completedCourses: 6,
        icon: 'settings_suggest',
        incentive: 'Certificación Oficial Flip',
        steps: [
            { name: "Mindset Operativo", isCompleted: true },
            { name: "Gestión de Proyectos", isCompleted: true },
            { name: "Contratación y Delegación", isCompleted: true },
            { name: "Finanzas para Agencias", isCompleted: true },
            { name: "Sistemas de Reporte", isCompleted: true },
            { name: "Escalado de Infraestructura", isCompleted: true }
        ]
    }
];

const Academy: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { addToCart, cart } = useCart();

    // GSAP Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const pathsRef = useRef<HTMLDivElement>(null);
    const catalogRef = useRef<HTMLDivElement>(null);
    const diffRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // Hero Animations
        tl.from('.hero-text', { y: 50, opacity: 0, duration: 1, stagger: 0.2 });

        // Scroll triggers could be added here for other sections, 
        // using simple from animations for now
    }, { scope: containerRef });

    const handleAddToCart = (e: React.MouseEvent, course: typeof COURSES[0]) => {
        e.stopPropagation();
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
        <div ref={containerRef} className="min-h-screen relative overflow-hidden bg-black text-white font-sans selection:bg-[#00F5F1] selection:text-black">

            {/* --- SECCIÓN 1: HERO (Full Width) --- */}
            <section ref={heroRef} className="relative w-full flex flex-col items-center text-center min-h-[60vh] justify-center pb-24 pt-20">
                {/* Background Animation restricted to Hero */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <AnimacionCian />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black"></div>
                </div>

                <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center">
                    <h1 className="hero-text text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                        Certifica tu Talento.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00F5F1] to-[#00F5F1]">Lidera el Mercado Digital.</span>
                    </h1>
                    <p className="hero-text text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Programas de formación técnica diseñados para profesionales que buscan resultados reales.
                    </p>
                    <button
                        onClick={() => document.getElementById('rutas')?.scrollIntoView({ behavior: 'smooth' })}
                        className="group relative z-20 px-8 py-4 bg-[#00F5F1] text-black font-bold text-lg rounded-full hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(0,245,241,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]"
                    >
                        Explorar Rutas de Carrera
                        <span className="material-symbols-outlined align-middle ml-2 group-hover:translate-y-1 transition-transform">
                            arrow_downward
                        </span>
                    </button>

                    {/* Visual de "Escalera" simplificada */}
                    <div className="hero-text mt-16 flex items-center gap-4 text-xs md:text-sm font-mono text-[#00F5F1]/60 opacity-80">
                        <span>NOVATO</span>
                        <div className="h-[1px] w-8 md:w-16 bg-[#00F5F1]/30"></div>
                        <span>PRACTICANTE</span>
                        <div className="h-[1px] w-8 md:w-16 bg-[#00F5F1]/30"></div>
                        <span className="text-white font-bold glow-text-cyan">CERTIFICADO</span>
                        <div className="h-[1px] w-8 md:w-16 bg-[#00F5F1]/30"></div>
                        <span>EXPERTO</span>
                    </div>
                </div>
            </section>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-24">

                {/* --- SECCIÓN 2: RUTAS DE CARRERA (MISSION MAPS) --- */}
                <section id="rutas" ref={pathsRef}>
                    <div className="flex flex-col items-center text-center gap-4 mb-16">
                        <div className="flex items-center gap-4 animate-fade-in-up">
                            <span className="material-symbols-outlined text-[#00F5F1] text-4xl shadow-cyan-glow rounded-full">map</span>
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
                                Mapas de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5F1] to-white">Misión</span>
                            </h2>
                        </div>
                        <p className="text-gray-400 max-w-xl text-sm md:text-base border border-white/5 bg-white/5 px-6 py-2 rounded-full backdrop-blur-md">
                            Completa los módulos tácticos para desbloquear tu <span className="text-[#00F5F1] font-bold">Insignia de Autoridad</span> y beneficios exclusivos.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {CAREER_PATHS.map((path) => {
                            const isPathCompleto = path.completedCourses >= path.totalCourses;
                            const hasStarted = path.completedCourses > 0;

                            return (
                                <div key={path.id} className="group relative bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 hover:border-[#00F5F1]/50 transition-all duration-500 hover:shadow-[0_0_50px_-10px_rgba(0,245,241,0.15)] flex flex-col overflow-hidden">
                                    {/* Decorative Grid Background */}
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
                                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#00F5F1]/5 rounded-full blur-[80px] group-hover:bg-[#00F5F1]/10 transition-colors duration-500"></div>

                                    {/* Header Icon & Title */}
                                    <div className="relative z-10 flex flex-col items-center text-center mb-8">
                                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border transition-all duration-500 ${isPathCompleto ? 'bg-[#00F5F1]/20 border-[#00F5F1] shadow-[0_0_30px_rgba(0,245,241,0.3)]' : 'bg-white/5 border-white/10 group-hover:border-[#00F5F1]/30'}`}>
                                            <span className={`material-symbols-outlined text-4xl transition-colors duration-300 ${isPathCompleto ? 'text-[#00F5F1]' : 'text-gray-400 group-hover:text-white'}`}>
                                                {path.icon}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2 group-hover:text-[#00F5F1] transition-colors">{path.title}</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{path.description}</p>
                                    </div>

                                    {/* --- MISSION TIMELINE --- */}
                                    <div className="relative z-10 flex-grow flex flex-col justify-center items-center mb-10 w-full px-2">

                                        {/* Line Connector */}
                                        <div className="absolute top-1/2 left-4 right-12 h-0.5 bg-white/10 -translate-y-1/2 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#00F5F1] shadow-[0_0_10px_#00F5F1] transition-all duration-1000 ease-out"
                                                style={{ width: `${(path.completedCourses / path.totalCourses) * 100}%` }}
                                            ></div>
                                        </div>

                                        <div className="relative w-full flex justify-between items-center gap-2">
                                            {/* Course Nodes */}
                                            {path.steps.map((step, index) => (
                                                <div key={index} className="relative group/node">
                                                    {/* Node Circle */}
                                                    <div className={`relative z-10 w-4 h-4 rounded-full border-2 transition-all duration-300 cursor-help
                                                        ${step.isCompleted
                                                            ? 'bg-[#00F5F1] border-[#00F5F1] shadow-[0_0_15px_#00F5F1] scale-110'
                                                            : 'bg-[#1a1a1a] border-white/20 hover:border-white'}`}
                                                    >
                                                        {!step.isCompleted && (
                                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/node:opacity-100 transition-opacity">
                                                                <span className="material-symbols-outlined text-[8px] text-gray-500">lock</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Tooltip */}
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-max max-w-[150px] opacity-0 group-hover/node:opacity-100 transition-all duration-300 pointer-events-none transform translate-y-2 group-hover/node:translate-y-0 z-20">
                                                        <div className="bg-black/90 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg border border-white/10 shadow-xl whitespace-normal text-center">
                                                            {step.name}
                                                            {/* Arrow */}
                                                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-black/90"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Final Reward Badge Node */}
                                            <div className="relative group/reward ml-2">
                                                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500
                                                    ${isPathCompleto
                                                        ? 'bg-[#00F5F1]/20 border-[#00F5F1] shadow-[0_0_30px_#00F5F1] animate-pulse-slow'
                                                        : 'bg-[#1a1a1a] border-white/10 group-hover:border-white/30'}`}
                                                >
                                                    <span className={`material-symbols-outlined text-lg ${isPathCompleto ? 'text-[#00F5F1]' : 'text-gray-600'}`}>military_tech</span>
                                                </div>

                                                {/* Badge Tooltip */}
                                                <div className="absolute bottom-full right-0 mb-3 w-max opacity-0 group-hover/reward:opacity-100 transition-all duration-300 z-20">
                                                    <div className="bg-[#00F5F1]/10 text-[#00F5F1] text-xs font-bold py-1.5 px-3 rounded-lg border border-[#00F5F1]/30 backdrop-blur-md shadow-[0_0_20px_rgba(0,245,241,0.2)]">
                                                        {path.incentive}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Footer */}
                                    <div className="mt-auto relative z-10">
                                        <button className={`w-full py-4 rounded-xl font-bold text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 group-hover:gap-3
                                            ${isPathCompleto
                                                ? 'bg-white/10 text-gray-300 cursor-default border border-white/5'
                                                : 'bg-[#00F5F1] text-black hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]'}`}
                                        >
                                            {isPathCompleto
                                                ? <span>Misión Completada</span>
                                                : hasStarted
                                                    ? <>Continuar Ruta <span className="material-symbols-outlined text-lg">resume</span></>
                                                    : <>Iniciar Misión <span className="material-symbols-outlined text-lg">play_arrow</span></>
                                            }
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>

                {/* --- SECCIÓN 3: CATÁLOGO DE CURSOS --- */}
                <section ref={catalogRef}>
                    <div className="flex items-center gap-4 mb-10">
                        <span className="material-symbols-outlined text-[#00F5F1] text-3xl">library_books</span>
                        <h2 className="text-3xl md:text-4xl font-bold">Biblioteca Táctica</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {COURSES.map(course => {
                            const isEnrolled = user?.enrolledCourses?.includes(course.id);
                            const isInCart = cart.some(item => item.id === course.id);

                            return (
                                <div key={course.id} className="flex flex-col bg-gray-900/40 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden hover:border-[#00F5F1]/50 transition-all duration-300 group hover:-translate-y-1">
                                    {/* Image Wrapper */}
                                    <div className="relative h-48 overflow-hidden">
                                        <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold border border-white/10 uppercase tracking-wide text-white">
                                            {course.category}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex-grow flex flex-col">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="px-2 py-0.5 rounded-full bg-[#00F5F1]/10 text-[#00F5F1] text-[10px] font-bold border border-[#00F5F1]/20 uppercase">
                                                Nivel Intermedio
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 leading-tight group-hover:text-[#00F5F1] transition-colors">
                                            {course.title.replace("Curso de ", "Sistema de ")}
                                        </h3>

                                        {/* Gancho Done-With-You */}
                                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6 bg-white/5 p-2 rounded border border-white/5">
                                            <span className="material-symbols-outlined text-sm text-[#00F5F1]">folder_zip</span>
                                            Incluye 3 Plantillas + 1 Prompt IA
                                        </div>

                                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                                            <div>
                                                <p className="text-2xl font-bold text-white">${course.price.toLocaleString()}</p>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Incluido en Ruta</p>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => navigate(`/academia/${course.id}`)}
                                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
                                                    title="Ver Detalles"
                                                >
                                                    <span className="material-symbols-outlined text-xl">visibility</span>
                                                </button>

                                                {isEnrolled ? (
                                                    <button
                                                        onClick={() => navigate(`/aula-virtual/${course.id}`)}
                                                        className="px-4 py-2 rounded-lg bg-[#00F5F1]/20 text-[#00F5F1] font-bold text-sm border border-[#00F5F1]/30 hover:bg-[#00F5F1]/30 transition-all flex items-center gap-2"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">school</span>
                                                        Aula
                                                    </button>
                                                ) : isInCart ? (
                                                    <button
                                                        onClick={() => navigate('/checkout')}
                                                        className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 font-bold text-sm border border-green-500/30 flex items-center gap-2"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">shopping_cart_checkout</span>
                                                        Carrito
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={(e) => handleAddToCart(e, course)}
                                                        className="px-4 py-2 rounded-lg bg-[#00F5F1] text-black font-bold text-sm hover:bg-white transition-colors shadow-[0_0_15px_rgba(0,245,241,0.3)] flex items-center gap-2"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">add</span>
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
                </section>

                {/* --- SECCIÓN 4: DIFERENCIADORES --- */}
                <section ref={diffRef} className="py-12 border-t border-white/10">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">¿Por qué aprender con <span className="text-[#00F5F1]">Flip</span>?</h2>
                        <p className="text-gray-400">La diferencia entre un curso teórico y una carrera operativa.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 text-center">
                            <div className="w-12 h-12 mx-auto bg-[#00F5F1]/10 rounded-full flex items-center justify-center mb-4 text-[#00F5F1]">
                                <span className="material-symbols-outlined text-2xl">group_work</span>
                            </div>
                            <h3 className="text-lg font-bold mb-2">Instructores Activos</h3>
                            <p className="text-sm text-gray-400">Nuestros profesores no son teóricos; gestionan cuentas reales todos los días.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 text-center">
                            <div className="w-12 h-12 mx-auto bg-[#00F5F1]/10 rounded-full flex items-center justify-center mb-4 text-[#00F5F1]">
                                <span className="material-symbols-outlined text-2xl">update</span>
                            </div>
                            <h3 className="text-lg font-bold mb-2">Curriculum Vivo</h3>
                            <p className="text-sm text-gray-400">Actualizamos el contenido semanalmente con el proceso G.R.O.W.S. Nunca aprenderás estrategias obsoletas.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 text-center">
                            <div className="w-12 h-12 mx-auto bg-[#00F5F1]/10 rounded-full flex items-center justify-center mb-4 text-[#00F5F1]">
                                <span className="material-symbols-outlined text-2xl">smart_toy</span>
                            </div>
                            <h3 className="text-lg font-bold mb-2">Herramientas de IA</h3>
                            <p className="text-sm text-gray-400">No te enseñamos a trabajar duro, te damos los Bots de IA para trabajar inteligente.</p>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default Academy;