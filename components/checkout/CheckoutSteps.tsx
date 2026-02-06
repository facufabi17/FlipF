import React from 'react';

interface CheckoutStepsProps {
    currentStep: number;
    steps: { number: number; label: string }[];
}

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ currentStep, steps }) => {
    return (
        <div className="flex justify-around items-center mb-12 relative">
            {steps.map((step) => {
                const isActive = step.number === currentStep;
                const isCompleted = step.number < currentStep;
                return (
                    <div key={step.number} className="flex flex-col items-center gap-2 bg-background px-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300
                            ${isActive ? 'bg-primary text-black shadow-[0_0_20px_rgba(34,211,238,0.4)] scale-110' :
                                isCompleted ? 'bg-primary/20 text-primary border border-primary' : 'bg-surface text-gray-500 border border-white/10'}`}>
                            {isCompleted ? <span className="material-symbols-outlined text-sm font-bold">check</span> : step.number}
                        </div>
                        <span className={`text-sm font-medium ${isActive ? 'text-primary' : isCompleted ? 'text-white' : 'text-gray-500'}`}>
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default CheckoutSteps;
