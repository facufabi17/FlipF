import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { COURSES } from '../data/courses';
import { initMercadoPago } from '@mercadopago/sdk-react';

// Inicializar Mercado Pago
initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, {
    locale: 'es-AR'
});

interface CheckoutProps {
    onShowToast: (text: string, type?: 'success' | 'error') => void;
}

const STEPS = [
    { number: 1, label: 'Carrito' },
    { number: 2, label: 'Información' },
    { number: 3, label: 'Pago' }
];

const Checkout: React.FC<CheckoutProps> = ({ onShowToast }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated, user, updateProfile, purchaseItems, loading } = useAuth();
    const { cart, total, removeFromCart, clearCart, getCheckoutItems, activeCoupon, applyCoupon, removeCoupon, discount, totalAfterDiscount } = useCart();

    // Estado del Stepper
    const [currentStep, setCurrentStep] = useState(1);

    // Estado del Formulario
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        dni: '',
        address: '',
        zipCode: ''
    });

    // Estado de Pago
    const [paymentMethod, setPaymentMethod] = useState<'transferencia' | 'mercadopago' | 'mobbex' | 'prueba' | null>(null);
    const [couponInput, setCouponInput] = useState('');
    const [preferenceId, setPreferenceId] = useState<string | null>(null);
    const [loadingMP, setLoadingMP] = useState(false);

    // Estados para Pago Externo (Polling)
    const [isWaitingPayment, setIsWaitingPayment] = useState(false);
    const [externalPaymentId, setExternalPaymentId] = useState<string | null>(null);

    const directCourse = id ? COURSES.find(c => c.id === id) : null;
    const finalTotal = directCourse ? directCourse.price : totalAfterDiscount;
    const itemsToShow = directCourse
        ? [{ ...directCourse, type: 'course', quantity: 1 }] // Mock item wrapper
        : cart;

    const courses = itemsToShow.filter(i => i.type === 'course');
    const resources = itemsToShow.filter(i => i.type === 'resource');
    const isEmpty = !directCourse && cart.length === 0;

    useEffect(() => {
        if (paymentMethod === 'mercadopago' && !preferenceId) {
            setLoadingMP(true);

            const itemsToPurchase = directCourse
                ? [{ id: directCourse.id, title: directCourse.title, price: directCourse.price, quantity: 1 }]
                : cart.map(item => ({ id: item.id, title: item.title, price: item.price, quantity: 1 }));

            fetch('/api/create-preference', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: itemsToPurchase,
                    baseUrl: window.location.origin
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.id) setPreferenceId(data.id);
                })
                .catch(err => {
                    console.error("Error creating preference", err);
                    onShowToast("Error al inicializar pago", "error");
                })
                .finally(() => setLoadingMP(false));
        }
    }, [paymentMethod, preferenceId, directCourse, cart, onShowToast]);

    // Scroll top al cambiar de paso
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentStep]);

    // Cargar datos de usuario
    useEffect(() => {
        // Solo redirigir si YA terminÃ³ de cargar y NO estÃ¡ autenticado
        if (!loading && !isAuthenticated) {
            navigate('/login');
            return;
        }

        if (isAuthenticated && user) {
            setFormData(prev => ({
                ...prev,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                dni: user.dni || ''
            }));
        }
    }, [isAuthenticated, user, navigate, loading]);


    // Restaurar estado de persistencia al montar
    useEffect(() => {
        const storedPaymentId = sessionStorage.getItem('pendingPaymentId');
        const storedIsWaiting = sessionStorage.getItem('isPaymentInProgress');
        const storedTimestamp = sessionStorage.getItem('paymentTimestamp');

        if (storedPaymentId && storedIsWaiting === 'true' && storedTimestamp) {
            const now = Date.now();
            const timestamp = parseInt(storedTimestamp, 10);
            const oneHour = 60 * 60 * 1000;

            if (now - timestamp < oneHour) {
                setExternalPaymentId(storedPaymentId);
                setIsWaitingPayment(true);
                onShowToast('Restaurando sesión de pago...', 'success');
            } else {
                // Limpiar si es muy viejo
                sessionStorage.removeItem('pendingPaymentId');
                sessionStorage.removeItem('isPaymentInProgress');
                sessionStorage.removeItem('paymentTimestamp');
            }
        }
    }, [onShowToast]);

    // Polling optimizado con Visibility API
    useEffect(() => {
        let interval: NodeJS.Timeout;

        const checkStatus = async () => {
            if (!externalPaymentId) return;

            try {
                const res = await fetch(`/api/check-payment-status?payment_id=${externalPaymentId}`);
                const data = await res.json();

                console.log("Polling payment status:", data.status);

                if (data.status === 'approved') {
                    // Limpiar persistencia
                    sessionStorage.removeItem('pendingPaymentId');
                    sessionStorage.removeItem('isPaymentInProgress');
                    sessionStorage.removeItem('paymentTimestamp');

                    clearInterval(interval);
                    setIsWaitingPayment(false);

                    // Compra exitosa
                    const itemsToPurchase = directCourse
                        ? [{ id: directCourse.id, type: 'course' as const }]
                        : cart.map(item => ({ id: item.id, type: item.type }));

                    await purchaseItems(itemsToPurchase);

                    if (!directCourse) {
                        clearCart();
                        if (activeCoupon) removeCoupon();
                    }

                    navigate('/pago_apro');
                    onShowToast('¡Pago exitoso!', 'success');
                } else if (data.status === 'rejected') {
                    // Limpiar persistencia
                    sessionStorage.removeItem('pendingPaymentId');
                    sessionStorage.removeItem('isPaymentInProgress');
                    sessionStorage.removeItem('paymentTimestamp');

                    clearInterval(interval);
                    setIsWaitingPayment(false);
                    onShowToast('El pago fue rechazado. Intenta nuevamente.', 'error');
                }
            } catch (error) {
                console.error("Error polling payment status:", error);
            }
        };

        if (isWaitingPayment && externalPaymentId) {
            // Check inmediato al activar
            checkStatus();

            // Intervalo regular
            interval = setInterval(checkStatus, 3000);

            // Listener de visibilidad para check inmediato al volver
            const handleVisibilityChange = () => {
                if (document.visibilityState === 'visible') {
                    console.log("Tab visible, checking status immediately...");
                    checkStatus();
                }
            };

            document.addEventListener("visibilitychange", handleVisibilityChange);

            return () => {
                clearInterval(interval);
                document.removeEventListener("visibilitychange", handleVisibilityChange);
            };
        }
    }, [isWaitingPayment, externalPaymentId, directCourse, cart, navigate, purchaseItems, clearCart, activeCoupon, onShowToast]);

    // Handlers
    // Ref para el contenedor del brick
    const brickContainerRef = React.useRef<HTMLDivElement>(null);

    // Inicializar Brick con Vanilla JS SDK
    useEffect(() => {
        if (paymentMethod === 'mercadopago' && preferenceId && brickContainerRef.current) {
            // Limpiar controller previo si existe
            if (window.paymentBrickController) {
                window.paymentBrickController.unmount();
                window.paymentBrickController = null;
            }

            setLoadingMP(true);

            const mp = new window.MercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, {
                locale: 'es-AR'
            });

            const bricksBuilder = mp.bricks();

            const renderBrick = async () => {
                const settings = {
                    initialization: {
                        amount: Math.round(finalTotal),
                        preferenceId: preferenceId,
                        payer: {
                            firstName: formData.firstName,
                            lastName: formData.lastName,
                            email: formData.email,
                        },
                    },
                    customization: {
                        paymentMethods: {
                            ticket: "all",
                            bankTransfer: "all",
                            creditCard: "all",
                            debitCard: "all",
                            mercadoPago: "all",
                        },
                        visual: {
                            style: {
                                theme: 'default',
                            },
                            hidePaymentButton: true,
                        }
                    },
                    callbacks: {
                        onReady: () => {
                            setLoadingMP(false);
                            console.log("Brick ready");
                        },
                        onError: (error: any) => {
                            console.error("Brick Error:", error);
                            setLoadingMP(false);
                            onShowToast("Error al cargar el formulario de pago", "error");
                        },
                    },
                };

                try {
                    const controller = await bricksBuilder.create('payment', 'paymentBrick_container', settings);
                    window.paymentBrickController = controller;
                } catch (e) {
                    console.error("Error creating brick", e);
                }
            };

            renderBrick();
        }

        return () => {
            if (window.paymentBrickController) {
                window.paymentBrickController.unmount();
                window.paymentBrickController = null;
            }
        };
    }, [paymentMethod, preferenceId, finalTotal, formData, brickContainerRef]);

    const processMercadoPagoPayment = async () => {
        if (!window.paymentBrickController) return;

        try {
            onShowToast('Procesando pago...', 'success');

            // 1. Obtener datos del formulario del Brick (Esto valida los campos)
            const result = await window.paymentBrickController.getFormData()
                .catch((error: any) => {
                    // Capturamos error de validación del Brick (ej: campos vacíos)
                    console.warn("Brick Validation Error:", error);
                    return null;
                });

            // Si falla la validación o no hay datos, cortamos aquí
            if (!result || !result.formData) {
                onShowToast('Por favor revisá los datos del formulario.', 'error');
                return;
            }

            const { formData } = result;
            console.log("Pago Brick Data:", formData);

            // 2. Enviar a nuestro backend
            const response = await fetch("/api/process-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const paymentResult = await response.json();

            if (paymentResult.error) {
                console.error("Payment Error:", paymentResult);
                onShowToast('Error al procesar el pago: ' + (paymentResult.details?.message || paymentResult.error), 'error');
                return;
            }

            console.log("Payment Success Result:", paymentResult);

            // 3. Manejar Resultado
            if (paymentResult.status === 'approved') {
                // Pago Aprobado Inmediato (Tarjeta exitosa o Dinero en cuenta inmediato)
                const itemsToPurchase = directCourse
                    ? [{ id: directCourse.id, type: 'course' as const }]
                    : cart.map(item => ({ id: item.id, type: item.type }));

                await purchaseItems(itemsToPurchase);

                if (!directCourse) {
                    clearCart();
                    if (activeCoupon) removeCoupon();
                }

                navigate('/pago_apro');
                onShowToast('¡Pago exitoso!', 'success');

            } else if (paymentResult.status === 'in_process' || paymentResult.status === 'pending') {
                // Pago Pendiente / Externo (Wallet, Rapipago, etc.)

                // Si es Wallet o similar, MP devuelve point_of_interaction.
                if (paymentResult.point_of_interaction?.type === 'redirect') {
                    // Abrir link en nueva pestaña si viene data
                    if (paymentResult.point_of_interaction.transaction_data?.ticket_url) {
                        window.open(paymentResult.point_of_interaction.transaction_data.ticket_url, '_blank');
                    }
                }

                // Activar Polling y Overlay con Persistencia
                const paymentIdStr = paymentResult.id.toString();
                setExternalPaymentId(paymentIdStr);
                setIsWaitingPayment(true);

                // Guardar en SessionStorage
                sessionStorage.setItem('pendingPaymentId', paymentIdStr);
                sessionStorage.setItem('isPaymentInProgress', 'true');
                sessionStorage.setItem('paymentTimestamp', Date.now().toString());

            } else {
                onShowToast('Pago ' + paymentResult.status, 'error');
            }

        } catch (error) {
            console.error("Network Error:", error);
            onShowToast('Error de conexión al procesar el pago', 'error');
        }
    };

    const handleNext = async () => {
        if (currentStep === 1) {
            // Validar carrito no vacÃ­o
            if (isEmpty) {
                onShowToast('El carrito estÃ¡ vacÃ­o', 'error');
                return;
            }
            setCurrentStep(2);
        } else if (currentStep === 2) {
            // Validar campos obligatorios
            if (!formData.firstName || !formData.lastName || !formData.email || !formData.dni || !formData.address || !formData.zipCode) {
                onShowToast('Por favor completa todos los campos obligatorios', 'error');
                return;
            }
            // Si el DNI es nuevo (no estaba en user.dni), se guardarÃ¡ al finalizar o aquÃ­ mismo?
            // El requerimiento dice: "DNI debe ser solo lectura si ya existe".
            // PodrÃ­amos intentar guardarlo ahora si es nuevo para asegurar persistencia antes del pago.
            if (user && !user.dni && formData.dni) {
                try {
                    await updateProfile({ dni: formData.dni });
                } catch (e) {
                    console.error("Error guardando DNI", e);
                    // No bloqueamos, pero avisamos? O seguimos.
                }
            }
            setCurrentStep(3);
        } else if (currentStep === 3) {
            if (!paymentMethod) {
                onShowToast('Selecciona un mÃ©todo de pago', 'error');
                return;
            }

            if (paymentMethod === 'prueba') {
                try {
                    // 1. Preparar items para la compra
                    const itemsToPurchase = directCourse
                        ? [{ id: directCourse.id, type: 'course' as const }]
                        : cart.map(item => ({ id: item.id, type: item.type }));

                    // 2. Procesar compra con AuthContext (Actualiza Supabase)
                    await purchaseItems(itemsToPurchase);

                    // 3. Limpiar carrito si no es compra directa
                    if (!directCourse) {
                        clearCart();
                        // Remover cupÃ³n
                        if (activeCoupon) removeCoupon();
                    }

                    onShowToast('Â¡Compra realizada con Ã©xito!', 'success');

                    // 4. Redirigir segÃºn el tipo de compra
                    setTimeout(() => {
                        navigate('/mis-cursos');
                    }, 2000);

                } catch (error) {
                    console.error("Error al procesar la compra", error);
                    onShowToast('Hubo un error al procesar tu compra. Intenta de nuevo.', 'error');
                }
                return;
            }

            // Mock de finalizaciÃ³n
            console.log("Procesando pago con:", paymentMethod);
            onShowToast('Redirigiendo a plataforma de pago...', 'success');
            // AquÃ­ irÃ­a la redirecciÃ³n real. Por ahora simulamos.

            // Si quisieramos "reservar" o algo, lo harÃ­amos acÃ¡.
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        } else {
            navigate(-1);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background space-y-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 font-medium">Cargando...</p>
            </div>
        );
    }

    if (isEmpty) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12 text-center animate-fade-in">
                <div className="w-24 h-24 bg-surface-dark rounded-full flex items-center justify-center mb-6 border border-white/5">
                    <span className="material-symbols-outlined text-4xl text-gray-500">shopping_cart_off</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">Tu carrito estÃ¡ vacÃ­o</h2>
                <p className="text-gray-400 mb-8 max-w-md">Parece que aÃºn no has agregado ningÃºn curso o recurso. Explora nuestro contenido para potenciar tu carrera.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => navigate('/academia')}
                        className="px-6 py-3 bg-primary text-black font-bold rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">school</span>
                        Explorar Cursos
                    </button>
                    <button
                        onClick={() => navigate('/recursos-pago')}
                        className="px-6 py-3 bg-surface-dark border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 hover:border-primary/50 transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-purple-400">folder_open</span>
                        Recursos
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in min-h-screen pb-24 md:pb-0 relative text-white">
            <div className="max-w-6xl mx-auto p-6 lg:p-12">

                {/* Stepper Header */}
                <div className="flex justify-around items-center mb-12 relative">
                    {STEPS.map((step) => {
                        const isActive = step.number === currentStep;
                        const isCompleted = step.number < currentStep;
                        return (
                            <div key={step.number} className="flex flex-col items-center gap-2 bg-background px-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300
                                    ${isActive ? 'bg-primary text-black shadow-[0_0_20px_rgba(34,211,238,0.4)] scale-110' :
                                        isCompleted ? 'bg-primary/20 text-primary border border-primary' : 'bg-surface text-gray-500 border border-white/10'}`}>
                                    {isCompleted ? <span className="material-symbols-outlined text-sm font-bold">check</span> : step.number}
                                </div>
                                <span className={`text-sm font-medium ${isActive ? 'text-primary' : isCompleted ? 'text-white' : 'text-gray-500'}`}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Columna Principal - Contenido DinÃ¡mico */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* PASO 1: CARRITO */}
                        {currentStep === 1 && (
                            <div className="animate-fade-in space-y-8">
                                {/* SecciÃ³n Cursos */}
                                {(directCourse || courses.length > 0) && (
                                    <div className="bg-surface-dark border border-white/5 rounded-2xl p-6">
                                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">school</span>
                                            Cursos
                                        </h3>
                                        <div className="space-y-4">
                                            {courses.map((item) => (
                                                <div key={item.id} className="flex gap-4 items-center bg-black/20 p-4 rounded-xl border border-white/5 relative group hover:border-primary/30 transition-colors">
                                                    <img src={item.image} className="w-20 h-20 rounded-lg object-cover" alt="" />
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-white text-lg">{item.title}</h4>
                                                        <p className="text-primary font-bold text-lg">${item.price.toLocaleString()}</p>
                                                    </div>
                                                    {!directCourse && (
                                                        <button
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-all"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">close</span>
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* SecciÃ³n Recursos */}
                                {!directCourse && resources.length > 0 && (
                                    <div className="bg-surface-dark border border-white/5 rounded-2xl p-6">
                                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-purple-400">folder_open</span>
                                            Recursos
                                        </h3>
                                        <div className="space-y-4">
                                            {resources.map((item) => (
                                                <div key={item.id} className="flex gap-4 items-center bg-black/20 p-4 rounded-xl border border-white/5 relative group hover:border-purple-500/30 transition-colors">
                                                    <img src={item.image} className="w-20 h-20 rounded-lg object-cover" alt="" />
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-white text-lg">{item.title}</h4>
                                                        <p className="text-primary font-bold text-lg">${item.price.toLocaleString()}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-all"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">close</span>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* PASO 2: INFORMACIÃ“N */}
                        {currentStep === 2 && (
                            <div className="animate-fade-in bg-surface-dark border border-white/5 rounded-2xl p-8">
                                <h3 className="text-2xl font-bold text-white mb-6">Datos de FacturaciÃ³n</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">Nombre</label>
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            readOnly={!!user?.firstName} // Read-only if from DB
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className={`w-full bg-black/20 border rounded-lg p-3 text-white 
                                                ${user?.firstName ? 'border-white/10 text-gray-400 cursor-not-allowed' : 'border-white/10 focus:border-primary'}`}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">Apellido</label>
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            readOnly={!!user?.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className={`w-full bg-black/20 border rounded-lg p-3 text-white 
                                                ${user?.lastName ? 'border-white/10 text-gray-400 cursor-not-allowed' : 'border-white/10 focus:border-primary'}`}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            readOnly
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-gray-400 cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm text-gray-400">DNI / Documento (Requerido para el certificado)</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={formData.dni}
                                                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                                                readOnly={!!user?.dni} // Bloqueado si ya existÃ­a en el usuario original
                                                placeholder="Ingresa tu DNI"
                                                className={`w-full bg-black/20 border rounded-lg p-3 text-white transition-colors
                                                    ${user?.dni ? 'border-white/10 text-gray-400 cursor-not-allowed' : 'border-primary/50 focus:border-primary'}`}
                                            />
                                            {user?.dni && (
                                                <span className="absolute right-3 top-3 text-xs text-gray-500 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">lock</span>
                                                    Verificado
                                                </span>
                                            )}
                                        </div>
                                        {!user?.dni && <p className="text-xs text-primary/80">* Este dato se vincularÃ¡ a tu cuenta y no podrÃ¡ modificarse posteriormente.</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">DirecciÃ³n</label>
                                        <input
                                            type="text"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            placeholder="Calle y altura"
                                            className="w-full bg-black/20 border border-white/10 focus:border-primary rounded-lg p-3 text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">CÃ³digo Postal</label>
                                        <input
                                            type="text"
                                            value={formData.zipCode}
                                            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                            placeholder="CP"
                                            className="w-full bg-black/20 border border-white/10 focus:border-primary rounded-lg p-3 text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PASO 3: PAGO */}
                        {currentStep === 3 && (
                            <div className="animate-fade-in space-y-6">
                                <h3 className="text-2xl font-bold text-white mb-4">SeleccionÃ¡ tu mÃ©todo de pago</h3>

                                <div className="grid grid-cols-1 gap-4">
                                    {/* OpciÃ³n Transferencia */}
                                    <button
                                        onClick={() => setPaymentMethod('transferencia')}
                                        className={`group relative p-6 rounded-2xl border transition-all duration-300 text-left flex items-center gap-6 overflow-hidden
                                            ${paymentMethod === 'transferencia' ? 'bg-surface-dark border-primary shadow-[0_0_30px_rgba(34,211,238,0.1)]' : 'bg-surface-dark border-white/10 hover:border-white/30'}`}
                                    >
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                                            ${paymentMethod === 'transferencia' ? 'border-primary' : 'border-gray-500'}`}>
                                            {paymentMethod === 'transferencia' && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="font-bold text-white text-lg">Transferencia Bancaria</h4>
                                                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-bold rounded">10% OFF</span>
                                            </div>
                                            <p className="text-gray-400 text-sm">TransferÃ­ directamente a nuestra cuenta bancaria.</p>
                                        </div>
                                        <span className="material-symbols-outlined text-4xl text-gray-600 group-hover:text-white transition-colors">account_balance</span>
                                    </button>

                                    {/* OpciÃ³n Mercado Pago */}
                                    <button
                                        onClick={() => setPaymentMethod('mercadopago')}
                                        className={`group relative p-6 rounded-2xl border transition-all duration-300 text-left flex items-center gap-6
                                            ${paymentMethod === 'mercadopago' ? 'bg-surface-dark border-primary shadow-[0_0_30px_rgba(34,211,238,0.1)]' : 'bg-surface-dark border-white/10 hover:border-white/30'}`}
                                    >
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                                            ${paymentMethod === 'mercadopago' ? 'border-primary' : 'border-gray-500'}`}>
                                            {paymentMethod === 'mercadopago' && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-white text-lg mb-1">Mercado Pago</h4>
                                            <p className="text-gray-400 text-sm">Dinero en cuenta, tarjetas de débito y crédito.</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-blue-400 font-bold text-xl">mercado</span>
                                            <span className="text-white font-bold text-xl">pago</span>
                                        </div>
                                    </button>

                                    {/* Renderizado Condicional del Brick de Mercado Pago */}
                                    {paymentMethod === 'mercadopago' && (
                                        <div className="mt-4 animate-fade-in bg-white p-4 rounded-xl">
                                            {loadingMP && (
                                                <div className="flex justify-center p-8">
                                                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                                </div>
                                            )}
                                            {/* Container para el brick vanilla */}
                                            <div id="paymentBrick_container" ref={brickContainerRef}></div>
                                        </div>
                                    )}



                                    {/* Botón de Acción Principal Desktop */}
                                    <button
                                        onClick={() => {
                                            if (currentStep === 3 && paymentMethod === 'mercadopago') {
                                                processMercadoPagoPayment();
                                            } else {
                                                handleNext();
                                            }
                                        }}
                                        className="w-full hidden lg:block py-4 bg-primary hover:bg-primary-dark text-black font-bold rounded-xl transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]"
                                    >
                                        {currentStep < 3 ? (
                                            <span className="flex items-center justify-center gap-2">
                                                Continuar <span className="material-symbols-outlined">arrow_forward</span>
                                            </span>
                                        ) : (
                                            'Finalizar Pedido'
                                        )}
                                    </button>

                                    <div className="mt-4 flex justify-center lg:justify-start">
                                        <button
                                            onClick={handleBack}
                                            className="text-sm text-gray-500 hover:text-white flex items-center gap-1 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                                            Volver al paso anterior
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-3 text-primary/80 text-xs">
                                    <span className="material-symbols-outlined text-lg">shield</span>
                                    <div>
                                        <p className="font-bold mb-1">Garantía de Satisfacción</p>
                                        <p>Tenés 7 días para probar el contenido. Si no es lo que esperabas, te devolvemos tu dinero.</p>
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>

                    {/* Columna Lateral - Resumen */}
                    <div className="lg:col-span-1">
                        <div className="bg-surface-dark border border-white/5 rounded-2xl p-6 sticky top-8">
                            <h3 className="text-xl font-bold text-white mb-6">Resumen de Compra</h3>

                            <div className="space-y-4 mb-6">
                                {directCourse ? (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-400">1 x {directCourse.title}</span>
                                        <span className="text-white font-bold">${directCourse.price.toLocaleString()}</span>
                                    </div>
                                ) : (
                                    cart.map(item => (
                                        <div key={item.id} className="flex justify-between items-center text-sm">
                                            <span className="text-gray-400">1 x {item.title}</span>
                                            <span className="text-white font-bold">${item.price.toLocaleString()}</span>
                                        </div>
                                    ))
                                )}

                                <div className="border-t border-white/10 my-4"></div>

                                <div className="flex justify-between items-center text-gray-400">
                                    <span>Subtotal</span>
                                    <span>${finalTotal.toLocaleString()}</span>
                                </div>

                                {paymentMethod === 'transferencia' && (
                                    <div className="flex justify-between items-center text-green-400">
                                        <span>Descuento Transferencia (10%)</span>
                                        <span>-${(finalTotal * 0.1).toLocaleString()}</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center text-xl font-bold text-white pt-4 border-t border-white/10">
                                    <span>Total</span>
                                    <div className="text-right">
                                        <span className="text-primary block">
                                            ${paymentMethod === 'transferencia'
                                                ? (finalTotal * 0.9).toLocaleString()
                                                : finalTotal.toLocaleString()}
                                        </span>
                                        {paymentMethod === 'transferencia' && (
                                            <span className="text-xs text-gray-500 font-normal block line-through">
                                                ${finalTotal.toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Cupón */}
                            {!directCourse && (
                                <div className="mb-6 space-y-2">
                                    {activeCoupon ? (
                                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex justify-between items-center">
                                            <span className="text-green-400 text-sm font-bold flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm">local_offer</span>
                                                Cupón activado
                                            </span>
                                            <button onClick={removeCoupon} className="text-gray-500 hover:text-white">
                                                <span className="material-symbols-outlined text-sm">close</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Código de cupón"
                                                value={couponInput}
                                                onChange={(e) => setCouponInput(e.target.value)}
                                                className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-primary flex-1"
                                            />
                                            <button
                                                onClick={() => applyCoupon(couponInput)}
                                                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-bold transition-all"
                                            >
                                                <span className="material-symbols-outlined text-sm">check</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Botón de Acción Principal Desktop (Movido aquí para que esté en el sidebar) */}
                            <button
                                onClick={() => {
                                    if (currentStep === 3 && paymentMethod === 'mercadopago') {
                                        processMercadoPagoPayment();
                                    } else {
                                        handleNext();
                                    }
                                }}
                                className={`w-full py-4 font-bold rounded-xl transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] mb-4
                                    ${paymentMethod === 'mercadopago' && currentStep === 3
                                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                        : 'bg-primary hover:bg-primary-dark text-black'}`}
                            >
                                {currentStep < 3 ? (
                                    <span className="flex items-center justify-center gap-2">
                                        Continuar <span className="material-symbols-outlined">arrow_forward</span>
                                    </span>
                                ) : (
                                    paymentMethod === 'mercadopago' ? 'Pagar con Mercado Pago' : 'Finalizar Pedido'
                                )}
                            </button>

                            <p className="text-xs text-gray-500 text-center">
                                Al completar la compra, aceptas nuestros términos y condiciones.
                            </p>
                        </div>
                    </div>

                    {/* Sticky Bottom Bar Mobile */}
                    <div className="fixed bottom-0 left-0 w-full bg-surface-dark border-t border-white/10 p-4 lg:hidden z-50">
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <p className="text-gray-400 text-xs uppercase">Total a pagar</p>
                                <p className="text-xl font-bold text-primary">
                                    ${paymentMethod === 'transferencia'
                                        ? (finalTotal * 0.9).toLocaleString()
                                        : finalTotal.toLocaleString()}
                                </p>
                            </div>
                            <button
                                onClick={handleNext}
                                className="px-6 py-3 bg-primary text-black font-bold rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                            >
                                {currentStep < 3 ? (
                                    <div className="flex items-center gap-2">
                                        Continuar <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                    </div>
                                ) : paymentMethod === 'mercadopago' ? 'Pagar arriba' : 'Finalizar'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay de Espera de Pago Externo */}
            {isWaitingPayment && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
                    <div className="bg-surface-dark border border-primary/30 p-8 rounded-2xl max-w-md w-full text-center shadow-[0_0_50px_rgba(34,211,238,0.2)] animate-fade-in">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                        <h3 className="text-2xl font-bold text-white mb-2">Esperando confirmación...</h3>
                        <p className="text-gray-400 mb-6">
                            Por favor completá el pago en la ventana emergente.
                            Detectaremos automáticamente cuando finalices.
                        </p>
                        <button
                            onClick={() => {
                                setIsWaitingPayment(false);
                                sessionStorage.removeItem('pendingPaymentId');
                                sessionStorage.removeItem('isPaymentInProgress');
                                sessionStorage.removeItem('paymentTimestamp');
                            }}
                            className="text-sm text-gray-500 hover:text-white underline"
                        >
                            Cancelar y volver
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
