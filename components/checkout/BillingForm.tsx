import React from 'react';

interface BillingFormProps {
    formData: {
        firstName: string;
        lastName: string;
        email: string;
        dni: string;
        address: string;
        zipCode: string;
        entityType: 'individual' | 'association';
        country?: string;
        province?: string;
        city?: string;
        cuil?: string;
        businessName?: string;
    };
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    user: any;
    onBack?: () => void;
}

const BillingForm: React.FC<BillingFormProps> = ({ formData, setFormData, user, onBack }) => {
    return (
        <>
            <div className="animate-fade-in bg-surface-dark border border-white/5 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Datos de Facturación</h3>
                <div className="md:col-span-2 space-y-2">
                    <label className="text-sm text-gray-400">Tipo de Persona (Facturación)</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="entityType"
                                value="individual"
                                checked={formData.entityType === 'individual'}
                                onChange={(e) => setFormData({ ...formData, entityType: 'individual' })}
                                className="text-primary focus:ring-primary bg-black/20 border-white/10"
                            />
                            <span className="text-white">Persona</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="entityType"
                                value="association"
                                checked={formData.entityType === 'association'}
                                onChange={(e) => setFormData({ ...formData, entityType: 'association' })}
                                className="text-primary focus:ring-primary bg-black/20 border-white/10"
                            />
                            <span className="text-white">Empresa</span>
                        </label>
                    </div>
                </div>

                {/* Campos de Empresa */}
                {formData.entityType === 'association' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in mb-4 p-4 bg-white/5 rounded-xl border border-primary/20">
                        <div className="space-y-2">
                            <label className="text-sm text-primary font-bold">Razón Social</label>
                            <input
                                type="text"
                                value={formData.businessName || ''}
                                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                placeholder="Nombre de la Empresa S.A."
                                className="w-full bg-black/40 border border-primary/50 focus:border-primary rounded-lg p-3 text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-primary font-bold">CUIT / TV</label>
                            <input
                                type="text"
                                value={formData.cuil || ''}
                                onChange={(e) => setFormData({ ...formData, cuil: e.target.value })}
                                placeholder="20-xxxxxxxx-x"
                                className="w-full bg-black/40 border border-primary/50 focus:border-primary rounded-lg p-3 text-white"
                            />
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Datos Personales / Representante */}
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Nombre {formData.entityType === 'association' ? '(Representante)' : ''}</label>
                        <input
                            type="text"
                            value={formData.firstName}
                            readOnly={!!user?.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className={`w-full bg-black/20 border rounded-lg p-3 text-white 
                            ${user?.firstName ? 'border-white/10 text-gray-400 cursor-not-allowed' : 'border-white/10 focus:border-primary'}`}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Apellido {formData.entityType === 'association' ? '(Representante)' : ''}</label>
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

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">DNI / Documento {formData.entityType === 'association' ? '(Representante)' : ''}</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={formData.dni}
                                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                                readOnly={!!user?.dni}
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
                    </div>

                    {/* Dirección - Fila Completa o Grid */}
                    <div className="space-y-2 md:col-span-2">
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
                        <label className="text-sm text-gray-400">País</label>
                        <input
                            type="text"
                            value={formData.country || ''}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            placeholder="Argentina"
                            className="w-full bg-black/20 border border-white/10 focus:border-primary rounded-lg p-3 text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Provincia / Estado</label>
                        <input
                            type="text"
                            value={formData.province || ''}
                            onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                            placeholder="Buenos Aires"
                            className="w-full bg-black/20 border border-white/10 focus:border-primary rounded-lg p-3 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Ciudad</label>
                        <input
                            type="text"
                            value={formData.city || ''}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder="CABA"
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

            {onBack && (
                <button
                    onClick={onBack}
                    className="mt-4 text-sm text-gray-500 hover:text-white flex items-center gap-1 transition-colors"
                >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Volver al paso anterior
                </button>
            )}
        </>
    );
};

export default BillingForm;
