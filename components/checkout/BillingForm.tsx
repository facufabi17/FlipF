import React from 'react';

interface BillingFormProps {
    formData: {
        firstName: string;
        lastName: string;
        email: string;
        dni: string;
        address: string;
        zipCode: string;
    };
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    user: any;
}

const BillingForm: React.FC<BillingFormProps> = ({ formData, setFormData, user }) => {
    return (
        <div className="animate-fade-in bg-surface-dark border border-white/5 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Datos de Facturación</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Nombre</label>
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
    );
};

export default BillingForm;
