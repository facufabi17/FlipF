import React, { forwardRef } from 'react';

interface PaymentMethodsProps {
    paymentMethod: 'transferencia' | 'mercadopago' | 'mobbex' | 'prueba' | null;
    setPaymentMethod: (method: 'transferencia' | 'mercadopago' | 'mobbex' | 'prueba') => void;
    loadingMP: boolean;
    onMainAction: () => void;
    currentStep: number;
    handleBack: () => void;
}

const PaymentMethods = forwardRef<HTMLDivElement, PaymentMethodsProps>(({
    paymentMethod,
    setPaymentMethod,
    loadingMP,
    onMainAction,
    currentStep,
    handleBack
}, brickContainerRef) => {

    return (
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

                {/* Renderizado Condicional del Brick de Mercado Pago - CONSERVAR REFERENCIA */}
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

                {/* 
                  Mobbex Integration (Inactive/Future)
                  // TODO: Implement Mobbex logic when credentials/sdk are available.
                  // Current implementation is a placeholder based on future requirements.
                  /*
                  <button
                      onClick={() => setPaymentMethod('mobbex')}
                      className="..."
                  >
                      Mobbex Placeholder
                  </button>
                  */
                }


                {/* Botón de Acción Principal Desktop */}
                <button
                    onClick={onMainAction}
                    disabled={loadingMP && currentStep === 3 && paymentMethod === 'mercadopago'}
                    className="w-full hidden lg:block py-4 bg-primary hover:bg-primary-dark text-black font-bold rounded-xl transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]"
                >
                    {currentStep < 3 ? (
                        <span className="flex items-center justify-center gap-2">
                            Continuar <span className="material-symbols-outlined">arrow_forward</span>
                        </span>
                    ) : (
                        loadingMP && paymentMethod === 'mercadopago' ? 'Cargando...' :
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
    );
});

export default PaymentMethods;
