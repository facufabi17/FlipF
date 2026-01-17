import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { COURSES } from '../data/courses';

interface CheckoutProps {
    onShowToast: (text: string, type?: 'success' | 'error') => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onShowToast }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { enrollInCourse, purchaseItems, isAuthenticated } = useAuth();
    const { cart, total, removeFromCart, clearCart } = useCart();

    // Si hay ID en URL, es compra directa de curso. Si no, es carrito.
    const directCourse = id ? COURSES.find(c => c.id === id) : null;

    const [isProcessing, setIsProcessing] = useState(false);

    // Estados Formulario
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated) return null;

    // Si intenta compra directa pero no existe curso
    if (id && !directCourse) {
        return <div className="p-20 text-center text-white">Ítem no encontrado</div>;
    }

    // Calcular monto final
    const finalTotal = directCourse ? directCourse.price : total;

    // Si es carrito y está vacío
    if (!id && cart.length === 0) {
        return (
            <div className="p-20 text-center text-white flex flex-col items-center justify-center min-h-[60vh]">
                <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">shopping_cart_off</span>
                <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
                <button onClick={() => navigate('/academia')} className="bg-primary px-6 py-2 rounded-lg font-bold">Explorar Academia</button>
            </div>
        );
    }

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!cardNumber || !cardName || !expiry || !cvc) {
            onShowToast('Por favor completa los datos de pago', 'error');
            return;
        }

        setIsProcessing(true);

        try {
            if (directCourse) {
                // Compra única de Curso
                await enrollInCourse(directCourse.id);
                onShowToast(`¡Compra exitosa! Bienvenido a ${directCourse.title}`, 'success');
                navigate('/mis-cursos');
            } else {
                // Compra de Carrito (Cursos y Recursos)
                // Usamos purchaseItems para una actualización atómica
                await purchaseItems(cart.map(item => ({ id: item.id, type: item.type })));
                clearCart();
                onShowToast('¡Compra procesada con éxito!', 'success');
                // Redirigir a la sección más relevante (recursos si compró recursos)
                if (cart.some(i => i.type === 'resource')) {
                    navigate('/mis-recursos');
                } else {
                    navigate('/mis-cursos');
                }
            }
        } catch (error) {
            console.error("Payment error:", error);
            onShowToast('Hubo un error al procesar la compra', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="animate-fade-in min-h-screen">
            <section className="p-6 lg:p-12 max-w-6xl mx-auto min-h-[80vh] flex items-center">
                <div className="w-full">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-muted hover:text-white mb-8 transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span> Cancelar
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Resumen de Compra */}
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-white">Resumen del Pedido</h2>
                            <div className="bg-surface-dark border border-white/5 rounded-2xl overflow-hidden">
                                <div className="max-h-[400px] overflow-y-auto p-6 space-y-4 custom-scrollbar">
                                    {directCourse ? (
                                        // ITEM ÚNICO (CURSO)
                                        <div className="flex gap-4 items-center">
                                            <img src={directCourse.image} className="w-16 h-16 rounded-lg object-cover" alt="" />
                                            <div>
                                                <h3 className="font-bold text-white">{directCourse.title}</h3>
                                                <p className="text-sm text-gray-400">Curso • {directCourse.category}</p>
                                                <p className="text-primary font-bold mt-1">${directCourse.price.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        // LISTA DEL CARRITO
                                        cart.map((item, idx) => (
                                            <div key={`${item.id}-${idx}`} className="flex gap-4 items-center relative group">
                                                <img src={item.image} className="w-16 h-16 rounded-lg object-cover" alt="" />
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-white text-sm line-clamp-1">{item.title}</h3>
                                                    <p className="text-xs text-gray-400 uppercase">{item.type === 'course' ? 'Curso' : 'Recurso'}</p>
                                                    <p className="text-primary font-bold mt-1">${item.price.toLocaleString()}</p>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    title="Eliminar"
                                                >
                                                    <span className="material-symbols-outlined">delete</span>
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="bg-black/20 p-6 border-t border-white/5 flex justify-between items-center">
                                    <span className="text-gray-300 text-lg">Total a Pagar</span>
                                    <span className="text-3xl font-bold text-white">${finalTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-400 bg-surface-dark p-3 rounded-lg border border-white/5">
                                <span className="material-symbols-outlined text-green-500">lock</span>
                                Pago 100% seguro encriptado SSL de 256-bits.
                            </div>
                        </div>

                        {/* Formulario de Pago */}
                        <div className="bg-surface-dark p-8 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <span className="material-symbols-outlined text-9xl">credit_card</span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-6 relative z-10">Datos de la Tarjeta</h3>

                            <form onSubmit={handlePayment} className="space-y-5 relative z-10">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Número de Tarjeta</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="0000 0000 0000 0000"
                                            maxLength={19}
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(e.target.value)}
                                            className="w-full bg-[#1b131f] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none pl-12"
                                        />
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">payment</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Titular de la Tarjeta</label>
                                    <input
                                        type="text"
                                        placeholder="NOMBRE APELLIDO"
                                        value={cardName}
                                        onChange={(e) => setCardName(e.target.value)}
                                        className="w-full bg-[#1b131f] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none uppercase"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Vencimiento</label>
                                        <input
                                            type="text"
                                            placeholder="MM/AA"
                                            maxLength={5}
                                            value={expiry}
                                            onChange={(e) => setExpiry(e.target.value)}
                                            className="w-full bg-[#1b131f] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none text-center"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">CVC</label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                placeholder="123"
                                                maxLength={3}
                                                value={cvc}
                                                onChange={(e) => setCvc(e.target.value)}
                                                className="w-full bg-[#1b131f] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none text-center"
                                            />
                                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm">help</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full bg-primary hover:bg-purple-600 transition-all text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed mt-4 shadow-lg shadow-primary/20"
                                >
                                    {isProcessing ? (
                                        <>
                                            <span className="material-symbols-outlined animate-spin">sync</span> Procesando...
                                        </>
                                    ) : (
                                        <>
                                            Pagar ${finalTotal.toLocaleString()}
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Checkout;