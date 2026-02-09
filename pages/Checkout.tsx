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
    onShowToast: (text: string, type?: 'success' | 'error' | 'info') => void;
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

    // Estado para orden pendiente (Database-First)
    const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);

    // Estado para Mobile Footer
    const [isMobileDetailsOpen, setIsMobileDetailsOpen] = useState(false);
    const [mobileCouponInput, setMobileCouponInput] = useState('');

    useEffect(() => {
        // Obtenemos preferencia si no tenemos ID O si somos MP y no tenemos Init Point (para Wallet)
        // Y si NO estamos cargando ya (evitar doble llamada)
        if (paymentMethod === 'mercadopago' && (!preferenceId || !initPoint) && !loadingMP) {

            const initializePayment = async () => {
                setLoadingMP(true);

                const itemsToPurchase = directCourse
                    ? [{ id: directCourse.id, title: directCourse.title, price: directCourse.price, quantity: 1, type: 'course' }]
                    : cart.map(item => ({ id: item.id, title: item.title, price: item.price, quantity: 1, type: item.type }));

                try {
                    // 1. Database-First: Crear orden pendiente SI no existe
                    let currentOrderId = pendingOrderId;

                    if (!currentOrderId) {
                        // Importante: createOrder espera items, total, method, status, billingData
                        const orderData = await createOrder(
                            itemsToPurchase,
                            finalTotal,
                            'mercadopago',
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

                        if (orderData && orderData.id) {
                            currentOrderId = orderData.id;
                            setPendingOrderId(currentOrderId);
                            console.log("Orden pendiente creada en DB:", currentOrderId);
                        } else {
                            throw new Error("No se pudo crear la orden en la base de datos.");
                        }
                    }

                    // 2. Crear Preferencia en MP usando el ID de la orden como referencia externa
                    const res = await fetch('/api/create-preference', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            items: itemsToPurchase,
                            baseUrl: window.location.origin,
                            external_reference: currentOrderId, // Usamos el ID de la orden
                            payer: {
                                name: formData.firstName,
                                surname: formData.lastName,
                                email: formData.email,
                                identification: {
                                    type: formData.entityType === 'association' ? 'CUIT' : 'DNI',
                                    number: formData.entityType === 'association' ? formData.cuil : formData.dni
                                }
                            }
                        })
                    });

                    const data = await res.json();
                    if (!res.ok) {
                        console.error('SERVER ERROR DETAILS:', data);
                        throw new Error(data.details || data.error || 'Error creating preference');
                    }

                    if (data.id) setPreferenceId(data.id);
                    if (data.init_point) setInitPoint(data.init_point);
                    // Ahora la referencia externa debería ser el mismo orderID
                    if (data.external_reference) setExternalReference(data.external_reference);

                } catch (err) {
                    console.error("Error creating preference/order", err);
                    onShowToast("Error al inicializar pago. Intenta nuevamente.", "error");
                } finally {
                    setLoadingMP(false);
                }
            };

            initializePayment();
        }
    }, [paymentMethod, preferenceId, directCourse, cart, onShowToast, createOrder, finalTotal, formData, pendingOrderId, loadingMP, initPoint]);

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
    const hasRestoredSession = useRef(false);

    useEffect(() => {
        if (hasRestoredSession.current) return;

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
                hasRestoredSession.current = true;
                // Evitamos llamar a onShowToast aquí para no causar re-renders infinitos si la función no es estable
            } else {
                console.log("Sesión de pago expirada o inválida, limpiando...");
                sessionStorage.removeItem('pendingPaymentId');
                sessionStorage.removeItem('pendingReference');
                sessionStorage.removeItem('isPaymentInProgress');
                sessionStorage.removeItem('paymentTimestamp');
            }
        }
    }, []); // Dependencias vacías para correr solo al montar

    // Polling optimizado con Visibility API
    const isProcessingRef = useRef(false);
    const attemptsRef = useRef(0);

    const checkStatus = React.useCallback(async () => {
        // Control de Seguridad
        if (!isWaitingPayment || isProcessingRef.current) return;
        if (!externalPaymentId && !externalReference) return;

        // Límite de intentos (e.g. 40 intentos * 3 seg = 60 seg aprox)
        if (attemptsRef.current >= 40) {
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

            console.log(`Polling status (${attemptsRef.current}/40):`, data.status);

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
                sessionStorage.removeItem('pendingPaymentId');
                sessionStorage.removeItem('pendingReference');
                sessionStorage.removeItem('isPaymentInProgress');
                sessionStorage.removeItem('paymentTimestamp');

                // Limpiar estado del checkout
                sessionStorage.removeItem('checkout_step');
                sessionStorage.removeItem('checkout_form');
                setCurrentStep(1);

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
                // Navegar con datos
                navigate(`/pago_apro?payment_id=${data.id}&status=${data.status}&external_reference=${query.split('=')[1] || ''}`, { replace: true });

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
                // Solo reiniciamos si es un flujo fresco
            }

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
        // ... (código existente del urlParams, se puede mantener como fallback o mejorar)
    }, [location.search]);


    // Listener para sincronización de Pestañas (BroadcastChannel)
    useEffect(() => {
        const handleSuccess = (data?: any) => {
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
                sessionStorage.removeItem('pendingReference');
                sessionStorage.removeItem('isPaymentInProgress');
                sessionStorage.removeItem('paymentTimestamp');

                // Limpiar estado del checkout
                sessionStorage.removeItem('checkout_step');
                sessionStorage.removeItem('checkout_form');
                setCurrentStep(1);

                // Construir URL de éxito con datos
                let successUrl = '/pago_apro';
                if (data) {
                    const params = new URLSearchParams();
                    if (data.paymentId) params.append('payment_id', data.paymentId);
                    if (data.status) params.append('status', data.status);
                    if (data.externalReference) params.append('external_reference', data.externalReference);
                    successUrl += `?${params.toString()}`;
                }

                navigate(successUrl);
                onShowToast('¡Pago exitoso confirmado!', 'success');
            });
        };

        // 1. BroadcastChannel
        const channel = new BroadcastChannel('payment_status');
        channel.onmessage = (event) => {
            if (event.data.type === 'PAYMENT_COMPLETED' || event.data.type === 'PAYMENT_SUCCESS') {
                console.log("¡Pago exitoso detectado vía BroadcastChannel!", event.data);
                handleSuccess(event.data.data);
            }
        };

        return () => {
            channel.close();
        };
    }, [directCourse, cart, purchaseItems, clearCart, activeCoupon, navigate, onShowToast]);

    // Handlers
    const brickContainerRef = useRef<HTMLDivElement>(null);

    // Inicializar Brick con Vanilla JS SDK
    useEffect(() => {
        if (currentStep === 3 && paymentMethod === 'mercadopago' && preferenceId && brickContainerRef.current) {

            // Limpieza preventiva
            if (window.paymentBrickController) {
                try {
                    window.paymentBrickController.unmount();
                } catch (e) {
                    console.warn("Error unmounting previous brick:", e);
                }
                window.paymentBrickController = null;
            }

            setLoadingMP(true);

            // Importante: Asegurar que el objeto MP se crea con la Key correcta
            const mp = new window.MercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, {
                locale: 'es-AR'
            });

            const bricksBuilder = mp.bricks();

            const renderBrick = async () => {
                const settings = {
                    initialization: {
                        amount: Math.round(finalTotal),
                        preferenceId: preferenceId,
                        // Mapeo Crítico para evitar secure_fetch_card_token_failed
                        payer: {
                            email: formData.email, // Campo OBLIGATORIO para tokenización
                            firstName: formData.firstName,
                            lastName: formData.lastName,
                            // Reintegrado y asegurado para evitar warning/error "entityType only receives..."
                            entityType: (formData.entityType === 'association') ? 'association' : 'individual',
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
                            hidePaymentButton: true, // OCULTAR BOTÓN NATIVO para usar el externo
                        }
                    },
                    callbacks: {
                        onReady: () => {
                            setLoadingMP(false);
                            console.log("Brick ready");
                        },
                        onSubmit: async (paymentFormData: any, additionalData: any) => {
                            console.log("Brick onSubmit Triggered");
                            console.log("FormData COMPLETO recibido del Brick:", JSON.stringify(paymentFormData, null, 2));
                            console.log("AdditionalData recibido del Brick:", JSON.stringify(additionalData, null, 2));

                            // Validación crítica de Token para pagos con tarjeta
                            if (paymentFormData.paymentType === 'credit_card' || paymentFormData.paymentType === 'debit_card') {
                                const token = paymentFormData.token || paymentFormData.formData?.token;
                                if (!token) {
                                    console.error("❌ ERROR CRÍTICO: El Brick no devolvió un token de tarjeta. Datos recibidos:", paymentFormData);
                                    onShowToast("Error: No se pudo validar la tarjeta. Por favor revise los datos e intente nuevamente.", "error");
                                    return; // IMPORTANTE: Detener ejecución aquí
                                }
                            }

                            // Llamamos a nuestra función de procesamiento pasando los datos DIRECTOS del brick
                            await processMercadoPagoPayment(paymentFormData);
                        },
                        onError: (error: any) => {
                            console.error("Brick Error Callback:", error);
                            setLoadingMP(false);
                            const errorMsg = error.message || "Error desconocido en el componente de pago";
                            onShowToast(`Error en el formulario de pago: ${errorMsg}`, "error");
                        },
                    },
                };

                try {
                    const controller = await bricksBuilder.create('payment', 'paymentBrick_container', settings);
                    window.paymentBrickController = controller;
                } catch (e) {
                    console.error("Error creating brick instance", e);
                    onShowToast("No se pudo cargar el formulario de pago. Refrescá la página.", "error");
                }
            };

            renderBrick();
        }

        // Cleanup al desmontar o cambiar dependencias
        return () => {
            if (window.paymentBrickController) {
                try {
                    window.paymentBrickController.unmount();
                    window.paymentBrickController = null;
                } catch (e) {
                    console.warn("Cleanup error:", e);
                }
            }
        };
    }, [currentStep, paymentMethod, preferenceId, finalTotal, formData, onShowToast]); // Dependencias simplificadas a formData objeto completo



    const processMercadoPagoPayment = async (brickFormData?: any) => {
        try {
            setLoadingMP(true);
            console.log(">>> INICIANDO PROCESO DE PAGO <<<");

            // Si no nos pasan datos (desde onSubmit), intentamos obtenerlos del controller (fallback)
            // Pero idealmente deberían venir desde onSubmit
            let paymentData = brickFormData;

            if (!paymentData && window.paymentBrickController) {
                // Recuperamos datos desde el controller al usar el botón externo
                try {
                    const result = await window.paymentBrickController.getFormData();
                    if (result) {
                        paymentData = result.formData || result;
                    }
                } catch (e) {
                    console.error("Fallo obteniendo datos del controller:", e);
                }
            }

            if (!paymentData) {
                console.error("❌ No hay datos de pago disponibles.");
                onShowToast("Por favor completá los datos de la tarjeta y usá el botón 'Pagar' del formulario.", "error");
                setLoadingMP(false);
                return;
            }

            // Validación final antes de enviar al backend
            if ((paymentData.paymentType === 'credit_card' || paymentData.paymentType === 'debit_card') && !paymentData.token && !paymentData.formData?.token) {
                console.error("❌ ERROR: Intento de envío al backend sin token.", paymentData);
                onShowToast("Error de validación: Falta el token de la tarjeta.", "error");
                setLoadingMP(false);
                return;
            }

            // CASO WALLET / REDIRECT (detectado por payment_method_id o tipo)
            if (paymentData.payment_method_id === 'account_money' || paymentData.paymentType === 'wallet_purchase') {
                if (initPoint) {
                    if (externalReference) {
                        sessionStorage.setItem('pendingReference', externalReference);
                        sessionStorage.setItem('isPaymentInProgress', 'true');
                        sessionStorage.setItem('paymentTimestamp', Date.now().toString());
                        attemptsRef.current = 0;
                    }
                    console.log("Redirigiendo a Wallet:", initPoint);
                    // window.open(initPoint, 'mp_popup', 'width=1000,height=700,scrollbars=yes,resizable=yes'); // Comentado para evitar duplicidad
                    setIsWaitingPayment(true);
                    onShowToast('Continuá el pago en la nueva pestaña', 'success');
                    setLoadingMP(false);
                    return; // IMPORTANTE: Retornar para no seguir al backend
                } else {
                    console.warn("Se solicitó Wallet pero no hay initPoint definido.");
                }
            }

            // CASO CORE (Tarjetas)
            // Enriquecer datos del pago con info de contexto
            // IMPORTANTE: El Brick devuelve los datos dentro de 'formData', hay que aplanarlos para el backend de MP
            const sourceData = paymentData.formData || paymentData;

            const paymentPayload = {
                ...sourceData, // Esto trae token, transaction_amount, installments, payment_method_id, etc. al primer nivel
                description: directCourse ? `Curso: ${directCourse.title}` : `Compra en Flip - ${cart.length} items`,
                external_reference: pendingOrderId,
                payer: {
                    ...sourceData.payer, // Priorizar datos del brick (email, identification)
                    email: formData.email, // Fallback/Overwrite con datos del formulario de facturación
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    identification: {
                        type: formData.entityType === 'association' ? 'CUIT' : 'DNI',
                        number: formData.entityType === 'association' ? formData.cuil : formData.dni
                    }
                },
                notification_url: import.meta.env.VITE_WEBHOOK_URL || undefined,
                binary_mode: true
            };

            console.log("Enviando pago al backend:", paymentPayload);

            const response = await fetch("/api/process-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(paymentPayload),
            });

            const paymentResult = await response.json();

            if (paymentResult.error) {
                console.error("Error Backend:", paymentResult);
                // Si el error es checkout_create_error, intentamos mostrar detalles
                const details = paymentResult.details || {};
                const msg = details.message || paymentResult.error || "Error desconocido";
                onShowToast(`Error al procesar el pago: ${msg}`, 'error');
                setLoadingMP(false); // Asegurar que quitamos loading
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
                sessionStorage.removeItem('pendingReference');
                sessionStorage.removeItem('paymentTimestamp'); // Corregido: limpieza redundante

                // Limpiar estado del checkout
                sessionStorage.removeItem('checkout_step');
                sessionStorage.removeItem('checkout_form');
                setCurrentStep(1);

                navigate('/pago_apro');
                onShowToast('¡Pago exitoso!', 'success');

            } else if (['in_process', 'pending', 'created', 'authorized'].includes(paymentResult.status)) {
                // ... lógica existente pendiente ...
                if (paymentResult.point_of_interaction?.type === 'redirect' && paymentResult.point_of_interaction.transaction_data?.ticket_url) {
                    window.open(paymentResult.point_of_interaction.transaction_data.ticket_url, '_blank');
                }

                const paymentIdStr = paymentResult.id.toString();
                setExternalPaymentId(paymentIdStr);
                setIsWaitingPayment(true);
                sessionStorage.setItem('pendingPaymentId', paymentIdStr);
                sessionStorage.setItem('isPaymentInProgress', 'true');
                sessionStorage.setItem('paymentTimestamp', Date.now().toString());
                attemptsRef.current = 0;

            } else {
                onShowToast('Estado del pago: ' + paymentResult.status, 'error');
            }

        } catch (error) {
            console.error("Network/System Error:", error);
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
            // 3. Notificar y Redirigir
            onShowToast('Pedido registrado. Por favor envía tu comprobante.', 'success');

            // Limpiar estado del checkout
            sessionStorage.removeItem('checkout_step');
            sessionStorage.removeItem('checkout_form');
            setCurrentStep(1);

            setTimeout(() => {
                navigate('/historial-compras');
            }, 1000);
        } else {
            onShowToast('Error al registrar el pedido.', 'error');
            setIsProcessing(false);
        }
    };

    const handleCancelPayment = () => {
        setIsWaitingPayment(false);
        sessionStorage.removeItem('pendingPaymentId');
        sessionStorage.removeItem('pendingReference');
        sessionStorage.removeItem('isPaymentInProgress');
        sessionStorage.removeItem('paymentTimestamp');
        onShowToast('Pago cancelado.', 'info');
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
        <>
            {/* Overlay de Espera de Pago */}
            {isWaitingPayment && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[9999] flex flex-col items-center justify-center p-4 animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}>
                    <div className="bg-surface-dark border border-white/10 p-8 rounded-2xl max-w-md w-full text-center shadow-[0_0_50px_rgba(34,211,238,0.3)] relative z-[10000]">
                        <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                        <h3 className="text-2xl font-bold text-white mb-2">Confirmando pago...</h3>
                        <p className="text-gray-400 mb-6">
                            Completá el proceso en la ventana de Mercado Pago.<br />
                            <span className="text-primary text-sm mt-2 block">No cierres esta pestaña.</span>
                        </p>

                        <div className="flex items-start gap-3 text-sm text-left bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 text-blue-200">
                            <span className="material-symbols-outlined text-lg mt-0.5">info</span>
                            <span>
                                Una vez aprobado, te redirigiremos automáticamente.
                            </span>
                        </div>

                        <button
                            onClick={handleCancelPayment}
                            className="mt-6 text-sm text-gray-500 hover:text-red-400 transition-colors underline decoration-dotted underline-offset-4"
                        >
                            Cancelar y volver
                        </button>
                    </div>
                </div>
            )}

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

                        {/* Smart Sticky Footer Mobile */}
                        {isMobileDetailsOpen && (
                            <div
                                className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
                                onClick={() => setIsMobileDetailsOpen(false)}
                            />
                        )}

                        <div className={`fixed bottom-0 left-0 w-full bg-surface-dark border-t border-white/10 transition-transform duration-300 z-50 lg:hidden rounded-t-2xl shadow-[0_-5px_20px_rgba(0,0,0,0.5)]`}>

                            {/* Contenido Expandido */}
                            {isMobileDetailsOpen && (
                                <div className="p-4 space-y-4 animate-fade-in max-h-[60vh] overflow-y-auto">
                                    <div className="flex justify-center mb-2" onClick={() => setIsMobileDetailsOpen(false)}>
                                        <div className="w-12 h-1 bg-white/20 rounded-full"></div>
                                    </div>
                                    <h4 className="text-white font-bold mb-2">Detalle del Pedido</h4>

                                    {/* Lista de Ítems */}
                                    <div className="space-y-3">
                                        {itemsToShow.map(item => (
                                            <div key={item.id} className="flex justify-between items-center text-sm">
                                                <span className="text-gray-300 truncate max-w-[200px]">{item.title}</span>
                                                <span className="text-white font-medium">${item.price.toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-white/10 my-2"></div>

                                    {/* Cupón Mobile */}
                                    {!directCourse && (
                                        <div className="py-2">
                                            {activeCoupon ? (
                                                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex justify-between items-center">
                                                    <span className="text-green-400 text-sm font-bold flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-sm">local_offer</span>
                                                        Cupón aplicado
                                                    </span>
                                                    <button onClick={removeCoupon} className="text-gray-500 hover:text-white">
                                                        <span className="material-symbols-outlined text-sm">close</span>
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex gap-2 w-full">
                                                    <input
                                                        type="text"
                                                        placeholder="Código de cupón"
                                                        value={mobileCouponInput}
                                                        onChange={(e) => setMobileCouponInput(e.target.value)}
                                                        className="min-w-0 bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-primary flex-1"
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            applyCoupon(mobileCouponInput);
                                                            setMobileCouponInput('');
                                                        }}
                                                        className="shrink-0 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-bold transition-all"
                                                    >
                                                        Aplicar
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="border-t border-white/10 my-2"></div>

                                    <div className="flex justify-between items-center text-gray-400 text-sm">
                                        <span>Subtotal</span>
                                        <span>${finalTotal.toLocaleString()}</span>
                                    </div>

                                    {paymentMethod === 'transferencia' && (
                                        <div className="flex justify-between items-center text-green-400 text-sm">
                                            <span>Descuento Transferencia (10%)</span>
                                            <span>-${(finalTotal * 0.1).toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Barra Fija (Always Visible) */}
                            <div className="p-4 flex items-center gap-4 bg-surface-dark border-t border-white/5">
                                <button
                                    onClick={() => setIsMobileDetailsOpen(!isMobileDetailsOpen)}
                                    className="p-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    <span className={`material-symbols-outlined transform transition-transform duration-300 ${isMobileDetailsOpen ? 'rotate-180' : ''}`}>keyboard_arrow_up</span>
                                </button>

                                <div className="flex-1" onClick={() => setIsMobileDetailsOpen(!isMobileDetailsOpen)}>
                                    <p className="text-gray-400 text-xs uppercase">Total a pagar</p>
                                    <p className="text-xl font-bold text-primary">
                                        ${paymentMethod === 'transferencia'
                                            ? (finalTotal * 0.9).toLocaleString()
                                            : finalTotal.toLocaleString()}
                                    </p>
                                </div>

                                {/* Botón de Acción Mobile - RESTAURADO */}
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
                                    disabled={loadingMP && currentStep === 3 && paymentMethod === 'mercadopago'}
                                    className={`px-6 py-3 bg-primary text-black font-bold rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.3)] whitespace-nowrap ${loadingMP ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {currentStep < 3 ? (
                                        <div className="flex items-center gap-2">
                                            Continuar <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                        </div>
                                    ) : loadingMP && paymentMethod === 'mercadopago' ? 'Cargando...' :
                                        paymentMethod === 'mercadopago' ? 'Pagar' : 'Finalizar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Checkout;