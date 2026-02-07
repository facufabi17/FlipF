import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Order } from '../../types';
import { CONTACT_INFO } from '../../info';

const PurchaseHistory: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, loading: authLoading, getOrders } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login');
            return;
        }

        if (isAuthenticated) {
            fetchOrders();
        }
    }, [authLoading, isAuthenticated, navigate]);

    const fetchOrders = async () => {
        setLoading(true);
        const data = await getOrders();
        setOrders(data);
        setLoading(false);
    };

    const handleSendProof = (order: Order) => {
        const phone = CONTACT_INFO.whatsapp.match(/phone=(\d+)/)?.[1] || '5493624000000';
        const message = `Hola, adjunto comprobante del pedido #${order.id.slice(0, 8)} por un total de $${order.total}.`;
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background-dark">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-opacity-50"></div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className="animate-fade-in min-h-screen bg-background-dark text-white">
            <section className="p-6 lg:p-12 max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate('/perfil')} className="text-gray-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-3xl">arrow_back</span>
                    </button>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Historial de Compras
                    </h2>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-surface-dark rounded-2xl border border-white/5">
                        <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">receipt_long</span>
                        <h3 className="text-xl font-bold text-white mb-2">Aún no tienes pedidos</h3>
                        <p className="text-gray-400 mb-6">Tus compras aparecerán aquí.</p>
                        <button onClick={() => navigate('/academia')} className="bg-primary px-6 py-2 rounded-lg text-black font-bold hover:bg-primary-dark transition-colors">
                            Ir al Catálogo
                        </button>
                    </div>
                ) : (
                    <div className="bg-surface-dark/50 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/5 text-gray-400 text-sm uppercase tracking-wider">
                                        <th className="p-4 font-medium">Fecha</th>
                                        <th className="p-4 font-medium">ID Pedido</th>
                                        <th className="p-4 font-medium">Ítems</th>
                                        <th className="p-4 font-medium">Total</th>
                                        <th className="p-4 font-medium">Estado</th>
                                        <th className="p-4 font-medium">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {orders.map((order) => {
                                        const date = new Date(order.created_at).toLocaleDateString('es-AR', {
                                            day: '2-digit', month: '2-digit', year: 'numeric'
                                        });

                                        let badgeColor = "bg-gray-500/20 text-gray-400 border-gray-500/30";
                                        let statusText: string = order.status;

                                        if (order.status === 'approved') {
                                            badgeColor = "bg-green-500/20 text-green-400 border-green-500/30";
                                            statusText = "Aprobado";
                                        } else if (order.status === 'pending') {
                                            badgeColor = "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
                                            statusText = "Pendiente";
                                        } else if (order.status === 'rejected') {
                                            badgeColor = "bg-red-500/20 text-red-400 border-red-500/30";
                                            statusText = "Rechazado";
                                        }

                                        return (
                                            <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                                <td className="p-4 text-gray-300 whitespace-nowrap">{date}</td>
                                                <td className="p-4 font-mono text-sm text-gray-400">#{order.id.slice(0, 8)}</td>
                                                <td className="p-4">
                                                    <div className="flex flex-col gap-1">
                                                        {order.items.map((item, idx) => (
                                                            <span key={idx} className="text-sm text-gray-200 block truncate max-w-[200px]" title={item.title}>
                                                                • {item.title}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="p-4 font-bold text-white">${order.total.toLocaleString()}</td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeColor}`}>
                                                        {statusText}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    {order.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleSendProof(order)}
                                                            className="flex items-center gap-1 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border border-[#25D366]/30"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">send</span>
                                                            Enviar Comprobante
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default PurchaseHistory;
