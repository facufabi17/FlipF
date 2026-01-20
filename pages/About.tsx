import React from 'react';

const About: React.FC = () => {
    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-[#1b131f] py-16 px-4 md:py-24">
                <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#842db4 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="absolute top-0 right-1/2 translate-x-1/2 w-3/4 h-64 bg-primary/20 blur-[100px] -z-10 rounded-full pointer-events-none"></div>
                
                <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
                    <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-tech backdrop-blur-sm">
                        <span className="material-symbols-outlined mr-1 text-[16px]">domain</span> Nuestra Esencia
                    </div>
                    <h1 className="font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl text-white">
                        Sobre <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Nosotros</span>
                    </h1>
                    <p className="max-w-2xl text-lg text-[#b39ac1]">
                        Somos una agencia de marketing digital enfocada en ayudar a nuestros clientes a expandir su presencia en línea mediante estrategias de marketing digital, comunicación e ecommerce.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 pb-20">
                {/* Intro Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
                    <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                        <p>
                            Trabajamos con cada uno de nuestros clientes para comprender sus necesidades y objetivos únicos, y creamos soluciones personalizadas para ayudarles a lograr sus metas. Damos múltiples servicios digitales como creación de páginas web (Landing pages, tiendas online o aula virtual), gestión y creación de contenido para redes sociales, publicidad en línea o email marketing.
                        </p>
                        <p>
                            Ofrecemos una amplia gama de servicios de marketing digital para ayudar a nuestros clientes a llegar a su público objetivo y aumentar su base de clientes potenciales. Además, nos mantenemos actualizados con las últimas tendencias y tecnologías para garantizar que nuestros clientes estén siempre un paso adelante de la competencia.
                        </p>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent rounded-2xl blur-lg opacity-30"></div>
                        <div className="relative glass-card p-8 rounded-2xl border border-white/10">
                            <h3 className="text-2xl font-bold text-white mb-4">Nuestro Enfoque</h3>
                            <p className="text-gray-400">
                                En resumen, nuestra agencia de marketing digital se enfoca en ayudar a nuestros clientes a crecer y expandir su presencia en línea de manera efectiva y sostenible.
                            </p>
                            <div className="mt-6 flex gap-4">
                                <div className="flex flex-col items-center p-4 bg-surface-dark rounded-xl border border-white/5 w-1/3">
                                    <span className="material-symbols-outlined text-tech text-3xl mb-2">rocket_launch</span>
                                    <span className="text-xs text-center font-bold text-white">Crecimiento</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-surface-dark rounded-xl border border-white/5 w-1/3">
                                    <span className="material-symbols-outlined text-primary text-3xl mb-2">psychology</span>
                                    <span className="text-xs text-center font-bold text-white">Estrategia</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-surface-dark rounded-xl border border-white/5 w-1/3">
                                    <span className="material-symbols-outlined text-accent text-3xl mb-2">monitoring</span>
                                    <span className="text-xs text-center font-bold text-white">Resultados</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Misión & Visión */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    <div className="glass-card p-8 rounded-2xl border-l-4 border-primary hover:translate-y-[-5px] transition-transform duration-300">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="material-symbols-outlined text-primary text-3xl">flag</span>
                            <h2 className="text-2xl font-bold text-white">Misión</h2>
                        </div>
                        <p className="text-gray-300">
                            La misión de Flip Manager es impulsar a las personas y empresas para poder alcanzar su máximo potencial.
                        </p>
                    </div>
                    <div className="glass-card p-8 rounded-2xl border-l-4 border-accent hover:translate-y-[-5px] transition-transform duration-300">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="material-symbols-outlined text-accent text-3xl">visibility</span>
                            <h2 className="text-2xl font-bold text-white">Visión</h2>
                        </div>
                        <p className="text-gray-300">
                            Llegar a ser una de las mejores empresas de marketing digital de todo NEA.
                        </p>
                    </div>
                </div>

                {/* Objetivos */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">Nuestros Objetivos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-surface-dark p-8 rounded-2xl border border-white/5">
                            <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined">person_pin_circle</span> Interno
                            </h3>
                            <p className="text-gray-400">
                                El objetivo de esta empresa es liderar en la industria de marketing provincial y ser reconocida por sus asociaciones estratégicas con otros sectores.
                            </p>
                        </div>
                        <div className="bg-surface-dark p-8 rounded-2xl border border-white/5">
                            <h3 className="text-xl font-bold text-accent mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined">public</span> Externo
                            </h3>
                            <p className="text-gray-400">
                                Nuestro principal objetivo es trabajar codo a codo con nuestros clientes para incrementar su reconocimiento y darle valor agregado.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Grid Final: Fin, Estrategia, Táctica, Políticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Fin */}
                    <div className="bg-surface-darker p-6 rounded-xl border border-white/5 hover:border-tech/50 transition-colors">
                        <h3 className="text-lg font-bold text-white mb-3 text-tech">El Fin</h3>
                        <p className="text-sm text-gray-400 mb-2"><strong className="text-white">Lucrativo:</strong> Capitalización del valor agregado para generar un buen retorno de inversión para socios.</p>
                        <p className="text-sm text-gray-400"><strong className="text-white">Social:</strong> Explotar al máximo el potencial de las personas y/o empresas para llevarlas al siguiente nivel.</p>
                    </div>

                    {/* Estrategia */}
                    <div className="bg-surface-darker p-6 rounded-xl border border-white/5 hover:border-primary/50 transition-colors">
                        <h3 className="text-lg font-bold text-white mb-3 text-primary">Estrategia</h3>
                        <ul className="text-sm text-gray-400 space-y-2">
                            <li className="flex gap-2"><span className="text-primary">•</span> Continuas capacitaciones</li>
                            <li className="flex gap-2"><span className="text-primary">•</span> Innovación a los clientes</li>
                            <li className="flex gap-2"><span className="text-primary">•</span> Soluciones rápidas</li>
                            <li className="flex gap-2"><span className="text-primary">•</span> Automatizar acciones</li>
                            <li className="flex gap-2"><span className="text-primary">•</span> Mejora continua</li>
                        </ul>
                    </div>

                    {/* Táctica */}
                    <div className="bg-surface-darker p-6 rounded-xl border border-white/5 hover:border-accent/50 transition-colors">
                        <h3 className="text-lg font-bold text-white mb-3 text-accent">Táctica</h3>
                        <p className="text-sm text-gray-400">
                            Esquema específico para emplear algunos recursos en una estrategia general, asegurando la ejecución precisa de cada paso.
                        </p>
                    </div>

                    {/* Políticas */}
                    <div className="bg-surface-darker p-6 rounded-xl border border-white/5 hover:border-white/50 transition-colors">
                        <h3 className="text-lg font-bold text-white mb-3 text-white">Políticas</h3>
                        <div className="flex flex-col items-center justify-center h-full pb-6">
                            <span className="material-symbols-outlined text-4xl text-gray-500 mb-2">handshake</span>
                            <p className="text-sm text-gray-400 text-center">
                                Nuestra política se basa en la <strong className="text-white">honestidad</strong> y <strong className="text-white">claridad</strong> hacia el cliente.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;