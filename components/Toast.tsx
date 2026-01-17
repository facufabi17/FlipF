import React, { useEffect, useState } from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
    message: ToastMessage | null;
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(onClose, 500); // Wait for animation
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    if (!message) return null;

    return (
        <div className={`fixed bottom-8 right-8 z-[200] transform transition-transform duration-500 ${isVisible ? 'translate-y-0' : 'translate-y-40'}`}>
            <div className="bg-surface-dark border-l-4 border-tech p-4 rounded-xl shadow-2xl flex items-center gap-4">
                <div className="p-2 bg-tech/20 rounded-full text-tech">
                    <span className="material-symbols-outlined">verified</span>
                </div>
                <div>
                    <p className="text-tech font-bold text-xs uppercase">{message.type}</p>
                    <p className="text-white text-sm font-bold">{message.text}</p>
                </div>
            </div>
        </div>
    );
};