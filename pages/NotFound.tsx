import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
            <div className="text-center space-y-6 max-w-md">
                <div className="flex justify-center">
                    <AlertCircle className="w-24 h-24 text-[#00F5F1] animate-pulse" />
                </div>

                <h1 className="text-6xl font-black text-white tracking-tighter">
                    4<span className="text-[#00F5F1]">0</span>4
                </h1>

                <h2 className="text-2xl font-bold text-gray-200">
                    Página no encontrada
                </h2>

                <p className="text-gray-400">
                    Lo sentimos, la página que estás buscando no existe o ha sido movida.
                </p>

                <div className="pt-8">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center px-8 py-3 text-base font-bold text-black transition-all duration-200 bg-[#00F5F1] border border-transparent rounded-lg hover:bg-[#00d8d5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00F5F1]"
                    >
                        Volver al inicio
                    </Link>
                </div>
            </div>
        </div>
    );
}
