import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOMetaProps {
    title: string;
    description: string;
    image?: string;
}

const SEOMeta: React.FC<SEOMetaProps> = ({ title, description, image = '/Meta-img.png' }) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta name="twitter:card" content="summary_large_image" />
        </Helmet>
    );
};

export default SEOMeta;
