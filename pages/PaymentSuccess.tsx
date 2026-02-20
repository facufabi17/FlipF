
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // 1. Notificar a la pestaña principal (Checkout)
        localStorage.setItem('mp_payment_success', Date.now().toString());

        // También podemos usar BroadcastChannel como alternativa más robusta
        const channel = new BroadcastChannel('payment_status_channel');
        channel.postMessage('SUCCESS');
        channel.close();

        // 2. Cerrar si es un popup
        if (window.opener) {
            window.close();
        } else {
            // Si no es popup, redirigir
            navigate('/mis-cursos');
        }
    }, [navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-surface-dark text-white">
            <div className="text-center p-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold mb-2">¡Pago Exitoso!</h1>
                <p className="text-gray-400">Procesando tu compra...</p>
            </div>
        </div>
    );
};

export default PaymentSuccess;
