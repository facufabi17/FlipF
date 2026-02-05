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
        id: 'fr-avatar-worksheet',
        slug: 'avatar-worksheet',
        title: 'Hoja de Trabajo del Avatar',
        description: 'Define quién es tu comprador perfecto en 15 minutos.',
        type: 'PDF',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5CM7rICU3OPbJP2WY94Ey3XzO0oztRZ4GkulbTgDk5S4B2WCl3vbvqytzGLxBkdrwbHG4Ro0um1_e38oIGfTiupXdFSN1YZBjLG1lf8D6iRwvjBrlrconzfFNx_IaB1rCBCO4DUqzsPvbxAsi3Q9gPGflhS5qL87QYK2m0FzdNpsQ9-VJHGzzEfIP8eW0Tw9WQJmIzTinZxVMYAqgualf0QZ5-Fj0E9ydtbivn2yWGfoFcn7Mi3y3J9N0-7oJULtbnevCMMk-rII',
        downloadUrl: 'https://docs.google.com/document/d/1example_link_to_drive/edit?usp=sharing'
    },
    {
        id: 'fr-content-dashboard',
        slug: 'content-dashboard',
        title: 'Dashboard de Contenidos',
        description: 'Organiza tu calendario editorial con esta plantilla de Notion.',
        type: 'Notion',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZPFBULjM_lizrfkE1khtGAySyqmOWCRMeBOUT9jUJn4wqZwZnIVEvq3GU111BYMjA7yWkdzKNmJXiph-bOQzKk2HfzjBRZH3oxfnHWLpZ6kjBv3Sj4MSk6M-GWW4UwnWMjw5VsIm0C0MUAj8EhQhdSBUisLtiaH64UEIR7XIUKb5X98lRD8_c5KThWVoF2CNpgTvnX6Au6W3TqDmE7mx0ObOfepZcQOVbSwvGHHjd_CZ0VvEpYPJVghs-o37wrCveSxMuWpbcraM',
        downloadUrl: 'https://www.notion.so/example_link_to_notion'
    },
    {
        id: 'fr-roi-calculator',
        slug: 'roi-calculator',
        title: 'Calculadora de ROI',
        description: 'Descubre cuánto realmente ganas por proyecto.',
        type: 'Excel',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBs9_5l2SQEqk35_RH9Eqkc0RvAQjPehJ19Huu1AngWiK4p2mZHkXJ4WKmoDeob5cR_GLymfhnBSidv0GzF53CKo2STUEnyL0yuW9H5TZ2CuuIZPh9IygYRrYo3GDLm_3Ns-FayRk5UAffg4_aNV_imMBV89ZPtYlPJaLYsAXzov2QPqJu0Z6g_PZPFO2JRU5cQvM3dUv8bgVog2CHOQMrvmq4mca8UoqWTAsG_8B6jvuzcBMnpDUQK21mrGyAgf3VxblsPAE9k0fc',
        downloadUrl: 'https://docs.google.com/spreadsheets/d/1example_link_to_excel/edit?usp=sharing'
    }
];


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