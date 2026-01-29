import React from 'react';
import { CONTACT_INFO } from '../info';

const Help: React.FC = () => {
    return (
        <div className="animate-fade-in">
            <section className="relative flex min-h-[85vh] w-full items-center justify-center overflow-hidden py-20">
                <div className="absolute inset-0 z-0">
                    <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-tech/10 blur-[100px]"></div>
                </div>

                <div className="relative z-10 w-full max-w-3xl px-6 text-center">
                    <div className="mb-10">
                        <div className="inline-flex items-center justify-center size-20 rounded-full bg-primary/20 mb-6 border border-primary/30">
                            <span className="material-symbols-outlined text-4xl text-primary">support_agent</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Centro de Ayuda</h1>
                        <p className="text-xl text-gray-400 max-w-xl mx-auto">
                            ¿Tienes problemas con un curso, una descarga o tu cuenta? Estamos aquí para solucionarlo rápidamente.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Email Support */}
                        <div className="glass-card p-8 rounded-2xl border border-white/10 hover:border-primary/50 transition-all group">
                            <span className="material-symbols-outlined text-4xl text-gray-300 group-hover:text-primary mb-4 transition-colors">mail</span>
                            <h3 className="text-2xl font-bold text-white mb-2">Soporte por Email</h3>
                            <p className="text-gray-400 mb-6">Para consultas detalladas, facturación o problemas técnicos.</p>
                            <a
                                href={`mailto:${CONTACT_INFO.email}`}
                                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-white/5 border border-white/10 text-white font-bold hover:bg-primary hover:border-primary transition-all"
                            >
                                {CONTACT_INFO.email}
                            </a>
                        </div>

                        {/* WhatsApp Support */}
                        <div className="glass-card p-8 rounded-2xl border border-white/10 hover:border-green-500/50 transition-all group">
                            <span className="material-symbols-outlined text-4xl text-gray-300 group-hover:text-green-500 mb-4 transition-colors">chat</span>
                            <h3 className="text-2xl font-bold text-white mb-2">WhatsApp Directo</h3>
                            <p className="text-gray-400 mb-6">Atención rápida de Lunes a Viernes de 9hs a 18hs.</p>
                            <a
                                href={`${CONTACT_INFO.whatsapp}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 font-bold hover:bg-green-500 hover:text-black transition-all"
                            >
                                <span className="material-symbols-outlined text-lg">send</span>
                                Chatear Ahora
                            </a>
                        </div>
                    </div>

                    <div className="mt-12 bg-surface-dark rounded-xl p-6 border border-white/5">
                        <p className="text-sm text-gray-500">
                            Tiempo de respuesta promedio: <strong className="text-white">Menos de 2 horas</strong> en horario laboral.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Help;