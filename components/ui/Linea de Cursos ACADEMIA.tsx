"use client";

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
    const lineRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (containerRef.current && lineRef.current) {
            gsap.to(lineRef.current, {
                scaleX: 1,
                ease: window.innerWidth < 768 ? "none" : "power1.inOut",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top center",
                    end: "bottom center",
                    scrub: 1
                }
            });

            // Animaciones de los nodos de la línea
            const nodes = gsap.utils.toArray('.timeline-node', containerRef.current);
            nodes.forEach((node: any, idx: number) => {
                gsap.fromTo(node,
                    { scale: 0, opacity: 0 },
                    {
                        scale: 1,
                        opacity: 1,
                        duration: 0.6,
                        ease: "back.out(1.5)",
                        scrollTrigger: {
                            trigger: node,
                            start: "top 80%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });

            // Animaciones de las tarjetas
            const cards = gsap.utils.toArray('.timeline-card', containerRef.current);
            cards.forEach((card: any, idx: number) => {
                gsap.fromTo(card,
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });
        }

    }, []);

    return (
        <div ref={containerRef} className={cn("w-full py-10 relative", className)}>

            {/* --- Header / Context --- */}
            <div className="mb-10 text-center">
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#00F5F1] timeline-card">
                </h3>
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
                <div
                    ref={lineRef}
                    style={{ transformOrigin: "left", transform: "scaleX(0)" }}
                    className="absolute top-[32px] left-12 right-12 h-[2px] bg-tech hidden md:block shadow-[0_0_10px_#00F5F1]"
                />
                {/* Mobile: Vertical Progress (Optional - keeping simple for now or use scaleY) */}

                {/* --- STAGES MAPPING --- */}
                {stages.map((stage, index) => {
                    const icons = [School, TrendingUp, Rocket];
                    const Icon = icons[index % icons.length]; // Fallback icons

                    return (
                        <div key={index} className="relative z-10 flex flex-row md:flex-col items-start md:items-center gap-4 md:gap-0 flex-1 group">

                            {/* 1. NODE (Circle) */}
                            <div className="relative flex-shrink-0 mt-1 md:mt-0 timeline-node">
                                {/* Glow Effect behind */}
                                <div className="absolute inset-0 bg-tech blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full" />

                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-black border-2 border-tech/30 group-hover:border-tech flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(0,245,241,0.1)] group-hover:shadow-[0_0_30px_rgba(0,245,241,0.4)] md:mb-6">
                                    {stage.icon ? stage.icon : <Icon className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:text-tech transition-colors" />}
                                </div>

                                {/* Connector dot for Mobile (on the line) */}
                                <div className="md:hidden absolute -left-[29px] top-1/2 -translate-y-1/2 w-3 h-3 bg-tech rounded-full shadow-[0_0_10px_#00F5F1]" />
                            </div>

                            {/* 2. CONTENT CARD */}
                            <div className="flex-1 w-full timeline-card">
                                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-colors relative overflow-hidden group/card shadow-lg hover:border-tech/30 flex flex-col h-full">
                                    {/* Top Accent */}
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00F5F1]/50 to-transparent opacity-50 group-hover/card:opacity-100 transition-opacity" />

                                    <div className="mb-3">
                                        <h4 className="text-tech font-bold uppercase tracking-widest text-xs mb-1">
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
                                                    className="px-2 py-1 rounded bg-white/5 hover:bg-tech text-xs font-medium text-gray-300 hover:text-black border border-white/10 hover:border-tech transition-all duration-200 text-left truncate max-w-full"
                                                    title={course.title}
                                                >
                                                    {course.title}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Connector Line for Desktop (Arrow) - Optional */}
                            {index < stages.length - 1 && (
                                <div className="hidden md:block absolute top-[32px] -right-[50%] w-full h-[2px] pointer-events-none" />
                            )}
                        </div>
                    );
                })}

                {/* --- END NODE (Certification) --- */}
                <div className="relative z-10 flex flex-col items-center flex-1">
                    <div className="relative mt-1 md:mt-0 timeline-node">
                        <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full animate-pulse" />
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-yellow-600/20 to-black border-2 border-yellow-500/50 flex items-center justify-center md:mb-6 relative z-10 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                            <Award className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]" />
                        </div>
                    </div>

                    <div className="text-center mt-4 md:mt-0 timeline-card">
                        <div className="bg-yellow-500/10 border border-yellow-500/20 px-6 py-4 rounded-xl backdrop-blur-sm">
                            <h4 className="text-yellow-400 font-bold text-sm uppercase tracking-wider mb-1">
                                Meta Final
                            </h4>
                            <p className="text-white font-bold text-base">
                                {incentive}
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
