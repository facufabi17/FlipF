
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PagoAprobado = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="bg-surface-dark border border-primary/20 rounded-2xl p-8 max-w-md w-full text-center shadow-[0_0_50px_rgba(34,211,238,0.1)] animate-fade-in">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-4xl text-green-400">check_circle</span>
                </div>

                <h1 className="text-3xl font-bold text-white mb-2">¡Pago Aprobado!</h1>
                <p className="text-gray-400 mb-8">
                    Tu compra se ha procesado correctamente. Ya tenés acceso a todo el contenido.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={() => navigate('/mis-cursos')}
                        className="w-full py-4 bg-primary hover:bg-primary-dark text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                    >
                        Ir a Mis Cursos
                    </button>

                    <button
                        onClick={() => navigate('/recursos')}
                        className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all"
                    >
                        Ver Recursos
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PagoAprobado;
