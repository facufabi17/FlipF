import { useEffect } from 'react';

const GoogleAnalytics = () => {
    useEffect(() => {
        const gaId = import.meta.env.VITE_GA_ID;

        if (!gaId) {
            console.warn('Google Analytics ID not found in environment variables (VITE_GA_ID).');
            return;
        }

        // Inyectar el script de gtag.js
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script);

        // Inyectar la configuración de gtag
        const scriptConfig = document.createElement('script');
        scriptConfig.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
        `;
        document.head.appendChild(scriptConfig);

        return () => {
            // Limpieza opcional: remover scripts al desmontar (generalmente no necesario para GA)
            document.head.removeChild(script);
            document.head.removeChild(scriptConfig);
        };
    }, []);

    return null; // Este componente no renderiza nada visualmente
};

export default GoogleAnalytics;
