import { Course } from '../../types';

export const COURSE_OPERATIONS: Course = {
    id: 'c2',
    title: 'Automatización de Ventas',
    description: 'Construye embudos de venta que funcionen en piloto automático las 24 horas.',
    price: 45000,
    category: 'Operaciones',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    modules: [
        {
            id: 'mod-sales-1',
            title: 'Módulo 1: La Psicología del Funnel',
            lessons: [
                { 
                    id: 'ls1-1',
                    title: 'Intro a Embudos de Venta', 
                    duration: '30 min',
                    videoUrl: 'https://www.youtube.com/embed/placeholder_sales1',
                    description: '¿Qué es un funnel? Entiende el viaje del cliente.',
                    resources: []
                }
            ],
            quiz: {
                id: 'q-sales-1',
                title: 'Examen de Embudos',
                passingScore: 1,
                questions: [
                    { id: 'qs1', question: '¿Un funnel es lineal?', options: ['Sí', 'No siempre'], correctAnswer: 1 }
                ]
            }
        }
    ]
};