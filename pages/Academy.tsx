import React, { useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { COURSES } from '../data/courses';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import AnimacionCian from '../components/background/AnimacionCian';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { CourseTimeline } from '../components/ui/Linea de Cursos ACADEMIA';
import { supabase } from '../lib/supabase';
import ScheduleSelector from '../components/ui/Horarios de Cursos';
import { CourseSchedule } from '../types';

// --- Types & Data for Career Paths ---
interface CareerStage {
    name: string;
    description: string;
    courses: string[]; // List of course titles
}

interface CareerPath {
    id: string;
    title: string;
    description: string;
    icon: string;
    incentive: string;
    incentiveDescription: string;
    stages: CareerStage[];
}

const CAREER_PATHS: CareerPath[] = [
    {
        id: 'path-marketing',
        title: 'Certificado',
        description: 'Analista de Marketing Digital y Estrategia',
        icon: 'campaign', // material icon name
        incentive: 'Certificación de Especialista en Marketing Digital',
        incentiveDescription: 'Al completar esta ruta, recibirás una certificación oficial de Flip Manager que valida tus habilidades en estrategia, análisis y ejecución de campañas. Reconocido por líderes de la industria.',
        stages: [
            {
                name: 'Etapa 1: Análisis de Mercado y Usuario',
                description: 'Nivel Inicial: Entiende al cliente y el mercado.',
                courses: [
                    "Investigación de Audiencias y Usuarios",
                    "Fundamentos del Marketing de Resultados",
                    "Branding y Gestión de Identidad",
                    "Estrategia de Contenidos y Viralización"
                ]
            },
            {
                name: 'Etapa 2: Análisis de Canales y Conversión',
                description: 'Nivel Intermedio: Ejecución técnica y optimización.',
                courses: [
                    "Experiencia de Usuario y Optimización",
                    "Desarrollo y Maquetación Web Estratégica",
                    "Gestión de Redes Sociales y Publicidad Digital",
                    "Automatización y Marketing por Correo"
                ]
            },
            {
                name: 'Etapa 3: Analítica Avanzada y Crecimiento',
                description: 'Nivel Avanzado: Escala con datos y estrategia financiera.',
                courses: [
                    "Visualización de Datos y Analítica Digital",
                    "Posicionamiento Orgánico (SEO)",
                    "Estrategias de Crecimiento Acelerado",
                    "Planificación y Control de Presupuesto"
                ]
            }
        ]
    },
    {
        id: 'path-data',
        title: 'Certificado',
        description: 'Analista en Ciencias de Datos e IA',
        icon: 'psychology',
        incentive: 'Certificado de Especialista en Ciencia de Datos',
        incentiveDescription: 'Obtén un diploma que avala tu dominio en Python, SQL y Machine Learning. Ideal para roles de Analista de Datos, BI Developer o Data Scientist Junior.',
        stages: [
            {
                name: 'Etapa 1: Gestión y Fundamentos de Datos',
                description: 'Nivel Inicial: Bases técnicas para el manejo de información.',
                courses: [
                    "Programación para el Análisis de Datos",
                    "Gestión de Bases de Datos Relacionales",
                    "Inteligencia Artificial Operativa",
                    "Análisis Exploratorio y Visualización"
                ]
            },
            {
                name: 'Etapa 2: Procesamiento Avanzado',
                description: 'Nivel Intermedio: Tableros de control y reportes dinámicos.',
                courses: [
                    "Análisis de Datos con Librerías Avanzadas",
                    "Inteligencia de Negocios con Power BI",
                    "Programación Avanzada en Servidores",
                    "Certificación Profesional PL-300"
                ]
            },
            {
                name: 'Etapa 3: Modelado Predictivo y Arquitectura',
                description: 'Nivel Avanzado: Predicción y Big Data.',
                courses: [
                    "Aprendizaje Automático (Machine Learning)",
                    "Comunicación de Datos (Storytelling)",
                    "Bases de Datos No Relacionales",
                    "Ingeniería de Datos y Arquitectura"
                ]
            }
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

    // --- Search & Filter State ---
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCareerId, setSelectedCareerId] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [activeIncentive, setActiveIncentive] = useState<string | null>(null);

    // --- Schedule Modal State ---
    const [selectedCourseForSchedule, setSelectedCourseForSchedule] = useState<typeof COURSES[0] | null>(null);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState<CourseSchedule | null>(null);
    const [isCheckingSchedules, setIsCheckingSchedules] = useState<string | null>(null);


    // --- Derived Data ---
    const categories = useMemo(() => {
        const cats = new Set(COURSES.map(c => c.category));
        return Array.from(cats);
    }, []);

    const filteredCourses = useMemo(() => {
        return COURSES.filter(course => {
            // 1. Text Search
            const matchesSearch = (
                course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.category.toLowerCase().includes(searchTerm.toLowerCase())
            );

            // 2. Career Filter
            let matchesCareer = true;
            if (selectedCareerId) {
                const career = CAREER_PATHS.find(p => p.id === selectedCareerId);
                if (career) {
                    const careerCourseNames = career.stages.flatMap(s => s.courses);
                    matchesCareer = careerCourseNames.includes(course.title);
                }
            }

            // 3. Category Filter
            let matchesCategory = true;
            if (selectedCategory) {
                matchesCategory = course.category === selectedCategory;
            }

            return matchesSearch && matchesCareer && matchesCategory;
        });
    }, [searchTerm, selectedCareerId, selectedCategory]);

    // Reset other filters if needed? No, let them combine. 
    // But maybe reset category if switching career? User choice. Let's keep distinct.

    const handleCareerFilter = (id: string | null) => {
        setSelectedCareerId(prev => prev === id ? null : id);
        // Optional: Reset category to avoid empty results?
        // setSelectedCategory(null); 
    };

    const handleCategoryFilter = (cat: string | null) => {
        setSelectedCategory(prev => prev === cat ? null : cat);
    };

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // Hero Animations
        tl.from('.hero-text', { y: 50, autoAlpha: 0, duration: 1, stagger: 0.2 });

        // Scroll triggers could be added here for other sections, 
        // using simple from animations for now
    }, { scope: containerRef });

    const handleAddToCart = async (e: React.MouseEvent, course: typeof COURSES[0]) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            setIsCheckingSchedules(course.id);
            // Verificar si el curso tiene horarios configurados en BD
            const { data, error } = await supabase
                .from('course_schedules')
                .select('*')
                .eq('course_id', course.id)
                .gt('capacity', 0);

            setIsCheckingSchedules(null);

            if (data && data.length > 0) {
                // El curso tiene horarios disponibles, abrimos el modal
                setSelectedCourseForSchedule(course);
                setSelectedSchedule(null); // Limpiar selección previa
                setIsScheduleModalOpen(true);
            } else {
                if (error) {
                    console.error("Error al consultar horarios", error);
                }
                // No tiene horarios o hay error, agregamos directo al carrito
                addToCart({
                    id: course.id,
                    title: course.title,
                    price: course.price,
                    image: course.image,
                    type: 'course'
                });
            }
        } catch (err) {
            setIsCheckingSchedules(null);
            console.error("Excepción en handleAddToCart:", err);
        }
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
                        En nuestra academia, cada curso que completas es un paso hacia una certificación de nivel experto. Hecha para profesionales que buscan resultados reales.
                    </p>
                    <div className="hero-text flex flex-col sm:flex-row items-center gap-4 relative z-20">
                        <button
                            onClick={() => document.getElementById('rutas')?.scrollIntoView({ behavior: 'smooth' })}
                            className="group px-5 py-2 bg-[#00F5F1] text-black font-bold text-xs md:text-sm rounded-full hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(0,245,241,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] flex items-center gap-2"
                        >
                            Explorar Rutas
                            <span className="material-symbols-outlined text-lg group-hover:translate-y-1 transition-transform">
                                arrow_downward
                            </span>
                        </button>
                        <button
                            onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })}
                            className="group px-5 py-2 bg-transparent text-white font-bold text-xs md:text-sm rounded-full border border-white/20 hover:bg-white/10 hover:border-[#00F5F1]/50 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm"
                        >
                            Explorar Cursos Disponibles
                            <span className="material-symbols-outlined text-lg group-hover:translate-y-1 transition-transform">
                                arrow_downward
                            </span>
                        </button>
                    </div>

                    {/* Visual de "Escalera" simplificada */}
                    <div className="hero-text mt-8 animate-fade-in-up delay-300">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F5F1]/5 border border-[#00F5F1]/20 backdrop-blur-md hover:bg-[#00F5F1]/10 transition-all duration-300 cursor-default">
                            <span className="material-symbols-outlined text-[#00F5F1] text-sm md:text-base">verified</span>
                            <span className="text-[10px] md:text-xs font-medium text-gray-200 tracking-wide">
                                <span className="text-white font-bold">5</span> Certificados + <span className="text-white font-bold">1</span> Diploma de Analista
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-24">




                {/* --- SECCIÓN 2: RUTAS DE CARRERA (MISSION MAPS) --- */}
                <section className='block md:hidden' id="rutas" ref={pathsRef}>
                    <div className="flex flex-col items-center text-center gap-4 mb-16">
                        <div className="flex items-center gap-4 animate-fade-in-up">
                            <span className="material-symbols-outlined text-[#00F5F1] text-4xl shadow-cyan-glow rounded-full">map</span>
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
                                Mapas de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5F1] to-white">Rutas de Carrera</span>
                            </h2>
                        </div>
                        <p className="text-gray-400 max-w-xl text-sm md:text-base border border-white/5 bg-white/5 px-6 py-2 rounded-full backdrop-blur-md">
                            Completa cursos tácticos para desbloquear tu <span className="text-[#00F5F1] font-bold">Certificado de Analista e Insignia de Carrera</span>.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
                        {CAREER_PATHS.map((path) => {
                            // Calculate total progress across all stages
                            const allCourses = path.stages.flatMap(s => s.courses);
                            const totalCoursesCount = allCourses.length;
                            // In a real app, check user.enrolledCourses for specific matches
                            // For demo, we'll randomize or set to 0, or check actual names if user has them (advanced)
                            // Let's assume 0 for now as we don't have matching IDs in user yet
                            const completedCount = 0;
                            const isPathCompleto = false;

                            return (
                                <div key={path.id} className="group relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 hover:border-[#00F5F1]/50 transition-all duration-500 hover:shadow-[0_0_50px_-10px_rgba(0,245,241,0.15)] flex flex-col overflow-hidden">
                                    {/* Decorative Grid Background */}
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
                                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#00F5F1]/5 rounded-full blur-[80px] group-hover:bg-[#00F5F1]/10 transition-colors duration-500"></div>

                                    {/* Header Icon & Title */}
                                    <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-5 mb-6 pb-6 border-b border-white/5">
                                        <div className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center border bg-white/5 border-white/10 group-hover:border-[#00F5F1]/30 transition-all duration-500">
                                            <span className="material-symbols-outlined text-3xl text-gray-400 group-hover:text-[#00F5F1] transition-colors duration-300">
                                                {path.icon}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-[#00F5F1] transition-colors">{path.title}</h3>
                                            <p className="text-sm text-gray-400 leading-relaxed">{path.description}</p>
                                        </div>
                                    </div>

                                    {/* --- STAGES --- */}
                                    <div className="relative z-10 flex flex-col gap-5">
                                        {path.stages.map((stage, sIdx) => (
                                            <div key={sIdx} className="relative">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="px-2 py-0.5 rounded bg-[#00F5F1]/10 border border-[#00F5F1]/20 text-[#00F5F1] text-[10px] font-bold uppercase tracking-wider">
                                                        {stage.name.split(':')[0]}
                                                    </div>
                                                    <h4 className="text-xs font-medium text-white/80">{stage.name.split(':')[1]}</h4>
                                                </div>

                                                {/* Timeline Layout for Stage */}
                                                <div className="relative pl-4 border-l border-white/10 ml-2 py-1 flex flex-col gap-1.5">
                                                    {stage.courses.map((courseName, cIdx) => {
                                                        const course = COURSES.find(c => c.title === courseName);
                                                        return (
                                                            <div
                                                                key={cIdx}
                                                                onClick={() => course && navigate(`/academia/${course.id}`)}
                                                                className={`flex items-center gap-3 group/item transition-colors ${course ? 'cursor-pointer' : 'cursor-default'}`}
                                                            >
                                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover/item:bg-[#00F5F1] transition-colors relative">
                                                                    <div className="absolute inset-0 bg-[#00F5F1] blur-sm opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                                                                </div>
                                                                <span className="text-xs text-gray-500 group-hover/item:text-white transition-colors">
                                                                    {courseName}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Final Incentive */}
                                    <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between relative z-10">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#00F5F1] text-lg">military_tech</span>
                                            <span className="text-xs font-bold text-gray-300">Recompensa: <span className="text-white">{path.incentive}</span></span>
                                        </div>
                                        <div className="relative">
                                            <button
                                                onClick={() => setActiveIncentive(activeIncentive === path.id ? null : path.id)}
                                                className="px-4 py-1.5 rounded-md bg-[#00F5F1]/10 text-[#00F5F1] font-bold text-xs border border-[#00F5F1]/30 hover:bg-[#00F5F1]/20 transition-all flex items-center gap-1"
                                            >
                                                {activeIncentive === path.id ? 'Cerrar' : 'Ver Detalles'}
                                            </button>

                                            {/* Tooltip Popover */}
                                            {activeIncentive === path.id && (
                                                <div className="absolute bottom-full right-0 mb-3 w-64 p-4 rounded-xl bg-[#1a1a1a] border border-[#00F5F1]/30 shadow-[0_0_30px_-5px_rgba(0,245,241,0.2)] z-50 animate-fade-in-up">
                                                    <div className="absolute -bottom-2 right-6 w-4 h-4 bg-[#1a1a1a] border-b border-r border-[#00F5F1]/30 transform rotate-45"></div>
                                                    <h5 className="text-[#00F5F1] font-bold text-xs mb-2 uppercase tracking-wider">Sobre la Certificación</h5>
                                                    <p className="text-xs text-gray-300 leading-relaxed">
                                                        {path.incentiveDescription}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            )
                        })}
                    </div>
                </section>




                {/* --- SECCIÓN 2: RUTAS DE CARRERA (MISSION MAPS) --- */}
                <section className='hidden md:block' id="rutas" ref={pathsRef}>
                    <div className="flex flex-col items-center text-center gap-4 mb-16">
                        <div className="flex items-center gap-4 animate-fade-in-up">
                            <span className="material-symbols-outlined text-[#00F5F1] text-4xl shadow-cyan-glow rounded-full">map</span>
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
                                Mapas de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5F1] to-white">Rutas de Carrera</span>
                            </h2>
                        </div>
                        <p className="text-gray-400 max-w-xl text-sm md:text-base border border-white/5 bg-white/5 px-6 py-2 rounded-full backdrop-blur-md">
                            Completa cursos tácticos para desbloquear tu <span className="text-[#00F5F1] font-bold">Certificado de Analista e Insignia de Carrera</span>.
                        </p>
                    </div>

                    <div className="flex flex-col gap-8 relative z-10 w-full max-w-7xl mx-auto">
                        {CAREER_PATHS.map((path) => (
                            <div key={path.id} className="relative">
                                {/* Career Path Container */}
                                <div className="bg-black/40 border border-white/10 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group">
                                    {/* Background Decor */}
                                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-[#00F5F1]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                                    {/* Header */}
                                    <div className="flex flex-col md:flex-row items-center gap-6 mb-8 relative z-10">
                                        <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00F5F1] shadow-[0_0_20px_rgba(0,245,241,0.1)]">
                                            <span className="material-symbols-outlined text-4xl">{path.icon}</span>
                                        </div>
                                        <div className="text-center md:text-left">
                                            <h3 className="text-3xl font-bold text-white mb-2">{path.title}</h3>
                                            <p className="text-gray-400 max-w-2xl">{path.description}</p>
                                        </div>
                                    </div>

                                    {/* Timeline Component */}
                                    <CourseTimeline
                                        stages={path.stages.map(stage => ({
                                            name: stage.name.split(':')[0], // "Etapa 1"
                                            description: stage.name.split(':')[1] || stage.description, // Description
                                            courses: stage.courses.map(courseName => {
                                                const found = COURSES.find(c => c.title === courseName);
                                                return found ? { title: found.title, id: found.id } : { title: courseName, id: '#' };
                                            })
                                        }))}
                                        incentive={path.incentive}
                                        careerTitle="Mapa de Misiones"
                                    />

                                    {/* Footer Actions */}
                                    <div className="flex justify-end border-t border-white/5">
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- SECCIÓN 3: CATÁLOGO DE CURSOS --- */}
                <section id="catalogo" ref={catalogRef}>
                    <div className="flex items-center gap-4 mb-8">
                        <span className="material-symbols-outlined text-[#00F5F1] text-3xl">library_books</span>
                        <h2 className="text-3xl md:text-4xl font-bold">Biblioteca Táctica</h2>
                    </div>

                    {/* --- FILTERS & SEARCH UI --- */}
                    <div className="mb-12 space-y-6">
                        {/* Search Bar */}
                        <div className="relative max-w-2xl">
                            <input
                                type="text"
                                placeholder="Buscar curso por nombre, tema o palabra clave..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[#0a0a0a]/80 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#00F5F1]/50 focus:ring-1 focus:ring-[#00F5F1]/50 transition-all"
                            />
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                        </div>

                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Career Filters */}
                            <div className="flex-1">
                                <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Filtrar por Ruta:</h3>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => handleCareerFilter(null)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${!selectedCareerId ? 'bg-[#00F5F1] text-black border-[#00F5F1]' : 'bg-transparent text-gray-400 border-white/10 hover:border-white'}`}
                                    >
                                        Todas
                                    </button>
                                    {CAREER_PATHS.map(path => (
                                        <button
                                            key={path.id}
                                            onClick={() => handleCareerFilter(path.id)}
                                            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-2 ${selectedCareerId === path.id ? 'bg-[#00F5F1]/20 text-[#00F5F1] border-[#00F5F1]' : 'bg-transparent text-gray-400 border-white/10 hover:border-white'}`}
                                        >
                                            <span className="material-symbols-outlined text-sm">{path.icon}</span>
                                            {path.title}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Category Filters */}
                            <div className="flex-1">
                                <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Filtrar por Tema:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => handleCategoryFilter(cat)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${selectedCategory === cat ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-300 border-white/5 hover:bg-white/10'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {filteredCourses.length === 0 ? (
                        <div className="text-center py-20 border border-white/5 rounded-2xl bg-white/5 mx-auto max-w-2xl">
                            <span className="material-symbols-outlined text-gray-500 text-5xl mb-4">search_off</span>
                            <h3 className="text-xl font-bold text-white mb-2">No encontramos cursos</h3>
                            <p className="text-gray-400">Intenta ajustar tus filtros de búsqueda.</p>
                            <button
                                onClick={() => { setSearchTerm(''); setSelectedCareerId(null); setSelectedCategory(null); }}
                                className="mt-6 text-[#00F5F1] hover:underline"
                            >
                                Limpiar todos los filtros
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredCourses.map(course => {
                                const isEnrolled = user?.enrolledCourses?.includes(course.id);
                                const isInCart = cart.some(item => item.id === course.id);

                                return (
                                    <div
                                        key={course.id}
                                        onClick={() => navigate(`/academia/${course.id}`)}
                                        className="flex flex-col bg-gray-900/40 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden hover:border-[#00F5F1]/50 transition-all duration-300 group hover:-translate-y-1 cursor-pointer"
                                    >
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
                                                    Nivel {course.level || 'Intermedio'}
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
                                                        onClick={(e) => { e.stopPropagation(); navigate(`/academia/${course.id}`); }}
                                                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
                                                        title="Ver Detalles"
                                                    >
                                                        <span className="material-symbols-outlined text-xl">visibility</span>
                                                    </button>

                                                    {isEnrolled ? (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); navigate(`/aula-virtual/${course.id}`); }}
                                                            className="px-4 py-2 rounded-lg bg-[#00F5F1]/20 text-[#00F5F1] font-bold text-sm border border-[#00F5F1]/30 hover:bg-[#00F5F1]/30 transition-all flex items-center gap-2"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">school</span>
                                                            Aula
                                                        </button>
                                                    ) : isInCart ? (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); navigate('/checkout'); }}
                                                            className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 font-bold text-sm border border-green-500/30 flex items-center gap-2"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">shopping_cart_checkout</span>
                                                            Carrito
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={(e) => handleAddToCart(e, course)}
                                                            disabled={isCheckingSchedules === course.id}
                                                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(0,245,241,0.3)] ${isCheckingSchedules === course.id
                                                                ? 'bg-gray-600 text-gray-300 cursor-wait shadow-none'
                                                                : 'bg-[#00F5F1] text-black hover:bg-white'
                                                                }`}
                                                        >
                                                            {isCheckingSchedules === course.id ? (
                                                                <span className="material-symbols-outlined text-sm animate-spin">hourglass_top</span>
                                                            ) : (
                                                                <span className="material-symbols-outlined text-sm">add</span>
                                                            )}
                                                            {isCheckingSchedules === course.id ? 'Un momento...' : 'Comprar'}
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

            {/* Modal de Selección de Horarios */}
            {isScheduleModalOpen && selectedCourseForSchedule && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative overflow-hidden">
                        {/* Gradient decorativo */}
                        <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#00F5F1]/10 rounded-full blur-[80px]"></div>

                        <div className="relative z-10 flex flex-col gap-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#00F5F1]">event_available</span>
                                Horarios Disponibles
                            </h2>
                            <p className="text-sm text-gray-400 -mt-2">
                                Seleccioná el horario al que deseás asistir para el curso <span className="text-white font-semibold">"{selectedCourseForSchedule.title}"</span>.
                            </p>

                            <ScheduleSelector
                                courseId={selectedCourseForSchedule.id}
                                onSelect={setSelectedSchedule}
                                selectedScheduleId={selectedSchedule?.id}
                                mode="pills"
                            />

                            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                                <button
                                    onClick={() => {
                                        setIsScheduleModalOpen(false);
                                        setSelectedCourseForSchedule(null);
                                    }}
                                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors border border-white/10"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => {
                                        if (!selectedSchedule) return;
                                        addToCart({
                                            id: selectedCourseForSchedule.id,
                                            title: selectedCourseForSchedule.title,
                                            price: selectedCourseForSchedule.price,
                                            image: selectedCourseForSchedule.image,
                                            type: 'course',
                                            selectedSchedule: selectedSchedule
                                        });
                                        setIsScheduleModalOpen(false);
                                        setSelectedCourseForSchedule(null);
                                    }}
                                    disabled={!selectedSchedule}
                                    className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${selectedSchedule
                                        ? 'bg-[#00F5F1] text-black hover:bg-white shadow-[0_0_15px_rgba(0,245,241,0.3)]'
                                        : 'bg-[#00F5F1]/10 text-[#00F5F1]/50 cursor-not-allowed border border-[#00F5F1]/20'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                                    Confirmar y Agregar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Academy;