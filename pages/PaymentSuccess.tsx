
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentSuccess: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const transactionId = searchParams.get('payment_id') || searchParams.get('external_reference') || '';

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'purchase',
            ecommerce: {
                transaction_id: transactionId,
                value: 0, // Placeholder a conectar con valores reales
                currency: 'ARS',
                items: [] // Placeholder a conectar con items reales
            }
        });

        // 1. Notificar a la pestaña principal (Checkout)
        localStorage.setItem('mp_payment_success', Date.now().toString());

        // 2. Si es un popup, intentar cerrarlo
        if (window.opener) {
            window.close();
        } else {
            // 3. O redirigir a mis cursos directamente si no es popup
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
