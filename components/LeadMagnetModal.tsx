import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import emailjs from '@emailjs/browser';
import { FreeResource } from '../data/resources';

interface LeadMagnetModalProps {
    resource: FreeResource | null;
    isOpen: boolean;
    onClose: () => void;
}

const LeadMagnetModal: React.FC<LeadMagnetModalProps> = ({ resource, isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen || !resource) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // 1. Guardar lead en Supabase
            const { error: dbError } = await supabase
                .from('leads')
                .insert([
                    {
                        email,
                        resource_name: resource.title,
                        resource_slug: resource.slug
                    }
                ]);

            if (dbError) throw dbError;

            // 2. Enviar email con EmailJS
            const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
            const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_RECURSOS;
            const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

            if (serviceId && templateId && publicKey) {
                await emailjs.send(
                    serviceId,
                    templateId,
                    {
                        to_email: email,
                        resource_name: resource.title,
                        download_link: resource.downloadUrl,
                        // Puedes añadir más variables según tu template de EmailJS
                    },
                    publicKey
                );
            } else {
                console.warn('EmailJS no está configurado. Revisa las variables de entorno.');
                // No bloqueamos el flujo si falta EmailJS en dev, pero mostramos warn
            }

            // 3. Éxito
            window.dataLayer?.push({
                event: 'form_submission',
                form_name: 'Lead Magnet',
                resource_name: resource.title
            });

            setIsSubmitting(false);
            setIsSuccess(true);
            setTimeout(() => {
                onClose();
                setIsSuccess(false);
                setEmail('');
            }, 3000); // Cerrar después de 3s

            // Opcional: Abrir link directamente también? 
            // window.open(resource.downloadUrl, '_blank');

        } catch (err: any) {
            console.error('Error procesando lead:', err);
            setError(err.message || 'Hubo un error al procesar tu solicitud.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-primary/20 bg-[#0a0a0a] shadow-2xl shadow-primary/10">
                {/* Header Decorativo */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>

                <div className="p-8">
                    {!isSuccess ? (
                        <>
                            <div className="mb-6 text-center">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <span className="material-symbols-outlined text-2xl">rocket_launch</span>
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">¡Estás a un paso!</h2>
                                <p className="text-text-muted text-sm">
                                    Ingresa tu correo para recibir <strong>{resource.title}</strong> directamente en tu bandeja de entrada.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-text-muted uppercase tracking-wider">
                                        Correo Electrónico
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-muted">
                                            <span className="material-symbols-outlined text-[20px]">mail</span>
                                        </div>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="block w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-white placeholder-text-muted focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all sm:text-sm"
                                            placeholder="tu@email.com"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="text-red-400 text-xs bg-red-400/10 p-2 rounded border border-red-400/20">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="relative flex w-full items-center justify-center overflow-hidden rounded-lg bg-primary py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Enviando...
                                        </>
                                    ) : (
                                        'Enviar Recurso Gratuito'
                                    )}
                                </button>

                                <p className="text-center text-[10px] text-text-muted/60 mt-4">
                                    Al suscribirte aceptas recibir contenidos de valor. Cero spam.
                                </p>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-8 animate-fade-in">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                                <span className="material-symbols-outlined text-3xl">check_circle</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">¡Enviado con éxito!</h3>
                            <p className="text-text-muted text-sm">
                                Revisa tu bandeja de entrada. El recurso está en camino.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeadMagnetModal;
