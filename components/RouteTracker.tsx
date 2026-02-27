import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const RouteTracker = () => {
    const location = useLocation();

    useEffect(() => {
        window.dataLayer = window.dataLayer || [];

        // Le damos 300ms de gracia a SEOMeta para que alcance a cambiar el <title> real del navegador
        const timeoutId = setTimeout(() => {
            window.dataLayer.push({
                event: 'virtual_pageview',
                page_path: location.pathname + location.search,
                page_location: window.location.href,
                page_title: document.title // Aseguramos enviar el título recién horneado
            });
        }, 300); // 300 milisegundos es el tiempo estándar recomendado para SPAs

        return () => clearTimeout(timeoutId);
    }, [location]);

    return null;
};

export default RouteTracker;
