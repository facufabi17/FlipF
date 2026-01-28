import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PAID_RESOURCES } from '../data/resources';

const MyResources: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, loading } = useAuth();

    React.useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login');
        }
    }, [loading, isAuthenticated, navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary border-opacity-50"></div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    const myResources = PAID_RESOURCES.filter(res => user?.ownedResources?.includes(res.id));

    return (
        <div className="animate-fade-in min-h-screen">
            <section className="p-6 lg:p-12 max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate('/recursos-pago')} className="text-text-muted hover:text-white transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div>
                        <h2 className="text-4xl font-bold text-white">Mis Recursos</h2>
                        <p className="text-text-muted">Descarga tus herramientas adquiridas.</p>
                    </div>
                </div>

                {myResources.length === 0 ? (
                    <div className="text-center py-20 bg-surface-dark rounded-2xl border border-white/5">
                        <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">folder_off</span>
                        <h3 className="text-xl font-bold text-white mb-2">Aún no tienes recursos</h3>
                        <p className="text-gray-400 mb-6">Explora nuestra biblioteca para adquirir herramientas potentes.</p>
                        <button onClick={() => navigate('/recursos-pago')} className="bg-primary px-6 py-2 rounded-lg text-white font-bold">Ir a la Biblioteca</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myResources.map(resource => (
                            <div key={resource.id} className="bg-surface-dark border border-white/5 rounded-xl p-6 flex flex-col hover:border-tech/50 transition-colors">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-white/5 rounded-lg text-tech">
                                        <span className="material-symbols-outlined text-2xl">
                                            {resource.type === 'Ebook' ? 'menu_book' : resource.type === 'Template' ? 'dashboard' : 'folder_zip'}
                                        </span>
                                    </div>
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider border border-white/10 px-2 py-1 rounded">{resource.type}</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{resource.title}</h3>
                                <p className="text-sm text-gray-400 mb-6 flex-1">{resource.description}</p>

                                <a
                                    href={resource.downloadUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-lg transition-colors border border-white/10"
                                >
                                    <span className="material-symbols-outlined">download</span> Descargar
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default MyResources;