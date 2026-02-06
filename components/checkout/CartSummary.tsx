import React, { useState } from 'react';

interface CartSummaryProps {
    cart: any[];
    directCourse: any | null;
    finalTotal: number;
    paymentMethod: string | null;
    activeCoupon: any | null;
    onApplyCoupon: (code: string) => void;
    onRemoveCoupon: () => void;
    currentStep: number;
    onMainAction: () => void;
    loadingMP?: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({
    cart,
    directCourse,
    finalTotal,
    paymentMethod,
    activeCoupon,
    onApplyCoupon,
    onRemoveCoupon,
    currentStep,
    onMainAction,
    loadingMP
}) => {
    const [couponInput, setCouponInput] = useState('');

    return (
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
                            <button onClick={onRemoveCoupon} className="text-gray-500 hover:text-white">
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
                                onClick={() => onApplyCoupon(couponInput)}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-bold transition-all"
                            >
                                <span className="material-symbols-outlined text-sm">check</span>
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Botón de Acción Principal Desktop */}
            <button
                onClick={onMainAction}
                disabled={loadingMP && currentStep === 3 && paymentMethod === 'mercadopago'}
                className={`w-full py-4 font-bold rounded-xl transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] mb-4
                    ${paymentMethod === 'mercadopago' && currentStep === 3
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-primary hover:bg-primary-dark text-black'}
                    ${(loadingMP && currentStep === 3 && paymentMethod === 'mercadopago') ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
                {currentStep < 3 ? (
                    <span className="flex items-center justify-center gap-2">
                        Continuar <span className="material-symbols-outlined">arrow_forward</span>
                    </span>
                ) : (
                    loadingMP && paymentMethod === 'mercadopago' ? 'Cargando...' :
                        paymentMethod === 'mercadopago' ? 'Pagar con Mercado Pago' : 'Finalizar Pedido'
                )}
            </button>

            <p className="text-xs text-gray-500 text-center">
                Al completar la compra, aceptas nuestros términos y condiciones.
            </p>
        </div>
    );
};

export default CartSummary;
