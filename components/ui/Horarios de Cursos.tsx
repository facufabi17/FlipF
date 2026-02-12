import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase'; // Ajusta la ruta si es necesario (e.g. ../../lib/supabaseClient)
import { CourseSchedule } from '../../types';

interface ScheduleSelectorProps {
    courseId: string;
    onSelect: (schedule: CourseSchedule | null) => void;
    selectedScheduleId?: string;
    onSchedulesFound?: (hasSchedules: boolean) => void;
    mode?: 'pills' | 'dropdown';
}

const ScheduleSelector: React.FC<ScheduleSelectorProps> = ({ courseId, onSelect, selectedScheduleId, onSchedulesFound, mode = 'pills' }) => {
    const [schedules, setSchedules] = useState<CourseSchedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                setLoading(true);
                // Asegúrate de que la tabla 'course_schedules' tenga RLS habilitado o sea pública para lectura
                const { data, error } = await supabase
                    .from('course_schedules')
                    .select('*')
                    .eq('course_id', courseId)
                    .gt('capacity', 0)
                    .order('day_of_week');

                if (error) throw error;

                const foundSchedules = data || [];
                setSchedules(foundSchedules);

                if (onSchedulesFound) {
                    onSchedulesFound(foundSchedules.length > 0);
                }
            } catch (err) {
                console.error('Error fetching schedules:', err);
                setError('No se pudieron cargar los horarios disponibles.');
                if (onSchedulesFound) onSchedulesFound(false);
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchSchedules();
        }
    }, [courseId]);

    if (loading) return <div className="text-sm text-gray-500 animate-pulse my-4">Cargando horarios...</div>;
    if (error) return <div className="text-sm text-red-400 my-4">{error}</div>;
    if (schedules.length === 0) return null;

    if (mode === 'dropdown') {
        const selected = schedules.find(s => s.id === selectedScheduleId);

        return (

            <div className="flex items-center gap-3 relative group">
                <div className="relative flex-1">
                    <select
                        value={selectedScheduleId || ''}
                        onChange={(e) => {
                            const schedule = schedules.find(s => s.id === e.target.value) || null;
                            onSelect(schedule);
                        }}
                        className="appearance-none w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:border-[#00F5F1] transition-colors cursor-pointer text-white font-medium"
                    >
                        <option value="" disabled className="bg-surface-dark text-gray-500">Seleccionar horario...</option>
                        {schedules.map(schedule => (
                            <option key={schedule.id} value={schedule.id} className="bg-surface-dark text-white">
                                {schedule.day_of_week} {schedule.start_time.slice(0, 5)}hs - {schedule.end_time.slice(0, 5)}hs
                            </option>
                        ))}
                    </select>

                    {/* Icono de la flecha del select */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400 group-hover:text-[#00F5F1] transition-colors">
                        <span className="material-symbols-outlined text-sm">expand_more</span>
                    </div>
                </div>

                {/* Mensaje de confirmación al lado */}
                {selected && (
                    <div className="text-xs text-[#00F5F1] flex items-center gap-1 whitespace-nowrap animate-fade-in">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        <span>Horario confirmado</span>
                    </div>
                )}
            </div>
        );
    }

    // Default: Pills mode
    return (
        <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00F5F1] text-base">calendar_month</span>
                Elige tu horario <span className="text-[#00F5F1]">*</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {schedules.map((schedule) => {
                    const isSelected = selectedScheduleId === schedule.id;
                    const startTime = schedule.start_time.slice(0, 5); // HH:MM
                    const endTime = schedule.end_time.slice(0, 5);     // HH:MM

                    return (
                        <button
                            key={schedule.id}
                            onClick={() => onSelect(isSelected ? null : schedule)}
                            className={`
                                relative px-4 py-3 rounded-xl text-sm font-medium border text-left transition-all duration-200 group
                                ${isSelected
                                    ? 'bg-[#00F5F1]/10 border-[#00F5F1] text-[#00F5F1] shadow-[0_0_15px_rgba(0,245,241,0.2)]'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20 hover:text-white'
                                }
                            `}
                        >
                            <span className="block font-bold mb-1">{schedule.day_of_week}</span>
                            <span className="text-xs opacity-80 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[10px]">schedule</span>
                                {startTime} - {endTime}
                            </span>
                        </button>
                    );
                })}
            </div>
            {!selectedScheduleId && (
                <p className="text-xs text-[#00F5F1]/70 mt-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">info</span>
                    Debes seleccionar un horario para continuar.
                </p>
            )}
        </div>
    );
};

export default ScheduleSelector;
