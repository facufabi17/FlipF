import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { COURSES } from '../data/courses';
import { initMercadoPago } from '@mercadopago/sdk-react';

// Components
import CheckoutSteps from '../components/checkout/CheckoutSteps';
import CartSummary from '../components/checkout/CartSummary';
import BillingForm from '../components/checkout/BillingForm';
import PaymentMethods from '../components/checkout/PaymentMethods';

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
    const { isAuthenticated, user, updateProfile, purchaseItems, loading, createOrder } = useAuth();
    const { cart, total, removeFromCart, clearCart, activeCoupon, applyCoupon, removeCoupon, discount, totalAfterDiscount } = useCart();

    // Estado del Stepper
    const [currentStep, setCurrentStep] = useState(1);

    // Estado del Formulario
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        dni: '',
        address: '',
        zipCode: '',
        entityType: 'individual' as 'individual' | 'association',
        country: '',
        province: '',
        city: '',
        cuil: '',
        businessName: ''
    });

    // Cargar datos persistidos (Step y Form) al montar
    useEffect(() => {
        try {
            // Restaurar Step
            const savedStep = sessionStorage.getItem('checkout_step');
            if (savedStep) {
                setCurrentStep(parseInt(savedStep, 10));
            }

            // Restaurar Form
            const savedForm = sessionStorage.getItem('checkout_form');
            if (savedForm) {
                setFormData(prev => ({ ...prev, ...JSON.parse(savedForm) }));
            }
        } catch (e) {
            console.error("Error restoring session data", e);
        }
    }, []);

    // Persistir Step al cambiar
    useEffect(() => {
        sessionStorage.setItem('checkout_step', currentStep.toString());
    }, [currentStep]);

    // Persistir Form al cambiar
    useEffect(() => {
        sessionStorage.setItem('checkout_form', JSON.stringify(formData));
    }, [formData]);

    // Estado de Pago
    const [paymentMethod, setPaymentMethod] = useState<'transferencia' | 'mercadopago' | null>(null);
    const [preferenceId, setPreferenceId] = useState<string | null>(null);
    const [loadingMP, setLoadingMP] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Estados para Pago Externo (Polling)
    const [isWaitingPayment, setIsWaitingPayment] = useState(false);
    const [externalPaymentId, setExternalPaymentId] = useState<string | null>(null);
    const [externalReference, setExternalReference] = useState<string | null>(null);
    const [initPoint, setInitPoint] = useState<string | null>(null);

    const directCourse = id ? COURSES.find(c => c.id === id) : null;
    const finalTotal = directCourse ? directCourse.price : totalAfterDiscount;
    const itemsToShow = directCourse
        ? [{ ...directCourse, type: 'course', quantity: 1 }]
        : cart;

    const courses = itemsToShow.filter(i => i.type === 'course');
    const resources = itemsToShow.filter(i => i.type === 'resource');
    const isEmpty = !directCourse && cart.length === 0;

    useEffect(() => {
        // Obtenemos preferencia si no tenemos ID O si somos MP y no tenemos Init Point (para Wallet)
        if (paymentMethod === 'mercadopago' && (!preferenceId || !initPoint)) {
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
                .then(async res => {
                    const data = await res.json();
                    if (!res.ok) {
                        console.error('SERVER ERROR DETAILS:', data);
                        throw new Error(data.details || data.error || 'Error creating preference');
                    }
                    return data;
                })
                .then(data => {
                    if (data.id) setPreferenceId(data.id);
                    if (data.init_point) setInitPoint(data.init_point);
                    if (data.external_reference) setExternalReference(data.external_reference);
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
        const storedReference = sessionStorage.getItem('pendingReference');
        const storedIsWaiting = sessionStorage.getItem('isPaymentInProgress');

        if ((storedPaymentId || storedReference) && storedIsWaiting === 'true') {
            const storedTimestamp = sessionStorage.getItem('paymentTimestamp');
            const now = Date.now();
            const oneHour = 60 * 60 * 1000;

            if (storedTimestamp && (now - parseInt(storedTimestamp, 10) < oneHour)) {
                console.log("Restaurando sesión de pago:", storedPaymentId || storedReference);
                if (storedPaymentId) setExternalPaymentId(storedPaymentId);
                if (storedReference) setExternalReference(storedReference);
                setIsWaitingPayment(true);
                onShowToast('Restaurando sesión de pago...', 'success');
            } else {
                console.log("Sesión de pago expirada o inválida, limpiando...");
                sessionStorage.removeItem('pendingPaymentId');
                sessionStorage.removeItem('pendingReference');
                sessionStorage.removeItem('isPaymentInProgress');
                sessionStorage.removeItem('paymentTimestamp');
            }
        }
    }, [onShowToast]);

    // Polling optimizado con Visibility API
    const isProcessingRef = useRef(false);
    const attemptsRef = useRef(0);

    const checkStatus = React.useCallback(async () => {
        // Control de Seguridad
        if (!isWaitingPayment || isProcessingRef.current) return;
        if (!externalPaymentId && !externalReference) return;

        // Límite de intentos (e.g. 20 intentos * 3 seg = 60 seg aprox)
        if (attemptsRef.current >= 20) {
            console.warn("Polling timeout alcanzado.");
            setIsWaitingPayment(false);
            sessionStorage.removeItem('pendingPaymentId');
            sessionStorage.removeItem('pendingReference');
            sessionStorage.removeItem('isPaymentInProgress');
            sessionStorage.removeItem('paymentTimestamp');
            onShowToast('Tiempo de espera agotado. Por favor verificá tu pago en Mercado Pago.', 'error');
            return;
        }

        attemptsRef.current += 1;

        try {
            let query = externalPaymentId
                ? `payment_id=${externalPaymentId}`
                : `external_reference=${externalReference}`;

            const res = await fetch(`/api/check-payment-status?${query}`);
            const data = await res.json();

            console.log(`Polling status (${attemptsRef.current}/20):`, data.status);

            if (data.id && !externalPaymentId) {
                setExternalPaymentId(data.id);
                sessionStorage.setItem('pendingPaymentId', data.id);
            }

            if (data.status === 'approved' || data.status === 'accredited') {
                isProcessingRef.current = true;
                setIsWaitingPayment(false);

                // Limpiar persistencia
                sessionStorage.removeItem('pendingPaymentId');
                sessionStorage.removeItem('pendingReference');
                sessionStorage.removeItem('isPaymentInProgress');
                sessionStorage.removeItem('paymentTimestamp');

                // Actualizar DB
                const itemsToPurchase = directCourse
                    ? [{ id: directCourse.id, type: 'course' as const }]
                    : cart.map(item => ({ id: item.id, type: item.type }));

                await purchaseItems(itemsToPurchase);

                if (!directCourse) {
                    clearCart();
                    if (activeCoupon) removeCoupon();
                }

                onShowToast('¡Pago exitoso!', 'success');
                navigate('/pago_apro', { replace: true });

            } else if (data.status === 'rejected') {
                isProcessingRef.current = true;
                setIsWaitingPayment(false);

                sessionStorage.removeItem('pendingPaymentId');
                sessionStorage.removeItem('pendingReference');
                sessionStorage.removeItem('isPaymentInProgress');
                sessionStorage.removeItem('paymentTimestamp');

                onShowToast('El pago fue rechazado. Intenta nuevamente.', 'error');
                setTimeout(() => { isProcessingRef.current = false; }, 1000);
            }
        } catch (error) {
            console.error("Error polling payment status:", error);
        }
    }, [isWaitingPayment, externalPaymentId, externalReference, directCourse, cart, navigate, purchaseItems, clearCart, activeCoupon, onShowToast]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isWaitingPayment && (externalPaymentId || externalReference)) {
            // Reiniciar intentos al comenzar un nuevo ciclo de espera
            if (attemptsRef.current === 0 || !interval) {
                // Solo reiniciamos si es un flujo fresco, o podriamos manejarlo al setear isWaitingPayment
            }
            // NOTA: Para no reiniciar el contador en cada render/reconexión si es el mismo pago, 
            // idealmente deberíamos resetearlo solo al iniciar el flujo de pago.
            // Por simplicidad, asumimos que si se monta el componente y recupera sesión, sigue contando (o empieza de 0 si no persistimos el count).

            checkStatus(); // Check inmediato
            interval = setInterval(checkStatus, 5000);

            const handleVisibilityChange = () => {
                if (document.visibilityState === 'visible') {
                    console.log("Tab visible, check inmediato...");
                    checkStatus();
                }
            };
            document.addEventListener("visibilitychange", handleVisibilityChange);

            return () => {
                clearInterval(interval);
                document.removeEventListener("visibilitychange", handleVisibilityChange);
            };
        }
    }, [isWaitingPayment, externalPaymentId, externalReference, checkStatus]);

    // Listener para sincronización de Pestañas (Wallet Redirect Success API)
    useEffect(() => {
        // Si Mercado Pago redirige exitosamente a ?status=approved, capturémoslo aquí.
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get('status');

        if (status === 'approved') {
            onShowToast('Pago detectado en URL', 'success');
            const itemsToPurchase = directCourse
                ? [{ id: directCourse.id, type: 'course' as const }]
                : cart.map(item => ({ id: item.id, type: item.type }));

            purchaseItems(itemsToPurchase).then(() => {
                if (!directCourse) {
                    clearCart();
                    if (activeCoupon) removeCoupon();
                }
                navigate('/pago_apro');
            });
        }
    }, [location.search]);


    // Listener para sincronización de Pestañas (BroadcastChannel + Storage)
    useEffect(() => {
        const handleSuccess = () => {
            const itemsToPurchase = directCourse
                ? [{ id: directCourse.id, type: 'course' as const }]
                : cart.map(item => ({ id: item.id, type: item.type }));

            purchaseItems(itemsToPurchase).then(() => {
                if (!directCourse) {
                    clearCart();
                    if (activeCoupon) removeCoupon();
                }
                setIsWaitingPayment(false);
                sessionStorage.removeItem('pendingPaymentId');
                sessionStorage.removeItem('pendingReference');
                sessionStorage.removeItem('isPaymentInProgress');
                sessionStorage.removeItem('paymentTimestamp');

                navigate('/pago_apro');
                onShowToast('¡Pago exitoso confirmado!', 'success');
            });
        };

        // 1. BroadcastChannel (Para navegadores modernos y mismo origen)
        const channel = new BroadcastChannel('payment_status');
        channel.onmessage = (event) => {
            if (event.data.type === 'PAYMENT_SUCCESS') {
                console.log("¡Pago exitoso detectado vía BroadcastChannel!");
                handleSuccess();
            }
        };

        // 2. Storage Event (Fallback para compatibilidad)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'mp_payment_success' && e.newValue) {
                console.log("¡Pago exitoso detectado vía Storage!");
                localStorage.removeItem('mp_payment_success');
                handleSuccess();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            channel.close();
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [directCourse, cart, purchaseItems, clearCart, activeCoupon, navigate, onShowToast]);

    // Handlers
    const brickContainerRef = useRef<HTMLDivElement>(null);

    // Inicializar Brick con Vanilla JS SDK
    useEffect(() => {
        if (currentStep === 3 && paymentMethod === 'mercadopago' && preferenceId && brickContainerRef.current) {

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
                            entityType: formData.entityType,
                            identification: {
                                type: formData.entityType === 'association' ? 'CUIT' : 'DNI',
                                number: formData.entityType === 'association' ? formData.cuil : formData.dni
                            }
                        },
                    },
                    customization: {
                        paymentMethods: {
                            ticket: "all",
                            creditCard: "all",
                            debitCard: "all",
                            mercadoPago: "all", // Wallet
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
                        onSubmit: async () => {
                            console.warn("NATIVE BRICK SUBMIT DETECTED - Recapturing flow...");
                            if (window.paymentBrickController) {
                                processMercadoPagoPayment();
                            }
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
            if ((currentStep !== 3 || paymentMethod !== 'mercadopago') && window.paymentBrickController) {
                window.paymentBrickController.unmount();
                window.paymentBrickController = null;
            }
        };
    }, [currentStep, paymentMethod, preferenceId, finalTotal]);


    const processMercadoPagoPayment = async () => {
        console.log(">>> INICIANDO PROCESO DE PAGO con Brick Controller <<<");

        if (!window.paymentBrickController) {
            console.error("Brick Controller not found");
            onShowToast("Error interno del componente de pago. Recarga la página.", "error");
            return;
        }

        try {
            onShowToast('Procesando pago...', 'success');
            const result = await window.paymentBrickController.getFormData().catch((e: any) => null);

            if ((!result || !result.formData) && result?.paymentType !== 'wallet_purchase') {
                onShowToast('Por favor revisá los datos del formulario.', 'error');
                return;
            }

            // CASO WALLET / REDIRECT
            if (result?.paymentType === 'wallet_purchase') {
                if (initPoint) {
                    if (externalReference) {
                        sessionStorage.setItem('pendingReference', externalReference);
                        sessionStorage.setItem('isPaymentInProgress', 'true');
                        sessionStorage.setItem('paymentTimestamp', Date.now().toString());
                        attemptsRef.current = 0; // Reset intentos
                    }
                    window.open(initPoint, 'mp_popup', 'width=1000,height=700,scrollbars=yes,resizable=yes');
                    setIsWaitingPayment(true);
                    onShowToast('Continuá el pago en la ventana emergente', 'success');
                    return;
                } else {
                    onShowToast("Error al iniciar la redirección de pago.", "error");
                    return;
                }
            }

            // CASO CORE (Tarjetas)
            const response = await fetch("/api/process-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(result.formData),
            });

            const paymentResult = await response.json();

            if (paymentResult.error) {
                onShowToast('Error al procesar el pago: ' + (paymentResult.details?.message || paymentResult.error), 'error');
                return;
            }

            if (paymentResult.status === 'approved') {
                const itemsToPurchase = directCourse
                    ? [{ id: directCourse.id, type: 'course' as const }]
                    : cart.map(item => ({ id: item.id, type: item.type }));

                await purchaseItems(itemsToPurchase);

                if (!directCourse) {
                    clearCart();
                    if (activeCoupon) removeCoupon();
                }

                sessionStorage.removeItem('pendingPaymentId');
                sessionStorage.removeItem('isPaymentInProgress');
                sessionStorage.removeItem('paymentTimestamp');

                navigate('/pago_apro');
                onShowToast('¡Pago exitoso!', 'success');

            } else if (['in_process', 'pending', 'created'].includes(paymentResult.status)) {
                if (paymentResult.point_of_interaction?.type === 'redirect' && paymentResult.point_of_interaction.transaction_data?.ticket_url) {
                    window.open(paymentResult.point_of_interaction.transaction_data.ticket_url, '_blank');
                }

                const paymentIdStr = paymentResult.id.toString();
                setExternalPaymentId(paymentIdStr);
                setIsWaitingPayment(true);
                sessionStorage.setItem('pendingPaymentId', paymentIdStr);
                sessionStorage.setItem('isPaymentInProgress', 'true');
                sessionStorage.setItem('paymentTimestamp', Date.now().toString());
                attemptsRef.current = 0; // Reset intentos

            } else {
                onShowToast('Estado del pago: ' + paymentResult.status, 'error');
            }

        } catch (error) {
            console.error("Network Error:", error);
            onShowToast('Error de conexión al procesar el pago', 'error');
        }
    };

    // --- Lógica de Transferencia ---
    const handleTransferOrder = async () => {
        if (!user) return;
        setIsProcessing(true);

        const itemsToPurchase = directCourse
            ? [{ id: directCourse.id, title: directCourse.title, type: 'course' as const, price: directCourse.price }]
            : cart.map(item => ({ id: item.id, title: item.title, type: item.type, price: item.price }));

        // 1. Crear Orden "Pending" con datos extra
        const order = await createOrder(
            itemsToPurchase,
            finalTotal,
            'transferencia',
            'pending',
            {
                entity_type: formData.entityType,
                country: formData.country,
                province: formData.province,
                city: formData.city,
                cuil: formData.cuil,
                business_name: formData.businessName
            }
        );

        if (order) {
            // 2. Limpiar carrito si corresponde
            if (!directCourse) {
                clearCart();
                if (activeCoupon) removeCoupon();
            }

            // 3. Notificar y Redirigir
            onShowToast('Pedido registrado. Por favor envía tu comprobante.', 'success');
            setTimeout(() => {
                navigate('/historial-compras');
            }, 1000);
        } else {
            onShowToast('Error al registrar el pedido.', 'error');
            setIsProcessing(false);
        }
    };

    const handleNext = async () => {
        if (currentStep === 1) {
            if (isEmpty) {
                onShowToast('El carrito está vacío', 'error');
                return;
            }
            setCurrentStep(2);
        } else if (currentStep === 2) {
            if (!formData.firstName || !formData.lastName || !formData.email || !formData.dni || !formData.address || !formData.zipCode || !formData.country || !formData.province || !formData.city) {
                onShowToast('Por favor completa todos los campos obligatorios', 'error');
                return;
            }
            if (formData.entityType === 'association' && !formData.cuil) {
                onShowToast('El CUIL es obligatorio para Personas Jurídicas', 'error');
                return;
            }
            if (user && !user.dni && formData.dni) {
                try {
                    await updateProfile({ dni: formData.dni });
                } catch (e) {
                    console.error("Error guardando DNI", e);
                }
            }
            setCurrentStep(3);
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
                <h2 className="text-3xl font-bold text-white mb-3">Tu carrito está vacío</h2>
                <p className="text-gray-400 mb-8 max-w-md">Parece que aún no has agregado ningún curso o recurso.</p>
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

    // Main Render
    return (
        <div className="animate-fade-in min-h-screen pb-24 md:pb-0 relative text-white">
            <div className="max-w-6xl mx-auto p-6 lg:p-12">

                {/* Stepper */}
                <CheckoutSteps currentStep={currentStep} steps={STEPS} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Columna Principal */}
                    <div className="lg:col-span-2 space-y-6">

                        {currentStep === 1 && (
                            <div className="animate-fade-in space-y-8">
                                {/* Cursos */}
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
                                                        <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-all">
                                                            <span className="material-symbols-outlined text-lg">close</span>
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Recursos */}
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
                                                    <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-all">
                                                        <span className="material-symbols-outlined text-lg">close</span>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {currentStep === 2 && (
                            <BillingForm formData={formData} setFormData={setFormData} user={user} onBack={handleBack} />
                        )}

                        {currentStep === 3 && (
                            <PaymentMethods
                                paymentMethod={paymentMethod}
                                setPaymentMethod={setPaymentMethod}
                                loadingMP={loadingMP}
                                onMainAction={() => {
                                    if (paymentMethod === 'mercadopago') {
                                        processMercadoPagoPayment();
                                    } else if (paymentMethod === 'transferencia') {
                                        handleTransferOrder();
                                    } else {
                                        // Handle other logic here or just next
                                        handleNext();
                                    }
                                }}
                                currentStep={3}
                                handleBack={handleBack}
                                ref={brickContainerRef}
                            />
                        )}
                    </div>

                    {/* Columna Lateral - Resumen */}
                    <div className="lg:col-span-1">
                        <CartSummary
                            cart={cart}
                            directCourse={directCourse}
                            finalTotal={finalTotal}
                            paymentMethod={paymentMethod}
                            activeCoupon={activeCoupon}
                            onApplyCoupon={applyCoupon}
                            onRemoveCoupon={removeCoupon}
                            currentStep={currentStep}
                            onMainAction={() => {
                                if (currentStep === 3) {
                                    if (paymentMethod === 'mercadopago') processMercadoPagoPayment();
                                    else if (paymentMethod === 'transferencia') handleTransferOrder();
                                    else handleNext();
                                } else {
                                    handleNext();
                                }
                            }}
                            loadingMP={loadingMP}
                        />
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
                                onClick={() => {
                                    if (currentStep === 3) {
                                        if (paymentMethod === 'mercadopago') processMercadoPagoPayment();
                                        else if (paymentMethod === 'transferencia') handleTransferOrder();
                                        else handleNext();
                                    } else {
                                        handleNext();
                                    }
                                }}
                                className="px-6 py-3 bg-primary text-black font-bold rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                            >
                                {currentStep < 3 ? (
                                    <div className="flex items-center gap-2">
                                        Continuar <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                    </div>
                                ) : paymentMethod === 'mercadopago' ? 'Pagar (Arriba)' : 'Finalizar'}
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
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => setIsWaitingPayment(false)}
                                className="text-sm text-gray-500 hover:text-white underline"
                            >
                                Cancelar espera
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
