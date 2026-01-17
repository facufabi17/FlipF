import { Course } from '../../types';

export const COURSE_MARKETING: Course = {
    id: 'c1',
    title: 'Plan de Marketing Digital',
    description: 'Estrategias Efectivas que Impulsen el Crecimiento. Aprende a estructurar campañas desde cero.',
    price: 30000,
    category: 'Marketing',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    modules: [
        {
            id: 'mod1',
            title: 'Módulo 1: Elaboración de un Plan de Marketing',
            lessons: [
                { 
                    id: 'l1-1',
                    title: 'Concepto y beneficios', 
                    duration: '45 min',
                    videoUrl: 'https://www.youtube.com/embed/ScMzIvxBSi4?si=placeholder', 
                    textContent: `
                        <p>Para desarrollar un plan efectivo, sigue estos pasos críticos:</p>
                        <ul class="list-disc pl-5 space-y-2 mt-4">
                            <li><strong>Análisis de Situación:</strong> ¿Dónde estamos hoy?</li>
                            <li><strong>Objetivos:</strong> ¿Dónde queremos estar? (SMART)</li>
                            <li><strong>Estrategia:</strong> ¿Cómo llegaremos allí?</li>
                            <li><strong>Tácticas:</strong> Acciones específicas.</li>
                        </ul>
                    `,
                    description: 'Analizaremos los pilares fundamentales de una estrategia digital exitosa.',
                    resources: [{ title: 'PDF', url: '#', type: 'pdf' }]
                },
                { 
                    id: 'l1-2',
                    title: 'Pasos para desarrollar un plan (Lectura)', 
                    duration: '15 min read',
                    // Ejemplo de lección SOLO TEXTO
                    textContent: `
                        <p>Para desarrollar un plan efectivo, sigue estos pasos críticos:</p>
                        <ul class="list-disc pl-5 space-y-2 mt-4">
                            <li><strong>Análisis de Situación:</strong> ¿Dónde estamos hoy?</li>
                            <li><strong>Objetivos:</strong> ¿Dónde queremos estar? (SMART)</li>
                            <li><strong>Estrategia:</strong> ¿Cómo llegaremos allí?</li>
                            <li><strong>Tácticas:</strong> Acciones específicas.</li>
                        </ul>
                    `,
                    description: 'Guía de lectura rápida sobre la estructura del plan.',
                    resources: []
                },
                {
                    id: 'l1-3',
                    title: 'Presentación Estratégica',
                    duration: '20 min',
                    // Ejemplo de lección con GOOGLE SLIDES
                    // Para obtener el link: Archivo > Compartir > Publicar en la web > Insertar/Embed
                    presentationUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vR6xL9k.../embed?start=false&loop=false&delayms=3000',
                    description: 'Revisa la presentación oficial del curso paso a paso.',
                    resources: []
                }
            ],
            quiz: {
                id: 'q1',
                title: 'Examen de Fundamentos',
                passingScore: 2,
                questions: [
                    {
                        id: 'q1-1',
                        question: '¿Cuál es el primer paso para un plan de marketing?',
                        options: ['Crear anuncios', 'Definir el Buyer Persona', 'Contratar influencers'],
                        correctAnswer: 1
                    },
                    {
                        id: 'q1-2',
                        question: '¿Qué significa ROI?',
                        options: ['Retorno de Inversión', 'Riesgo de Operación Interna', 'Red Orgánica Internacional'],
                        correctAnswer: 0
                    },
                    {
                        id: 'q1-3',
                        question: 'El Marketing Digital reemplaza al tradicional completamente.',
                        options: ['Verdadero', 'Falso'],
                        correctAnswer: 1
                    }
                ]
            }
        },
        {
            id: 'mod2',
            title: 'Módulo 2: Identificar necesidades',
            lessons: [
                { 
                    id: 'l2-1',
                    title: 'Comprender al cliente', 
                    duration: '90 min',
                    videoUrl: 'https://www.youtube.com/embed/placeholder3',
                    description: 'La importancia de la empatía en el proceso de venta.',
                    resources: []
                }
            ],
            quiz: {
                id: 'q2',
                title: 'Examen de Cliente Ideal',
                passingScore: 1,
                questions: [
                    {
                        id: 'q2-1',
                        question: '¿Cuál es la mejor herramienta para investigar tendencias?',
                        options: ['Google Trends', 'Paint', 'Bloc de notas'],
                        correctAnswer: 0
                    }
                ]
            }
        }
    ]
};