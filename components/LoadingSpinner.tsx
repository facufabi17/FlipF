import React from 'react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background-dark space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 font-medium">Cargando...</p>
        </div>
    );
};

export default LoadingSpinner;
