
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PagoAprobado = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const paymentId = searchParams.get('payment_id');
    const externalReference = searchParams.get('external_reference');
    const status = searchParams.get('status');

    useEffect(() => {
        const channel = new BroadcastChannel('payment_status');
        channel.postMessage({ type: 'PAYMENT_SUCCESS' });
        channel.close();

        // Recuperar datos reales de la compra
        const savedPurchase = sessionStorage.getItem('lastPurchaseData');
        if (savedPurchase) {
            try {
                const purchaseData = JSON.parse(savedPurchase);

                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    event: 'purchase',
                    ecommerce: {
                        transaction_id: paymentId || externalReference || `TR-${Date.now()}`,
                        value: purchaseData.value,
                        currency: 'ARS',
                        items: purchaseData.items
                    }
                });

                // Limpiar para que no se duplique si el usuario recarga la página
                sessionStorage.removeItem('lastPurchaseData');
            } catch (e) {
                console.error("Error parsing purchase data", e);
            }
        }
    }, [paymentId, externalReference]);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="bg-surface-dark border border-primary/20 rounded-2xl p-8 max-w-md w-full text-center shadow-[0_0_50px_rgba(34,211,238,0.1)] animate-fade-in">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-4xl text-green-400">check_circle</span>
                </div>

                <h1 className="text-3xl font-bold text-white mb-2">¡Pago Aprobado!</h1>
                <p className="text-gray-400 mb-6">
                    Tu compra se ha procesado correctamente.
                </p>

                {/* Detalles de la Transacción */}
                {(paymentId || externalReference) && (
                    <div className="bg-black/30 rounded-xl p-4 mb-8 text-sm text-left border border-white/5 space-y-2">
                        {paymentId && (
                            <div className="flex justify-between">
                                <span className="text-gray-500">Operación:</span>
                                <span className="text-white font-mono">{paymentId}</span>
                            </div>
                        )}
                        {externalReference && (
                            <div className="flex justify-between">
                                <span className="text-gray-500">Referencia:</span>
                                <span className="text-white font-mono truncate max-w-[150px]" title={externalReference}>
                                    {externalReference.split('-')[0]}...
                                </span>
                            </div>
                        )}
                        {status && (
                            <div className="flex justify-between">
                                <span className="text-gray-500">Estado:</span>
                                <span className="text-green-400 capitalize">{status}</span>
                            </div>
                        )}
                    </div>
                )}


                <div className="space-y-4">
                    <button
                        onClick={() => navigate('/mis-cursos')}
                        className="w-full py-4 bg-primary hover:bg-primary-dark text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                    >
                        Ir a Mis Cursos
                    </button>

                    <button
                        onClick={() => navigate('/mis-recursos')} // Corregido link recursos pago
                        className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all"
                    >
                        Ver Recursos
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PagoAprobado;
