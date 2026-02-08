import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const MPCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<string>('Procesando...');

    useEffect(() => {
        const processCallback = async () => {
            const paymentId = searchParams.get('payment_id');
            const status = searchParams.get('status');
            const externalReference = searchParams.get('external_reference');
            const merchantOrder = searchParams.get('merchant_order_id');

            if (status === 'approved') {
                setStatus('¡Pago Aprobado! Sincronizando...');

                // 1. Notificar a la pestaña principal vía BroadcastChannel
                const channel = new BroadcastChannel('payment_status');
                channel.postMessage({
                    type: 'PAYMENT_COMPLETED',
                    data: {
                        paymentId,
                        status,
                        externalReference,
                        merchantOrder
                    }
                });

                // Dar tiempo al mensaje para ser enviado
                setTimeout(() => {
                    channel.close();
                    // 2. Intentar cerrar la ventana
                    window.close();
                }, 1000);
            } else if (status === 'pending' || status === 'in_process') {
                setStatus('Pago en proceso. Puedes cerrar esta ventana.');
            } else {
                setStatus('Estado del pago: ' + status);
            }
        };

        processCallback();
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-surface-dark border border-white/10 p-8 rounded-2xl shadow-[0_0_50px_rgba(34,211,238,0.2)] max-w-sm w-full">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <h2 className="text-2xl font-bold text-white mb-2">{status}</h2>
                <p className="text-gray-400 mb-6">
                    Tu pago ha sido registrado.
                    Esta ventana debería cerrarse automáticamente.
                </p>

                <button
                    onClick={() => window.close()}
                    className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-300 transition-colors"
                >
                    Cerrar Ventana
                </button>
            </div>
        </div>
    );
};

export default MPCallback;
