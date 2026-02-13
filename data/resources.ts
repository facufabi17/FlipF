import { PaidResource } from '../types';

export interface FreeResource {
    id: string;
    slug: string;
    title: string;
    description: string;
    type: 'PDF' | 'Notion' | 'Excel' | 'Template' | 'Ebook' | 'System';
    image: string;
    downloadUrl: string;
}

export const FREE_RESOURCES: FreeResource[] = [
    {
        id: 'fr-buyer-persona',
        slug: 'buyer-persona',
        title: 'Hoja de Trabajo de Buyer Persona',
        description: 'Define quién es tu comprador perfecto en 15 minutos.',
        type: 'PDF',
        image: '/img-recursos-free/fr-buyer-persona.webp',
        downloadUrl: 'https://docs.google.com/document/d/1example_link_to_drive/edit?usp=sharing'
    },
    {
        id: 'fr-content-dashboard',
        slug: 'content-dashboard',
        title: 'Dashboard de Contenidos',
        description: 'Organiza tu calendario editorial con esta plantilla de Notion.',
        type: 'Notion',
        image: '/img-recursos-free/fr-content-dashboard.webp',
        downloadUrl: 'https://www.notion.so/example_link_to_notion'
    },
    {
        id: 'fr-roi-calculator',
        slug: 'roi-calculator',
        title: 'Calculadora de ROI',
        description: 'Descubre cuánto realmente ganas por proyecto.',
        type: 'Excel',
        image: '/img-recursos-free/fr-roi-calculator.webp',
        downloadUrl: 'https://docs.google.com/spreadsheets/d/1example_link_to_excel/edit?usp=sharing'
    }
];


export const PAID_RESOURCES: PaidResource[] = [
    {
        id: 'res-marketing-ebook',
        title: 'Ebook de Plan de Marketing Digital',
        description: 'Este ebook ha sido diseñado con el propósito de presentar todos los pasos que una empresa debe tener en cuenta para crear un plan de marketing digital efectivo en redes sociales.',
        price: 8500,
        image: '/img-recursos-pago/res-marketing-ebook.webp',
        category: 'Marketing',
        type: 'Ebook',
        downloadUrl: '#' // En un caso real, esto sería un link seguro
    },
    {
        id: 'res-notion-system',
        title: 'Sistemas en Notion para Agencias',
        description: 'Organiza tu agencia con este dashboard todo en uno. Incluye gestión de proyectos, CRM y calendario de contenidos.',
        price: 15000,
        image: '/img-recursos-pago/res-notion-system.webp',
        category: 'Sistemas',
        type: 'System',
        downloadUrl: '#'
    },
    {
        id: 'res-funnel-template',
        title: 'Plantilla de Funnel de Alta Conversión',
        description: 'Plantilla JSON importable para constructores visuales. Diseñada para captación de leads cualificados.',
        price: 12000,
        image: '/img-recursos-pago/res-funnel-template.webp',
        category: 'Operaciones',
        type: 'Template',
        downloadUrl: '#'
    }
];