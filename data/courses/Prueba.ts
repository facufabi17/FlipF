import { Course } from '../../types';

export const COURSE_OPERATIONS: Course = {
    id: 'c2',
    title: 'Prueba',
    description: 'Prueba',
    price: 0,
    category: 'Operaciones',
    level: 'Intermedio',
    includes: 'Incluye 3 Plantillas + 1 Prompt IA',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    modules: [
        {
            id: 'mod-sales-1',
            title: 'Módulo 1: Prueba',
            lessons: [
                {
                    id: 'ls1-1',
                    title: 'Prueba',
                    duration: '30 min',
                    videoUrl: 'https://www.youtube.com/embed/placeholder_sales1',
                    description: 'Prueba',
                    resources: []
                }
            ],
            quiz: {
                id: 'q-sales-1',
                title: 'Examen',
                passingScore: 1,
                questions: [
                    { id: 'qs1', question: 'Pregunta de examen', options: ['Este', 'NO'], correctAnswer: 1 }
                ]
            }
        }
    ]
};