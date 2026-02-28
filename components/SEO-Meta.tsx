import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { getSeoForPath } from '../data/data-SEO';

interface SEOMetaProps {
    title?: string;
    description?: string;
    image?: string;
}

const SEOMeta: React.FC<SEOMetaProps> = ({ title, description, image }) => {
    // 1. Obtener información de la URL actual ('Nosotros', 'Academia', etc)
    const location = useLocation();

    // 2. Extraer los datos predefinidos ("Single Source of Truth") para esta URL
    const routeSeo = getSeoForPath(location.pathname);

    // 3. Fallbacks: Si se mandó un valor por prop en el componente, gana el prop. 
    // Si no (la mayoría de las veces), usamos el valor central del archivo seoRoutes.ts
    const finalTitle = title || routeSeo.title;
    const finalDescription = description || routeSeo.description;
    const finalImage = image || routeSeo.image;

    return (
        <Helmet>
            <title>{finalTitle}</title>
            <meta name="description" content={finalDescription} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:image" content={finalImage} />
            <meta name="twitter:card" content="summary_large_image" />
        </Helmet>
    );
};

export default SEOMeta;
