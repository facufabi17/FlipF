import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { COURSES } from '../data/courses';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

// Inicializa con tu PUBLIC KEY (No la Private/Access Token)
initMercadoPago('APP_USR-b6fc115a-edde-4282-a4b2-59276ccbaf6a');

interface CheckoutProps {
    onShowToast: (text: string, type?: 'success' | 'error') => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onShowToast }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { cart, total, removeFromCart } = useCart();

    const [preferenceId, setPreferenceId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const directCourse = id ? COURSES.find(c => c.id === id) : null;
    const finalTotal = directCourse ? directCourse.price : total;

    useEffect(() => {
        if (!isAuthenticated) navigate('/login');
    }, [isAuthenticated, navigate]);

    // Función para crear la preferencia apenas carga la página o cambia el carrito
    useEffect(() => {
        const createPreference = async () => {
            if (!id && cart.length === 0) return;
            
            setIsLoading(true);
            try {
                const itemsToPay = directCourse 
                    ? [{ title: directCourse.title, quantity: 1, price: directCourse.price }]
                    : cart.map(item => ({
                        title: item.title,
                        quantity: 1,
                        price: item.price
                    }));

                const response = await fetch("/api/create-preference", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ items: itemsToPay }),
                });

                const data = await response.json();
                if (data.preference_id) {
                    setPreferenceId(data.preference_id);
                }
            } catch (error) {
                console.error("Error al crear preferencia:", error);
                onShowToast('Error al conectar con la pasarela de pago', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        createPreference();
    }, [cart, directCourse, id]);

    if (!isAuthenticated) return null;

    return (
        <div className="animate-fade-in min-h-screen">
            <section className="p-6 lg:p-12 max-w-6xl mx-auto min-h-[80vh] flex items-center">
                <div className="w-full">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-muted hover:text-white mb-8">
                        <span className="material-symbols-outlined">arrow_back</span> Cancelar
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Resumen de Compra (Mismo que tenías) */}
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-white">Resumen del Pedido</h2>
                            <div className="bg-surface-dark border border-white/5 rounded-2xl overflow-hidden p-6">
                                <div className="space-y-4 mb-6">
                                    {directCourse ? (
                                        <div className="flex gap-4 items-center">
                                            <img src={directCourse.image} className="w-16 h-16 rounded-lg object-cover" alt="" />
                                            <div>
                                                <h3 className="font-bold text-white">{directCourse.title}</h3>
                                                <p className="text-primary font-bold">${directCourse.price.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        cart.map((item) => (
                                            <div key={item.id} className="flex gap-4 items-center">
                                                <img src={item.image} className="w-16 h-16 rounded-lg object-cover" alt="" />
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-white text-sm">{item.title}</h3>
                                                    <p className="text-primary font-bold">${item.price.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="border-t border-white/5 pt-4 flex justify-between items-center">
                                    <span className="text-gray-300">Total a Pagar</span>
                                    <span className="text-3xl font-bold text-white">${finalTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Contenedor del Botón Wallet */}
                        <div className="bg-surface-dark p-8 rounded-2xl border border-white/5 shadow-2xl flex flex-col justify-center items-center text-center">
                            <span className="material-symbols-outlined text-6xl text-primary mb-4">account_balance_wallet</span>
                            <h3 className="text-xl font-bold text-white mb-2">Finalizar Pago</h3>
                            <p className="text-gray-400 mb-8 text-sm">
                                Serás redirigido de forma segura a Mercado Pago para completar tu transacción.
                            </p>

                            <div className="w-full min-h-[70px]">
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2 text-white">
                                        <span className="material-symbols-outlined animate-spin">sync</span>
                                        Cargando métodos de pago...
                                    </div>
                                ) : (
                                    preferenceId && (
                                        <Wallet 
    initialization={{ preferenceId: preferenceId! }} 
    customization={{ 
        texts: { 
            valueProp: 'smart_option' 
        } 
    } as any} // <-- Agregamos "as any" aquí
/>
                                    )
                                )}
                            </div>

                            <p className="mt-6 text-xs text-gray-500">
                                <span className="material-symbols-outlined text-xs inline-block align-middle mr-1">shield</span>
                                Tu información financiera está protegida por Mercado Pago.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Checkout;
