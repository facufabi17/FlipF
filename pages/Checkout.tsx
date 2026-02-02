import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { COURSES } from '../data/courses';

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
    const { isAuthenticated, user, updateProfile } = useAuth();
    const { cart, total, removeFromCart, getCheckoutItems, activeCoupon, applyCoupon, removeCoupon, discount, totalAfterDiscount } = useCart();

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
    const [paymentMethod, setPaymentMethod] = useState<'transferencia' | 'mercadopago' | 'mobbex' | null>(null);
    const [couponInput, setCouponInput] = useState('');

    const directCourse = id ? COURSES.find(c => c.id === id) : null;
    const finalTotal = directCourse ? directCourse.price : totalAfterDiscount;
    const itemsToShow = directCourse
        ? [{ ...directCourse, type: 'course', quantity: 1 }] // Mock item wrapper
        : cart;

    const courses = itemsToShow.filter(i => i.type === 'course');
    const resources = itemsToShow.filter(i => i.type === 'resource');

    // Scroll top al cambiar de paso
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentStep]);

    // Cargar datos de usuario
    useEffect(() => {
        if (isAuthenticated && user) {
            setFormData(prev => ({
                ...prev,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                dni: user.dni || ''
            }));
        } else if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, user, navigate]);

    // Handlers
    const handleNext = async () => {
        if (currentStep === 1) {
            // Validar carrito no vacío
            if (!directCourse && cart.length === 0) {
                onShowToast('El carrito está vacío', 'error');
                return;
            }
            setCurrentStep(2);
        } else if (currentStep === 2) {
            // Validar campos obligatorios
            if (!formData.firstName || !formData.lastName || !formData.email || !formData.dni || !formData.address || !formData.zipCode) {
                onShowToast('Por favor completa todos los campos obligatorios', 'error');
                return;
            }
            // Si el DNI es nuevo (no estaba en user.dni), se guardará al finalizar o aquí mismo?
            // El requerimiento dice: "DNI debe ser solo lectura si ya existe".
            // Podríamos intentar guardarlo ahora si es nuevo para asegurar persistencia antes del pago.
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
                onShowToast('Selecciona un método de pago', 'error');
                return;
            }
            // Mock de finalización
            console.log("Procesando pago con:", paymentMethod);
            onShowToast('Redirigiendo a plataforma de pago...', 'success');
            // Aquí iría la redirección real. Por ahora simulamos.

            // Si quisieramos "reservar" o algo, lo haríamos acá.
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="animate-fade-in min-h-screen pb-24 md:pb-0 relative text-white">
            <div className="max-w-6xl mx-auto p-6 lg:p-12">

                {/* Stepper Header */}
                <div className="flex justify-between items-center mb-12 relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -z-10"></div>
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
                    {/* Columna Principal - Contenido Dinámico */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* PASO 1: CARRITO */}
                        {currentStep === 1 && (
                            <div className="animate-fade-in space-y-8">
                                {/* Sección Cursos */}
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

                                {/* Sección Recursos */}
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

                        {/* PASO 2: INFORMACIÓN */}
                        {currentStep === 2 && (
                            <div className="animate-fade-in bg-surface-dark border border-white/5 rounded-2xl p-8">
                                <h3 className="text-2xl font-bold text-white mb-6">Datos de Facturación</h3>
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
                                                readOnly={!!user?.dni} // Bloqueado si ya existía en el usuario original
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
                                        {!user?.dni && <p className="text-xs text-primary/80">* Este dato se vinculará a tu cuenta y no podrá modificarse posteriormente.</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">Dirección</label>
                                        <input
                                            type="text"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            placeholder="Calle y altura"
                                            className="w-full bg-black/20 border border-white/10 focus:border-primary rounded-lg p-3 text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">Código Postal</label>
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
                                <h3 className="text-2xl font-bold text-white mb-4">Seleccioná tu método de pago</h3>

                                <div className="grid grid-cols-1 gap-4">
                                    {/* Opción Transferencia */}
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
                                            <p className="text-gray-400 text-sm">Transferí directamente a nuestra cuenta bancaria.</p>
                                        </div>
                                        <span className="material-symbols-outlined text-4xl text-gray-600 group-hover:text-white transition-colors">account_balance</span>
                                    </button>

                                    {/* Opción Mercado Pago */}
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

                                    {/* Opción Mobbex */}
                                    <button
                                        onClick={() => setPaymentMethod('mobbex')}
                                        className={`group relative p-6 rounded-2xl border transition-all duration-300 text-left flex items-center gap-6
                                            ${paymentMethod === 'mobbex' ? 'bg-surface-dark border-primary shadow-[0_0_30px_rgba(34,211,238,0.1)]' : 'bg-surface-dark border-white/10 hover:border-white/30'}`}
                                    >
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                                            ${paymentMethod === 'mobbex' ? 'border-primary' : 'border-gray-500'}`}>
                                            {paymentMethod === 'mobbex' && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-white text-lg mb-1">Mobbex (Tarjeta TUYA)</h4>
                                            <p className="text-gray-400 text-sm">Pagá conMobbex, Paga con TUYA (NBCH).</p>
                                        </div>
                                        <span className="font-bold text-xl tracking-wider text-purple-400">mobbex</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Columna Lateral - Resumen Sticky */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">

                            {/* Resumen de Costos */}
                            <div className="bg-surface-dark border border-white/5 rounded-2xl p-6 shadow-xl">
                                <h3 className="text-lg font-bold text-white mb-6">Resumen</h3>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Subtotal</span>
                                        <span>${total.toLocaleString()}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-primary">
                                            <span>Descuento</span>
                                            <span>-${discount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    {paymentMethod === 'transferencia' && (
                                        <div className="flex justify-between text-green-400">
                                            <span>Descuento Transferencia</span>
                                            <span>-${(finalTotal * 0.10).toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="border-t border-white/10 pt-3 flex justify-between items-end">
                                        <span className="text-white font-medium">Total</span>
                                        <span className="text-3xl font-bold text-primary">
                                            ${paymentMethod === 'transferencia'
                                                ? (finalTotal * 0.9).toLocaleString()
                                                : finalTotal.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Cupón (Solo en paso 1) */}
                                {currentStep === 1 && (
                                    <div className="mb-6">
                                        <div className="flex gap-2">
                                            <input
                                                value={couponInput}
                                                onChange={(e) => setCouponInput(e.target.value)}
                                                placeholder="Código de descuento"
                                                className="flex-1 bg-black/20 border border-white/10 rounded px-3 py-2 text-sm text-white"
                                            />
                                            <button
                                                onClick={() => {
                                                    if (!couponInput) return;
                                                    if (applyCoupon(couponInput)) {
                                                        onShowToast('Cupón aplicado', 'success');
                                                    } else {
                                                        onShowToast('Cupón inválido', 'error');
                                                    }
                                                }}
                                                className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded text-white text-sm font-medium transition-colors"
                                            >
                                                Aplicar
                                            </button>
                                        </div>
                                        {activeCoupon && (
                                            <div className="flex justify-between items-center mt-2 text-xs text-primary">
                                                <span>Aplicado: {activeCoupon.code}</span>
                                                <button onClick={() => { removeCoupon(); setCouponInput(''); }} className="underline hover:text-white">Eliminar</button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Botón de Acción Principal Desktop */}
                                <button
                                    onClick={handleNext}
                                    className="w-full hidden lg:block py-4 bg-primary hover:bg-primary-dark text-black font-bold rounded-xl transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]"
                                >
                                    {currentStep === 1 ? 'Continuar a Información' :
                                        currentStep === 2 ? 'Continuar a Pago' : 'Finalizar Pedido'}
                                </button>

                                <div className="mt-4 flex justify-center lg:justify-start">
                                    <button onClick={handleBack} className="text-sm text-gray-500 hover:text-white flex items-center gap-1 transition-colors">
                                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                                        {currentStep === 1 ? 'Volver al inicio' : 'Volver al paso anterior'}
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
                    </div>
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
                        {currentStep === 1 ? 'Continuar' :
                            currentStep === 2 ? 'Siguiente' : 'Finalizar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;