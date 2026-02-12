"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils'; // Assumes you have a utils file
import { School, TrendingUp, Rocket, Medal, Award, ChevronRight, Check } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

// --- Types ---
export interface TimelineStage {
    name: string;
    description: string;
    icon?: React.ReactNode;
    courses?: { title: string; id: string }[];
}

export interface TimelineProps {
    stages: TimelineStage[];
    className?: string;
    careerTitle?: string;
    incentive?: string;
}

export const CourseTimeline: React.FC<TimelineProps> = ({
    stages,
    className,
    careerTitle = "Ruta de Aprendizaje",
    incentive = "Certificación Oficial"
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Track scroll progress relative to this component
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    // Smooth out the progress line
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div ref={containerRef} className={cn("w-full py-10 relative", className)}>

            {/* --- Header / Context --- */}
            <div className="mb-10 text-center">
                <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#00F5F1]"
                >
                </motion.h3>
            </div>

            {/* --- Timeline Container --- */}
            <div className="relative flex flex-col md:flex-row items-stretch md:items-start justify-between gap-8 md:gap-4 px-2 md:px-6">

                {/* --- BACKGROUND LINE (Gray/Base) --- */}
                {/* Desktop: Horizontal */}
                <div className="absolute top-[32px] left-12 right-12 h-[2px] bg-white/10 hidden md:block" />
                {/* Mobile: Vertical */}
                <div className="absolute left-[23px] top-10 bottom-0 w-[2px] bg-white/10 block md:hidden" />

                {/* --- ACTIVE PROGRESS LINE (Cyan) --- */}
                {/* Desktop: Animated Width */}
                <motion.div
                    style={{ scaleX, transformOrigin: "left" }}
                    className="absolute top-[32px] left-12 right-12 h-[2px] bg-[#00F5F1] hidden md:block shadow-[0_0_10px_#00F5F1]"
                />
                {/* Mobile: Vertical Progress (Optional - keeping simple for now or use scaleY) */}

                {/* --- STAGES MAPPING --- */}
                {stages.map((stage, index) => {
                    const icons = [School, TrendingUp, Rocket];
                    const Icon = icons[index % icons.length]; // Fallback icons

                    return (
                        <div key={index} className="relative z-10 flex flex-row md:flex-col items-start md:items-center gap-4 md:gap-0 flex-1 group">

                            {/* 1. NODE (Circle) */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, type: "spring" }}
                                className="relative flex-shrink-0 mt-1 md:mt-0"
                            >
                                {/* Glow Effect behind */}
                                <div className="absolute inset-0 bg-[#00F5F1] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full" />

                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-black border-2 border-[#00F5F1]/30 group-hover:border-[#00F5F1] flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(0,245,241,0.1)] group-hover:shadow-[0_0_30px_rgba(0,245,241,0.4)] md:mb-6">
                                    {stage.icon ? stage.icon : <Icon className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:text-[#00F5F1] transition-colors" />}
                                </div>

                                {/* Connector dot for Mobile (on the line) */}
                                <div className="md:hidden absolute -left-[29px] top-1/2 -translate-y-1/2 w-3 h-3 bg-[#00F5F1] rounded-full shadow-[0_0_10px_#00F5F1]" />
                            </motion.div>

                            {/* 2. CONTENT CARD */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 + 0.1 }}
                                className="flex-1 w-full"
                            >
                                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-colors relative overflow-hidden group/card shadow-lg hover:border-[#00F5F1]/30 flex flex-col h-full">
                                    {/* Top Accent */}
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00F5F1]/50 to-transparent opacity-50 group-hover/card:opacity-100 transition-opacity" />

                                    <div className="mb-3">
                                        <h4 className="text-[#00F5F1] font-bold uppercase tracking-widest text-[10px] mb-1">
                                            Etapa {index + 1}
                                        </h4>
                                        <h3 className="text-white font-bold text-sm md:text-base leading-tight">
                                            {stage.name}
                                        </h3>
                                    </div>

                                    {/* Course Chips */}
                                    {stage.courses && stage.courses.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-auto">
                                            {stage.courses.map((course, cIdx) => (
                                                <button
                                                    key={cIdx}
                                                    onClick={() => navigate(`/academia/${course.id}`)}
                                                    className="px-2 py-1 rounded bg-white/5 hover:bg-[#00F5F1] text-xs font-medium text-gray-300 hover:text-black border border-white/10 hover:border-[#00F5F1] transition-all duration-200 text-left truncate max-w-full"
                                                    title={course.title}
                                                >
                                                    {course.title}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Connector Line for Desktop (Arrow) - Optional */}
                            {index < stages.length - 1 && (
                                <div className="hidden md:block absolute top-[32px] -right-[50%] w-full h-[2px] pointer-events-none" />
                            )}
                        </div>
                    );
                })}

                {/* --- END NODE (Certification) --- */}
                <div className="relative z-10 flex flex-col items-center flex-1">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: stages.length * 0.1, type: "spring", bounce: 0.5 }}
                        className="relative mt-1 md:mt-0"
                    >
                        <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full animate-pulse" />
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-yellow-600/20 to-black border-2 border-yellow-500/50 flex items-center justify-center md:mb-6 relative z-10 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                            <Award className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: stages.length * 0.2 + 0.3 }}
                        className="text-center mt-4 md:mt-0"
                    >
                        <div className="bg-yellow-500/10 border border-yellow-500/20 px-6 py-4 rounded-xl backdrop-blur-sm">
                            <h4 className="text-yellow-400 font-bold text-sm uppercase tracking-wider mb-1">
                                Meta Final
                            </h4>
                            <p className="text-white font-bold text-base">
                                {incentive}
                            </p>
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
};
