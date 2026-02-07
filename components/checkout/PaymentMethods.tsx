import React, { forwardRef } from 'react';
import { BANK_INFO } from '../../info';

interface PaymentMethodsProps {
    paymentMethod: 'transferencia' | 'mercadopago' | null;
    setPaymentMethod: (method: 'transferencia' | 'mercadopago') => void;
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

                {paymentMethod === 'transferencia' && (
                    <div className="animate-fade-in space-y-4">
                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex gap-3 text-left">
                            <span className="material-symbols-outlined text-yellow-500 shrink-0">warning</span>
                            <p className="text-sm text-yellow-200">
                                <span className="font-bold">IMPORTANTE:</span> Para aprobar tu acceso, es <span className="font-bold underline">OBLIGATORIO</span> enviar el comprobante de pago por WhatsApp al finalizar el pedido.
                            </p>
                        </div>

                        <div className="bg-surface-dark border border-white/10 rounded-xl p-6 relative overflow-hidden">
                            {BANK_INFO.bankLogo && (
                                <div className="absolute top-4 right-4 opacity-80 bg-white/5 p-2 rounded-lg">
                                    <img src={BANK_INFO.bankLogo} alt={BANK_INFO.bankName} className="h-6 object-contain" />
                                </div>
                            )}
                            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                                Datos Bancarios
                            </h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-gray-400">Banco:</span>
                                    <span className="text-white font-medium text-right">{BANK_INFO.bankName}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-gray-400">Titular:</span>
                                    <span className="text-white font-medium text-right">{BANK_INFO.nameOfTheHolder}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-gray-400">CBU:</span>
                                    <div className="text-right">
                                        <span className="text-white font-medium block">{BANK_INFO.cbu}</span>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(BANK_INFO.cbu)}
                                            className="text-primary text-xs hover:underline mt-1 flex items-center gap-1 justify-end ml-auto"
                                        >
                                            <span className="material-symbols-outlined text-[10px]">content_copy</span>
                                            Copiar CBU
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-gray-400">Alias:</span>
                                    <div className="text-right">
                                        <span className="text-primary font-bold text-lg block">{BANK_INFO.alias}</span>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(BANK_INFO.alias)}
                                            className="text-gray-400 text-xs hover:text-white hover:underline mt-1 flex items-center gap-1 justify-end ml-auto"
                                        >
                                            <span className="material-symbols-outlined text-[10px]">content_copy</span>
                                            Copiar Alias
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">CUIT/DNI:</span>
                                    <span className="text-white font-medium text-right">{BANK_INFO.dni}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

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
                        <img src="/mercado-pago.png" alt="Mercado Pago" className="h-8 object-contain" />

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

                {/* Botón de Acción Principal Desktop */}


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
