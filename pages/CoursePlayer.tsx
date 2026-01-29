import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { COURSES } from '../data/courses';

const CoursePlayer: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, isAuthenticated, markModuleCompleted } = useAuth();

    // Estado de Navegación
    const [currentModuleIdx, setCurrentModuleIdx] = useState(0);
    const [currentLessonIdx, setCurrentLessonIdx] = useState(0);

    // Modos de vista: 'lesson', 'quiz', 'certificate'
    const [viewMode, setViewMode] = useState<'lesson' | 'quiz' | 'certificate'>('lesson');

    // Estado del Quiz
    const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizScore, setQuizScore] = useState(0);

    const selectedCourse = COURSES.find(c => c.id === id);

    useEffect(() => {
        setCurrentModuleIdx(0);
        setCurrentLessonIdx(0);
        setViewMode('lesson');
    }, [id]);

    if (!selectedCourse) return <div className="p-20 text-center text-white">Curso no encontrado</div>;
    if (!isAuthenticated || !user?.enrolledCourses?.includes(selectedCourse.id)) return <div className="p-20 text-center text-white">No tienes acceso.</div>;

    // --- LÓGICA DE PROGRESO Y BLOQUEO ---
    const userProgress = user.progress?.[selectedCourse.id] || [];

    const isModuleLocked = (modIndex: number) => {
        if (modIndex === 0) return false;
        const prevModuleId = selectedCourse.modules[modIndex - 1].id;
        return !userProgress.includes(prevModuleId);
    };

    const isCertificateUnlocked = () => {
        return selectedCourse.modules.every(m => !m.quiz || userProgress.includes(m.id));
    };

    // --- VARIABLES DE VISTA ACTUAL ---
    const activeModule = selectedCourse.modules[currentModuleIdx];
    const activeLesson = activeModule?.lessons[currentLessonIdx];
    const activeQuiz = activeModule?.quiz;

    // --- MANEJADORES DEL QUIZ ---
    const handleQuizOptionSelect = (questionId: string, optionIdx: number) => {
        if (quizSubmitted) return;
        setQuizAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
    };

    const handleSubmitQuiz = async () => {
        if (!activeQuiz) return;

        let score = 0;
        activeQuiz.questions.forEach(q => {
            if (quizAnswers[q.id] === q.correctAnswer) {
                score++;
            }
        });

        setQuizScore(score);

        if (score >= activeQuiz.passingScore) {
            await markModuleCompleted(selectedCourse.id, activeModule.id);
        }

        setQuizSubmitted(true);
    };

    const handleRetryQuiz = () => {
        setQuizAnswers({});
        setQuizSubmitted(false);
        setQuizScore(0);
    };

    // --- MANEJADORES DE NAVEGACIÓN ---
    const goToLesson = (modIdx: number, lessonIdx: number) => {
        if (isModuleLocked(modIdx)) return;
        setCurrentModuleIdx(modIdx);
        setCurrentLessonIdx(lessonIdx);
        setViewMode('lesson');
    };

    const goToQuiz = (modIdx: number) => {
        if (isModuleLocked(modIdx)) return;
        setCurrentModuleIdx(modIdx);
        setViewMode('quiz');
        setQuizAnswers({});
        setQuizSubmitted(false);
    };

    // Certificado Component
    const CertificateView = () => (
        <div className="w-full h-full flex items-center justify-center p-4">
            <div className="bg-white text-black p-10 md:p-16 rounded-lg shadow-2xl max-w-4xl w-full border-[10px] border-double border-primary text-center relative overflow-hidden animate-fade-in-up">
                <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-br-full"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/10 rounded-tl-full"></div>

                <div className="relative z-10">
                    <span className="material-symbols-outlined text-6xl text-primary mb-4">workspace_premium</span>
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-2 uppercase tracking-widest text-primary">Certificado</h1>
                    <p className="text-xl text-gray-500 mb-8 uppercase tracking-widest">de Finalización</p>

                    <p className="text-lg text-gray-600 mb-2">Este certificado se otorga a</p>
                    <h2 className="text-3xl md:text-4xl font-bold text-black border-b-2 border-gray-300 pb-2 mb-2 inline-block min-w-[300px]">{user?.name}</h2>
                    {user?.dni && <p className="text-sm text-gray-500 mb-6">DNI: {user.dni}</p>}

                    <p className="text-lg text-gray-600 mb-2">Por haber completado satisfactoriamente el curso</p>
                    <h3 className="text-2xl font-bold text-primary mb-10">{selectedCourse.title}</h3>

                    <div className="flex justify-between items-end w-full max-w-lg mx-auto mt-12">
                        <div className="text-center">
                            <div className="w-40 border-b border-gray-400 mb-2"></div>
                            <p className="text-xs font-bold text-gray-500 uppercase">Flip Academy</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-bold text-gray-800">{new Date().toLocaleDateString()}</p>
                            <div className="w-40 border-b border-gray-400 mb-2"></div>
                            <p className="text-xs font-bold text-gray-500 uppercase">Fecha</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in min-h-screen flex flex-col">
            <div className="flex flex-col lg:flex-row h-full min-h-screen">

                {/* --- SIDEBAR --- */}
                <aside className="w-full lg:w-80 flex-none flex flex-col border-r border-border-dark bg-surface-dark lg:h-screen lg:sticky lg:top-0">
                    <div className="p-4 flex items-center justify-between border-b border-white/5 bg-surface-darker">
                        <div>
                            <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-1">Aula Virtual</p>
                            <h1 className="text-white text-xs font-bold line-clamp-1">{selectedCourse.title}</h1>
                        </div>
                        <button onClick={() => navigate('/mis-cursos')} className="text-text-muted hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors">
                            <span className="material-symbols-outlined text-lg">logout</span>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2">
                        {selectedCourse.modules.map((module, modIdx) => {
                            const locked = isModuleLocked(modIdx);
                            const completed = userProgress.includes(module.id);

                            return (
                                <div key={module.id} className={`mb-4 ${locked ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <div className="flex items-center justify-between px-3 py-2 bg-surface-dark sticky top-0 z-10">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{module.title}</h3>
                                        {locked && <span className="material-symbols-outlined text-xs text-gray-600">lock</span>}
                                        {completed && <span className="material-symbols-outlined text-xs text-green-500">check_circle</span>}
                                    </div>

                                    <div className="space-y-1 relative">
                                        {module.lessons.map((lesson, lessonIdx) => {
                                            const isActive = viewMode === 'lesson' && modIdx === currentModuleIdx && lessonIdx === currentLessonIdx;

                                            // Icono dinámico según tipo de contenido
                                            let icon = 'play_circle';
                                            if (!lesson.videoUrl && lesson.presentationUrl) icon = 'slideshow';
                                            if (!lesson.videoUrl && !lesson.presentationUrl && lesson.textContent) icon = 'article';

                                            return (
                                                <button
                                                    key={lesson.id}
                                                    onClick={() => goToLesson(modIdx, lessonIdx)}
                                                    className={`w-full flex items-start gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200 group
                                                        ${isActive ? 'bg-primary/20 border-l-2 border-primary' : 'hover:bg-white/5 border-l-2 border-transparent'}`}
                                                >
                                                    <span className={`text-[10px] font-mono mt-0.5 ${isActive ? 'text-primary' : 'text-gray-600'}`}>{modIdx + 1}.{lessonIdx + 1}</span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-xs font-bold leading-tight ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>{lesson.title}</p>
                                                        <span className="text-[10px] text-gray-600 flex items-center gap-1 mt-1">
                                                            <span className="material-symbols-outlined text-[12px]">{icon}</span> {lesson.duration}
                                                        </span>
                                                    </div>
                                                </button>
                                            );
                                        })}

                                        {module.quiz && (
                                            <button
                                                onClick={() => goToQuiz(modIdx)}
                                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all mt-1 group border-l-2 
                                                    ${viewMode === 'quiz' && modIdx === currentModuleIdx ? 'bg-accent/20 border-accent' : 'hover:bg-white/5 border-transparent'}`}
                                            >
                                                <span className={`material-symbols-outlined text-sm ${completed ? 'text-green-500' : 'text-accent'}`}>
                                                    {completed ? 'task_alt' : 'assignment'}
                                                </span>
                                                <div>
                                                    <p className={`text-xs font-bold ${viewMode === 'quiz' && modIdx === currentModuleIdx ? 'text-white' : 'text-gray-400'}`}>Examen Final</p>
                                                    <p className="text-[10px] text-gray-500">{module.quiz.questions.length} Preguntas</p>
                                                </div>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        <div className="mt-8 px-2">
                            <button
                                onClick={() => {
                                    if (!isCertificateUnlocked()) return;
                                    if (!user?.dni) {
                                        // Asumimos que hay un toast disponible vía props o contexto, pero CoursePlayer no recibe onShowToast actualmente.
                                        // Usaremos alert temporalmente o agregaremos un mensaje visible.
                                        // Nota: CoursePlayer no tiene onShowToast.
                                        // Opcion: Agregar un mensaje en el UI o redirigir.
                                        alert("Debes completar tu DNI en tu Perfil para emitir el certificado.");
                                        navigate('/perfil');
                                        return;
                                    }
                                    setViewMode('certificate');
                                }}
                                disabled={!isCertificateUnlocked()}
                                className={`w-full py-4 rounded-xl border border-dashed flex flex-col items-center justify-center gap-2 transition-all
                                    ${isCertificateUnlocked()
                                        ? 'border-tech bg-tech/10 text-tech hover:bg-tech/20 cursor-pointer'
                                        : 'border-gray-700 bg-transparent text-gray-600 cursor-not-allowed opacity-50'}`}
                            >
                                <span className="material-symbols-outlined text-2xl">workspace_premium</span>
                                <span className="text-xs font-bold uppercase tracking-wider">Certificado Final</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* --- MAIN CONTENT --- */}
                <main className="flex-1 bg-background-dark p-4 lg:p-10 overflow-y-auto">

                    {viewMode === 'certificate' && <CertificateView />}

                    {/* VISTA DE LECCIÓN (CONTENIDO DINÁMICO) */}
                    {viewMode === 'lesson' && activeLesson && (
                        <div className="max-w-5xl mx-auto">

                            {/* 1. REPRODUCTOR DE VIDEO (Prioridad 1) */}
                            {activeLesson.videoUrl && (
                                <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/5 mb-8">
                                    <iframe className="absolute inset-0 w-full h-full" src={activeLesson.videoUrl} title={activeLesson.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                </div>
                            )}

                            {/* 2. PRESENTACIÓN GOOGLE SLIDES (Prioridad 2 - Si no hay video, o además de) */}
                            {activeLesson.presentationUrl && !activeLesson.videoUrl && (
                                <div className="relative w-full aspect-video bg-[#222] rounded-2xl overflow-hidden shadow-2xl border border-white/5 mb-8 flex flex-col">
                                    <iframe className="flex-1 w-full h-full" src={activeLesson.presentationUrl} frameBorder="0" width="100%" height="100%" allowFullScreen></iframe>
                                    <div className="bg-black/50 p-2 text-center text-xs text-gray-500">
                                        Presentación de Google Slides
                                    </div>
                                </div>
                            )}

                            {/* CABECERA */}
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 pb-8 border-b border-white/5">
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-white mb-4">{activeLesson.title}</h2>
                                    <p className="text-gray-300 mb-6">{activeLesson.description}</p>

                                    {/* 3. CONTENIDO DE TEXTO (Lectura) */}
                                    {activeLesson.textContent && (
                                        <div className="prose prose-invert prose-p:text-gray-300 prose-headings:text-white max-w-none bg-surface-dark p-6 rounded-2xl border border-white/5">
                                            <div dangerouslySetInnerHTML={{ __html: activeLesson.textContent }} />
                                        </div>
                                    )}
                                </div>

                                {/* RECURSOS */}
                                {activeLesson.resources && activeLesson.resources.length > 0 && (
                                    <div className="w-full md:w-64 bg-surface-dark rounded-xl p-4 border border-white/5 shrink-0">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Recursos</h3>
                                        {activeLesson.resources.map((res, i) => (
                                            <a key={i} href={res.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 hover:bg-white/5 rounded text-sm text-primary">
                                                <span className="material-symbols-outlined text-sm">
                                                    {res.type === 'pdf' ? 'picture_as_pdf' : res.type === 'video' ? 'movie' : 'link'}
                                                </span>
                                                {res.title}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {viewMode === 'quiz' && activeQuiz && (
                        <div className="max-w-3xl mx-auto py-10">
                            {/* ... (Lógica del Quiz sin cambios visuales mayores) ... */}
                            <div className="text-center mb-10">
                                <span className="inline-block p-3 rounded-full bg-accent/20 text-accent mb-4">
                                    <span className="material-symbols-outlined text-4xl">quiz</span>
                                </span>
                                <h2 className="text-3xl font-bold text-white mb-2">{activeQuiz.title}</h2>
                                <p className="text-gray-400">Responde correctamente para desbloquear el siguiente módulo.</p>
                            </div>

                            <div className="space-y-6">
                                {activeQuiz.questions.map((q, idx) => (
                                    <div key={q.id} className="bg-surface-dark border border-white/5 p-6 rounded-2xl">
                                        <h3 className="text-lg font-bold text-white mb-4 flex gap-3">
                                            <span className="text-gray-500">{idx + 1}.</span> {q.question}
                                        </h3>
                                        <div className="space-y-2">
                                            {q.options.map((opt, optIdx) => {
                                                const isSelected = quizAnswers[q.id] === optIdx;
                                                let optionClass = "border-white/10 hover:bg-white/5 text-gray-300";

                                                if (quizSubmitted) {
                                                    if (optIdx === q.correctAnswer) optionClass = "border-green-500/50 bg-green-500/10 text-green-400";
                                                    else if (isSelected && optIdx !== q.correctAnswer) optionClass = "border-red-500/50 bg-red-500/10 text-red-400";
                                                    else optionClass = "opacity-50 border-transparent";
                                                } else if (isSelected) {
                                                    optionClass = "border-primary bg-primary/20 text-white";
                                                }

                                                return (
                                                    <button
                                                        key={optIdx}
                                                        onClick={() => handleQuizOptionSelect(q.id, optIdx)}
                                                        disabled={quizSubmitted}
                                                        className={`w-full text-left p-4 rounded-xl border transition-all flex justify-between items-center ${optionClass}`}
                                                    >
                                                        <span>{opt}</span>
                                                        {quizSubmitted && optIdx === q.correctAnswer && <span className="material-symbols-outlined">check_circle</span>}
                                                        {quizSubmitted && isSelected && optIdx !== q.correctAnswer && <span className="material-symbols-outlined">cancel</span>}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-10 flex flex-col items-center">
                                {!quizSubmitted ? (
                                    <button
                                        onClick={handleSubmitQuiz}
                                        disabled={Object.keys(quizAnswers).length < activeQuiz.questions.length}
                                        className="bg-primary hover:bg-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        Enviar Respuestas
                                    </button>
                                ) : (
                                    <div className="text-center animate-fade-in">
                                        <div className="mb-6">
                                            <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Tu Puntuación</p>
                                            <p className={`text-4xl font-bold ${quizScore >= activeQuiz.passingScore ? 'text-green-400' : 'text-red-400'}`}>
                                                {quizScore} / {activeQuiz.questions.length}
                                            </p>
                                        </div>

                                        {quizScore >= activeQuiz.passingScore ? (
                                            <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl mb-6">
                                                <h4 className="text-xl font-bold text-white mb-2">¡Felicitaciones! Aprovaste</h4>
                                                <p className="text-green-200 text-sm mb-4">Has desbloqueado el siguiente paso.</p>
                                                {currentModuleIdx < selectedCourse.modules.length - 1 ? (
                                                    <button onClick={() => goToLesson(currentModuleIdx + 1, 0)} className="bg-green-500 text-black px-6 py-2 rounded-lg font-bold hover:bg-green-400">
                                                        Siguiente Módulo
                                                    </button>
                                                ) : (
                                                    <button onClick={() => {
                                                        if (!user?.dni) {
                                                            alert("DNI requerido para el certificado. Ve a tu perfil.");
                                                            navigate('/perfil');
                                                        } else {
                                                            setViewMode('certificate');
                                                        }
                                                    }} className="bg-tech text-black px-6 py-2 rounded-lg font-bold hover:bg-cyan-400">
                                                        Ver Certificado
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl mb-6">
                                                <h4 className="text-xl font-bold text-white mb-2">No alcanzaste el mínimo</h4>
                                                <button onClick={handleRetryQuiz} className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-bold transition-colors">
                                                    Intentar de Nuevo
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CoursePlayer;