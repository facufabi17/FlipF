import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const RouteTracker = () => {
    const location = useLocation();

    useEffect(() => {
        window.dataLayer = window.dataLayer || [];

        const timeoutId = setTimeout(() => {
            window.dataLayer.push({
                event: 'virtual_pageview',
                page_path: location.pathname + location.search,
                page_title: document.title
            });
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [location]);

    return null;
};

export default RouteTracker;
