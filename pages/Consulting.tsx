import React, { useRef } from 'react';
import emailjs from '@emailjs/browser'; // Debes instalarlo: npm install @emailjs/browser

interface ConsultingProps {
    onShowToast: (text: string) => void;
}

const Consulting: React.FC<ConsultingProps> = ({ onShowToast }) => {

  // 1. Todas las referencias van dentro del componente

  const form = useRef<HTMLFormElement>(null);

  const BoxDeContacto = useRef<HTMLDivElement>(null);



  // 2. Las funciones también van dentro del componente

  const handleScroll = () => {

    BoxDeContacto.current?.scrollIntoView({ behavior: 'smooth' });

  };



  const sendEmail = (e: React.FormEvent) => {

    e.preventDefault();



    // IMPORTANTE: Debes configurar tu cuenta en emailjs.com y obtener estos IDs

    emailjs.sendForm(

      'service_mz9icku',     // Reemplaza con tu Service ID

      'template_44c5yyn',    // Reemplaza con tu Template ID

      form.current!, 

      'KYQOoh5UrGdE56vpo'      // Reemplaza con tu Public Key

    )

    .then(() => {

        onShowToast('Solicitud enviada');

        form.current?.reset(); 

    }, (error) => {

        onShowToast('Error al enviar: ' + error.text);

    });

  };



    return (
        <div className="animate-fade-in">
             {/* Hero Section de Consultas */}
             <section className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden pt-20 pb-20">
                <div className="absolute inset-0 z-0">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]"></div>
                </div>
                <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
                    <div className="w-fit mx-auto flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                        </span>
                        <span className="text-xs font-medium text-gray-400">Aceptamos Nuevos Socios</span>
                    </div>
                    <h1 className="max-w-4xl text-5xl font-black leading-tight text-white sm:text-6xl lg:text-8xl mb-6">
                        DEJA DE HACERLO SOLO. <br/> <span className="text-gradient">EMPIEZA A CONSTRUIR JUNTOS.</span>
                    </h1>
                    <p className="max-w-2xl text-lg text-gray-400 mb-10">No solo te enseñamos a crecer. Construimos los sistemas contigo. Consigue la alianza estratégica que necesitas para superar el estancamiento.</p>
                    
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <button onClick={handleScroll} className="group relative flex h-12 w-full sm:w-auto min-w-[200px] items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary px-6 text-sm font-bold text-white transition-all hover:bg-purple-600 hover:scale-[1.02]">
                            <span>Contactanos</span>
                            <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                        </button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-20 flex flex-wrap justify-center gap-8 opacity-60 grayscale transition-all hover:grayscale-0 hover:opacity-100">
                        <div className="flex items-center gap-2 text-white">
                            <span className="material-symbols-outlined">verified</span>
                            <span className="text-sm font-bold">Con la Confianza de Muchos Creadores</span>
                        </div>
                        <div className="h-6 w-px bg-white/20"></div>
                        <div className="flex items-center gap-2 text-white">
                            <span className="material-symbols-outlined">trending_up</span>
                            <span className="text-sm font-bold">Más Ingresos Generados</span>
                        </div>
                    </div>
                </div>
            </section>

{/* Value Proposition & Roadmap Section */}
<section className="relative w-full bg-surface-darker py-24">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24 items-start">
            
            {/* Left Content: Se mantiene sticky */}
            <div className="lg:sticky lg:top-32 flex flex-col gap-6">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <span className="material-symbols-outlined">hub</span>
                </div>
                <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                    LA HOJA DE RUTA DE LA ASOCIACIÓN
                </h2>
                <p className="text-lg text-gray-400">
                    La mayor parte de la consultoría es solo asesoramiento. Nosotros nos encargamos de la ejecución.
                </p>
                <ul className="mt-4 space-y-4">
                    <li className="flex items-start gap-3">
                        <span className="material-symbols-outlined mt-1 text-primary">check_circle</span>
                        <span className="text-gray-300">Acceso directo a estrategas senior.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="material-symbols-outlined mt-1 text-primary">check_circle</span>
                        <span className="text-gray-300">Infraestructura de crecimiento personalizada.</span>
                    </li>
                </ul>
            </div>

            {/* Right: Timeline Visualization */}
            <div className="relative">
                {/* LÍNEA VERTICAL CORREGIDA: Ahora recorre todo el alto del contenedor */}
                <div className="absolute left-[19px] sm:left-[27px] top-4 bottom-4 w-[2px] bg-white/10 z-0"></div>

                <div className="flex flex-col gap-12">
                    {/* Step 1 */}
                    <div className="group relative flex gap-6">
                        <div className="relative z-10 flex h-10 w-10 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full border-4 border-surface-darker bg-surface-dark text-white ring-1 ring-white/20 transition-all group-hover:bg-primary group-hover:ring-primary">
                            <span className="material-symbols-outlined text-sm sm:text-base">search</span>
                        </div>
                        <div className="flex flex-col pt-1 sm:pt-2">
                            <span className="text-sm font-bold uppercase tracking-wider text-primary">SEMANA 1</span>
                            <h3 className="text-xl font-bold text-white">Auditoría Profunda</h3>
                            <p className="mt-2 text-gray-400">Analizamos su embudo actual y estrategia de contenido.</p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="group relative flex gap-6">
                        <div className="relative z-10 flex h-10 w-10 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full border-4 border-surface-darker bg-surface-dark text-white ring-1 ring-white/20 transition-all group-hover:bg-primary group-hover:ring-primary">
                            <span className="material-symbols-outlined text-sm sm:text-base">strategy</span>
                        </div>
                        <div className="flex flex-col pt-1 sm:pt-2">
                            <span className="text-sm font-bold uppercase tracking-wider text-primary">SEMANA 2</span>
                            <h3 className="text-xl font-bold text-white">Plan estratégico</h3>
                            <p className="mt-2 text-gray-400">Creamos la nueva hoja de ruta paso a paso.</p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="group relative flex gap-6">
                        <div className="relative z-10 flex h-10 w-10 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full border-4 border-surface-darker bg-surface-dark text-white ring-1 ring-white/20 transition-all group-hover:bg-primary group-hover:ring-primary">
                            <span className="material-symbols-outlined text-sm sm:text-base">rocket_launch</span>
                        </div>
                        <div className="flex flex-col pt-1 sm:pt-2">
                            <span className="text-sm font-bold uppercase tracking-wider text-primary">SEMANAS 3-10</span>
                            <h3 className="text-xl font-bold text-white">Co-ejecución</h3>
                            <p className="mt-2 text-gray-400">Te ayudamos a implementar la tecnología y lanzar campañas.</p>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className="group relative flex gap-6">
                        <div className="relative z-10 flex h-10 w-10 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full border-4 border-surface-darker bg-surface-dark text-white ring-1 ring-white/20 transition-all group-hover:bg-primary group-hover:ring-primary">
                            <span className="material-symbols-outlined text-sm sm:text-base">analytics</span>
                        </div>
                        <div className="flex flex-col pt-1 sm:pt-2">
                            <span className="text-sm font-bold uppercase tracking-wider text-primary">SEMANA 12</span>
                            <h3 className="text-xl font-bold text-white">Optimización</h3>
                            <p className="mt-2 text-gray-400">Eliminar lo que no funciona y reforzar lo que sí.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

    <section className="w-full bg-background-dark py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl uppercase">
            ¿POR QUÉ ELEGIR UN SOCIO?
          </h2>
          <p className="mt-4 text-gray-400">La diferencia entre adivinar y saber.</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface-darker shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Left: Traditional */}
            <div className="border-b border-white/10 p-8 md:border-b-0 md:border-r">
              <div className="mb-6 flex items-center gap-3 opacity-60">
                <span className="material-symbols-outlined text-3xl">school</span>
                <h3 className="text-xl font-bold text-white">Aprendizaje tradicional</h3>
              </div>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined shrink-0 text-red-500">close</span>
                  <div>
                    <p className="font-bold text-gray-300">Cursos de vídeo genéricos</p>
                    <p className="text-sm text-gray-500">Contenido universal que rara vez se aplica a su contexto específico.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined shrink-0 text-red-500">close</span>
                  <div>
                    <p className="font-bold text-gray-300">Cero responsabilidad</p>
                    <p className="text-sm text-gray-500">Es fácil quedarse atrás cuando nadie controla tu progreso.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined shrink-0 text-red-500">close</span>
                  <div>
                    <p className="font-bold text-gray-300">Prueba y error</p>
                    <p className="text-sm text-gray-500">Presupuesto desperdiciado probando teorías que no han sido demostradas.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined shrink-0 text-red-500">close</span>
                  <div>
                    <p className="font-bold text-gray-300">Lucha aislada</p>
                    <p className="text-sm text-gray-500">Resolver problemas complejos solo sin una segunda opinión.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Right: Flip DWY (Highlighted) */}
            <div className="relative overflow-hidden bg-primary/5 p-8">
              {/* Decorative Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"></div>
              
              <div className="relative z-10 mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl text-primary">handshake</span>
                <h3 className="text-xl font-bold text-white">Socio estratégico de Flip</h3>
              </div>
              
              <ul className="relative z-10 space-y-6">
                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined shrink-0 text-primary">check</span>
                  <div>
                    <p className="font-bold text-white">Plan de ejecución a medida</p>
                    <p className="text-sm text-gray-400">Estrategias creadas específicamente para su audiencia y producto.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined shrink-0 text-primary">check</span>
                  <div>
                    <p className="font-bold text-white">Auditorías de estrategia semanales</p>
                    <p className="text-sm text-gray-400">Bucles de retroalimentación directa para corregir el rumbo inmediatamente.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined shrink-0 text-primary">check</span>
                  <div>
                    <p className="font-bold text-white">Manuales de estrategias probados</p>
                    <p className="text-sm text-gray-400">Sistemas plug-and-play que han generado millones en ingresos.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined shrink-0 text-primary">check</span>
                  <div>
                    <p className="font-bold text-white">Crecimiento acelerado</p>
                    <p className="text-sm text-gray-400">Olvídate de la curva de aprendizaje. Aprovecha nuestra experiencia para escalar más rápido.</p>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </section>

{/* Application Form Section */}
<section className="relative w-full py-24 flex justify-center items-center bg-background-dark">
    {/* Background decorative elements */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 h-96 w-96 bg-primary/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 h-96 w-96 bg-primary/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
    </div>
    
    <div className="relative z-10 w-full max-w-2xl px-4">
        <div className="glass-card rounded-2xl p-8 sm:p-12 border border-primary/20 shadow-[0_0_50px_-12px_rgba(132,45,180,0.3)]">
            <div className="flex flex-col items-center text-center mb-10">
                {/* Referencia de scroll en el badge */}
                <div ref={BoxDeContacto} className="scroll-mt-24 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-green-400">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Estado de la solicitud: Abierto
                </div>
                <h2 className="text-3xl font-bold text-white sm:text-4xl mt-4">Solicitar un espacio</h2>
                <p className="mt-4 text-gray-400 max-w-md">Este programa es solo por solicitud. Aceptamos 5 socios por trimestre para garantizar el máximo impacto.</p>
            </div>

            {/* Formulario conectado a la función sendEmail */}
            <form ref={form} className="space-y-6" onSubmit={sendEmail}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Nombre</label>
                        <input name="user_name" required className="w-full rounded-lg border border-white/10 bg-surface-darker px-4 py-3 text-white focus:border-primary focus:outline-none" type="text" placeholder="Tu nombre"/>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Correo Electrónico</label>
                        <input name="user_email" required className="w-full rounded-lg border border-white/10 bg-surface-darker px-4 py-3 text-white focus:border-primary focus:outline-none" type="email" placeholder="correo@ejemplo.com"/>
                    </div>
                </div>
                
                {/* NUEVO: Campo de Mensaje Corto */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Mensaje Corto</label>
                    <textarea 
                        name="message" 
                        required 
                        rows={3}
                        className="w-full rounded-lg border border-white/10 bg-surface-darker px-4 py-3 text-white focus:border-primary focus:outline-none resize-none" 
                        placeholder="Cuéntanos brevemente sobre tu proyecto..."
                    ></textarea>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">URL de Web / Red Social</label>
                    <input name="user_url" className="w-full rounded-lg border border-white/10 bg-surface-darker px-4 py-3 text-white focus:border-primary focus:outline-none" type="text" placeholder="https://..."/>
                </div>

                <div className="pt-4">
                    <button className="group flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-4 text-base font-bold text-white transition-all hover:bg-purple-600 shadow-lg shadow-primary/20" type="submit">
                        Enviar Solicitud
                        <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">send</span>
                    </button>
                    <p className="mt-4 text-center text-[10px] text-gray-500 uppercase tracking-widest">
                        Tus datos se enviarán directamente
                    </p>
                </div>
            </form>
        </div>
    </div>
</section>

        </div>
    );
};

export default Consulting;