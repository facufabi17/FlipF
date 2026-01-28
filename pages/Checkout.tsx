import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { COURSES } from '../data/courses';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

// Inicializa con tu PUBLIC KEY (No la Private/Access Token)
// Asegúrate de definir VITE_MP_PUBLIC_KEY en tu archivo .env.local
const publicKey = import.meta.env.VITE_MP_PUBLIC_KEY;
console.log("Mercado Pago PK Status:", publicKey ? "Presente" : "Faltante", publicKey?.substring(0, 10) + "...");

if (publicKey) {
    initMercadoPago(publicKey);
} else {
    console.error("VITE_MP_PUBLIC_KEY no está definida.");
}

interface CheckoutProps {
    onShowToast: (text: string, type?: 'success' | 'error') => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onShowToast }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const { cart, total, removeFromCart, getCheckoutItems, activeCoupon, applyCoupon, removeCoupon, discount, totalAfterDiscount } = useCart();

    const [preferenceId, setPreferenceId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [couponInput, setCouponInput] = useState('');
    const [preferenceUrl, setPreferenceUrl] = useState<string | null>(null);
    const [isWaitingForPayment, setIsWaitingForPayment] = useState(false);
    const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

    const directCourse = id ? COURSES.find(c => c.id === id) : null;
    const finalTotal = directCourse ? directCourse.price : totalAfterDiscount;

    useEffect(() => {
        if (!isAuthenticated) navigate('/login');
    }, [isAuthenticated, navigate]);

    // Función para crear la preferencia (se re-crea al cambiar carrito o cupón)
    const createPreference = async (itemsOverride?: any[]) => {
        if (!id && cart.length === 0) return;

        setIsLoading(true);
        setPreferenceId(null); // oculta el contenido hasta que llegue la preferencia
        try {
            const itemsToPay = itemsOverride ?? (directCourse
                ? [{ title: directCourse.title, quantity: 1, price: directCourse.price }]
                : getCheckoutItems());

            const response = await fetch("/api/create-preference", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: itemsToPay,
                    userId: user?.id
                }),
            });

            const data = await response.json();
            console.log("Preference Response:", data);

            if (!response.ok) {
                throw new Error(data.error || "Error en respuesta del servidor");
            }

            if (data.preference_id) {
                setPreferenceId(data.preference_id);
            } else {
                console.error("No preference ID returned:", data);
                onShowToast('Error: No se recibió ID de preferencia', 'error');
            }

            if (data.preference_url) setPreferenceUrl(data.preference_url);
            if (data.init_point && !data.preference_url) setPreferenceUrl(data.init_point);
        } catch (error: any) {
            console.error("Error al crear preferencia:", error);
            onShowToast(`Error de conexión: ${error.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        createPreference();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cart, directCourse, id, activeCoupon]);

    useEffect(() => {
        const checkStatusParam = () => {
            try {
                const s = window.location.search || '';
                const h = window.location.hash || '';
                if (s.includes('status=approved') || h.includes('status=approved')) {
                    setIsPaymentSuccess(true);
                    setIsWaitingForPayment(false);
                }
            } catch (e) {
                // noop
            }
        };

        checkStatusParam();
        window.addEventListener('focus', checkStatusParam);
        return () => window.removeEventListener('focus', checkStatusParam);
    }, []);

    if (!isAuthenticated) return null;

    // Si detectamos éxito en la URL mostrar pantalla final
    if (isPaymentSuccess) {
        return (
            <div className="min-h-screen p-6 lg:p-12 max-w-4xl mx-auto flex items-center">
                <div className="w-full bg-surface-dark p-8 rounded-2xl text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">¡Felicitaciones por tu compra!</h2>
                    <p className="text-gray-300 mb-4">Tus cursos te esperan en <strong>Mis Cursos</strong> y los recursos descargables en <strong>Mis Recursos</strong>.</p>
                    <p className="text-gray-400 text-sm">Si todo está correcto, serás dirigido automáticamente. Si no, revisa tu correo o contacta soporte.</p>
                    <div className="mt-6">
                        <button onClick={() => navigate('/my-courses')} className="px-4 py-2 bg-primary text-black rounded font-semibold">Ir a Mis Cursos</button>
                    </div>
                </div>
            </div>
        );
    }

    // Mientras esperamos la preferencia o se está cargando, mostramos skeleton
    if (!preferenceId || isLoading) {
        return (
            <div className="min-h-screen p-6 lg:p-12 max-w-6xl mx-auto">
                <div className="animate-pulse">
                    <div className="h-6 w-48 bg-gray-700 rounded mb-6"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="h-8 bg-gray-700 rounded"></div>
                            <div className="h-40 bg-gray-800 rounded"></div>
                            <div className="h-10 bg-gray-700 rounded"></div>
                        </div>
                        <div className="space-y-4">
                            <div className="h-8 bg-gray-700 rounded"></div>
                            <div className="h-64 bg-gray-800 rounded"></div>
                            <div className="h-[70px] bg-gray-700 rounded mt-4"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in min-h-screen">
            <section className="p-6 lg:p-12 max-w-6xl mx-auto min-h-[80vh] flex items-center">
                <div className="w-full">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-muted hover:text-white mb-8">
                        <span className="material-symbols-outlined">arrow_back</span> Cancelar
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {isWaitingForPayment ? (
                            <div className="col-span-1 lg:col-span-2">
                                <div className="bg-surface-dark p-12 rounded-2xl text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center">
                                            <span className="material-symbols-outlined animate-spin">autorenew</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white">Esperando confirmación de pago...</h3>
                                        <p className="text-gray-300">Hemos abierto Mercado Pago en una nueva pestaña. Cuando finalices, vuelve aquí o presiona verificar.</p>
                                        <div className="mt-6 flex gap-2">
                                            <button onClick={() => {
                                                // verificar estado nuevamente en la URL
                                                const s = window.location.search || '';
                                                const h = window.location.hash || '';
                                                if (s.includes('status=approved') || h.includes('status=approved')) {
                                                    setIsPaymentSuccess(true);
                                                    setIsWaitingForPayment(false);
                                                } else {
                                                    onShowToast('Aún no hay confirmación. Si completaste el pago, espera unos segundos y vuelve a intentar.', 'error');
                                                }
                                            }} className="px-4 py-2 bg-primary rounded text-black font-semibold">Verificar estado</button>
                                            <button onClick={() => setIsWaitingForPayment(false)} className="px-4 py-2 border rounded text-white">Cancelar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                        {/* Resumen dividido */}
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-white">Resumen del Pedido</h2>

                            <div className="bg-surface-dark border border-white/5 rounded-2xl overflow-hidden p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Cursos</h3>
                                <div className="space-y-4 mb-6">
                                    {directCourse ? (
                                        directCourse.category && (
                                            <div className="flex gap-4 items-center">
                                                <img src={directCourse.image} className="w-16 h-16 rounded-lg object-cover" alt="" />
                                                <div>
                                                    <h3 className="font-bold text-white">{directCourse.title}</h3>
                                                    <p className="text-primary font-bold">${directCourse.price.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        )
                                    ) : (
                                        cart.filter(i => i.type === 'course').map((item) => (
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

                                <h3 className="text-lg font-semibold text-white mb-4">Recursos Digitales</h3>
                                <div className="space-y-4 mb-6">
                                    {cart.filter(i => i.type === 'resource').map((item) => (
                                        <div key={item.id} className="flex gap-4 items-center">
                                            <img src={item.image} className="w-16 h-16 rounded-lg object-cover" alt="" />
                                            <div className="flex-1">
                                                <h3 className="font-bold text-white text-sm">{item.title}</h3>
                                                <p className="text-primary font-bold">${item.price.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-white/5 pt-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-300">Subtotal</span>
                                        <span className="text-white font-medium">${total.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-300">Descuento</span>
                                        <span className="text-primary font-medium">-${discount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">Total a Pagar</span>
                                        <span className="text-3xl font-extrabold text-white">${finalTotal.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contenedor del Botón Wallet y cupón */}
                        <div className="bg-surface-dark p-8 rounded-2xl border border-white/5 shadow-2xl flex flex-col justify-center items-center text-center">
                            <span className="material-symbols-outlined text-6xl text-primary mb-4">account_balance_wallet</span>
                            <h3 className="text-xl font-bold text-white mb-2">Finalizar Pago</h3>
                            <p className="text-gray-400 mb-4 text-sm">Serás redirigido de forma segura a Mercado Pago para completar tu transacción.</p>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="px-3 py-1 bg-green-700/20 text-green-300 rounded-full text-xs font-medium">Pago Seguro SSL</div>
                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                    <svg width="36" height="20" viewBox="0 0 36 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="36" height="20" rx="4" fill="#00AEE9" />

                                        <path
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M18 5.5C16.9 5.5 16 6.4 16 7.5V9H15C14.4 9 14 9.4 14 10V14C14 14.6 14.4 15 15 15H21C21.6 15 22 14.6 22 14V10C22 9.4 21.6 9 21 9H20V7.5C20 6.4 19.1 5.5 18 5.5ZM17.5 7.5C17.5 7.2 17.7 7 18 7C18.3 7 18.5 7.2 18.5 7.5V9H17.5V7.5ZM18 11.5C18.3 11.5 18.5 11.7 18.5 12C18.5 12.3 18.3 12.5 18 12.5C17.7 12.5 17.5 12.3 17.5 12C17.5 11.7 17.7 11.5 18 11.5Z"
                                            fill="white"
                                        />
                                    </svg>
                                    <span className="text-gray-300">Mercado Pago</span>
                                </div>
                            </div>

                            <div className="w-full mb-4">
                                <div className="flex gap-2">
                                    <input value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="Código de cupón" className="flex-1 px-4 py-2 rounded bg-transparent border border-white/10 text-white" />
                                    <button onClick={async () => {
                                        if (!couponInput) return;
                                        const ok = applyCoupon(couponInput);
                                        if (!ok) {
                                            onShowToast('Cupón inválido', 'error');
                                            return;
                                        }
                                        onShowToast('Cupón aplicado', 'success');
                                        // recrear preferencia con precios ajustados
                                        await createPreference();
                                    }} className="px-4 py-2 bg-primary rounded text-black font-semibold">Aplicar</button>
                                </div>
                                {activeCoupon && (
                                    <div className="flex justify-between items-center text-sm text-gray-300 mt-2">
                                        <span>Cupon activo: {activeCoupon.code}</span>
                                        <button onClick={async () => { removeCoupon(); setCouponInput(''); await createPreference(); }} className="text-primary underline">Quitar</button>
                                    </div>
                                )}
                            </div>

                            <div className="w-full min-h-[70px]">
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2 text-white">
                                        <span className="material-symbols-outlined animate-spin">sync</span>
                                        Cargando métodos de pago...
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        {/* SDK Wallet: prevenir duplicados con key y mostrar opción integrada */}
                                        {preferenceId && (
                                            <div className="w-full h-full items-center justify-center gap-3 px-4 py-3 bg-[#00bcff] hover:bg-[#00bcff] rounded-xl shadow-lg ">
                                                <Wallet key={preferenceId} initialization={{ preferenceId: preferenceId! }} customization={{ texts: { valueProp: 'smart_option ' } } as any} />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 w-full text-left">
                                <div className="bg-gray-900/30 p-4 rounded">
                                    <h4 className="text-white font-semibold">Garantía de satisfacción</h4>
                                    <p className="text-gray-400 text-sm">Si no quedas satisfecho con tu compra, contáctanos en los primeros 7 días y te ayudaremos.</p>
                                </div>
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