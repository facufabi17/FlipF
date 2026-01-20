import { Course } from '../../types';

export const COURSE_LEADERSHIP: Course = {
    id: 'c3',
    title: 'Liderazgo de Equipos',
    description: 'Aprende a delegar y gestionar equipos remotos de alto rendimiento.',
    price: 35000,
    category: 'Gestión',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
    modules: [
        {
            id: 'mod-lead-1',
            title: 'Módulo 1: Cultura Organizacional',
            lessons: [
                { 
                    id: 'll1-1',
                    title: 'Cultura de Empresa', 
                    duration: '40 min',
                    videoUrl: 'https://www.youtube.com/embed/placeholder_lead1',
                    description: 'Cómo establecer valores y misión.',
                    resources: [{ title: 'PDF', url: '#', type: 'pdf' }]
                }
            ]
        }
    ]
};