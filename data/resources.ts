import { PaidResource } from '../types';

export const PAID_RESOURCES: PaidResource[] = [
    {
        id: 'res-marketing-ebook',
        title: 'Ebook de Plan de Marketing Digital',
        description: 'Este ebook ha sido diseñado con el propósito de presentar todos los pasos que una empresa debe tener en cuenta para crear un plan de marketing digital efectivo en redes sociales.',
        price: 8500,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAO4PtfQLxIEsZkMOeleiR25birfyLNq59QPmHLWYM6t7-TwE0oZwAhAhCKNUh-onoIGb9v9cfbOPC_VSdse-ICRBUTiPdRQAQYBqLrr2T4LZ0TdH9zwf9o0xqFWHyCivPjTJa5TzbtoK-tLa4XNbkRqbATwGRxmPtSz_fCt1fETupWjRWkKi59wyjyC1uARvoCiNVEJDmP4zQR6E7Re66oWndcssy_P2zejEplCmsdQSTgw1hWVIyqq_AN1b1taRg4tpXFUdj80kg',
        category: 'Marketing',
        type: 'Ebook',
        downloadUrl: '#' // En un caso real, esto sería un link seguro
    },
    {
        id: 'res-notion-system',
        title: 'Sistemas en Notion para Agencias',
        description: 'Organiza tu agencia con este dashboard todo en uno. Incluye gestión de proyectos, CRM y calendario de contenidos.',
        price: 15000,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfr3zW3i0zpGNa6p6Dblha4fVV7XdFAslK4c9nASrisRGNersbsPWI1Aa9UxTfwYuxekSy_6rtIoN2RfvGWvZQ3PEVFD1vMK_sOM5nafUQ9ZsEmtNdfVy7ZPC9dBQUhNM1Je-SkJg_ABxT93IoN2QGgY7WLKirtSQZA6Th2ZEYTxl2bq2ljaE7JD-8PMPzyb7TP4KIpNkl-nUGrBSSAp3l8B_qOR9CSzV_DICbHZJfUmoNC7RUrx5opUBmJzxP7j2owAxnK8AuKkI',
        category: 'Sistemas',
        type: 'System',
        downloadUrl: '#'
    },
    {
        id: 'res-funnel-template',
        title: 'Plantilla de Funnel de Alta Conversión',
        description: 'Plantilla JSON importable para constructores visuales. Diseñada para captación de leads cualificados.',
        price: 12000,
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
        category: 'Operaciones',
        type: 'Template',
        downloadUrl: '#'
    }
];