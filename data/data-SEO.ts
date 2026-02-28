import { COURSES } from './courses';

// Tipo de las Etiquetas SEO base
export interface SeoRouteConfig {
    title: string;
    description: string;
    image: string;
}

// 1. DICCIONARIO STATIC SEO (ÚNICO PUNTO DE EDICIÓN PARA RUTAS FIJAS)
export const staticSeoRoutes: Record<string, SeoRouteConfig> = {
    '/': { 
        title: 'Flip | Agencia de Marketing Digital', 
        description: 'Agencia de Marketing Digital. Transformación de negocios y entrenamiento de expertos con estrategias digitales de alto impacto.', 
        image: '/Meta-img.png' 
    },
    '/nosotros': { 
        title: 'Sobre Nosotros | Flip', 
        description: 'Conoce más acerca de Flip, nuestra misión, visión y equipo de trabajo.', 
        image: '/Meta-img.png' 
    },
    '/recursos-gratis': { 
        title: 'Recursos Gratuitos | Flip', 
        description: 'Descarga herramientas, guías y recursos gratuitos para potenciar tu marca.', 
        image: '/Meta-img.png' 
    },
    '/recursos-pago': { 
        title: 'Recursos Premium | Flip', 
        description: 'Accede a plantillas, ebooks y herramientas exclusivas de Flip.', 
        image: '/Meta-img.png' 
    },
    '/academia': { 
        title: 'Academia | Flip', 
        description: 'Descubre nuestros cursos de marketing digital, análisis de datos e inteligencia artificial.', 
        image: '/Meta-img.png' 
    },
    '/consultas': { 
        title: 'Consultorías | Flip', 
        description: 'Reserva tu consultoría personalizada con nuestros expertos.', 
        image: '/Meta-img.png' 
    },
    '/login': { 
        title: 'Iniciar Sesión | Flip', 
        description: 'Ingresa a tu cuenta de Flip para acceder a tu contenido.', 
        image: '/Meta-img.png' 
    },
    '/register': { 
        title: 'Registro | Flip', 
        description: 'Crea tu cuenta en Flip para formarte, descargar recursos y más.', 
        image: '/Meta-img.png' 
    },
    '/ayuda': { 
        title: 'Ayuda | Flip', 
        description: 'Centro de ayuda y soporte técnico de Flip.', 
        image: '/Meta-img.png' 
    },
    '/privacidad': { 
        title: 'Políticas de Privacidad | Flip', 
        description: 'Políticas de privacidad y tratamiento de datos de Flip.', 
        image: '/Meta-img.png' 
    },
    '/terminos': { 
        title: 'Términos y Condiciones | Flip', 
        description: 'Lee los términos y condiciones de Flip.', 
        image: '/Meta-img.png' 
    },
    '/checkout': { 
        title: 'Finalizar Compra | Flip', 
        description: 'Proceso de pago y facturación seguro de Flip.', 
        image: '/Meta-img.png' 
    },
    '/perfil': { 
        title: 'Mi Perfil | Flip', 
        description: 'Panel de control y preferencias de usuario.', 
        image: '/Meta-img.png' 
    }
};

/**
 * 2. FUNCION DE CONSULTA UNIVERSAL
 * Esta función es la que proveerá el objeto SEO exacto a cualquier componente React o Script SSG
 * que le pase una ruta (pathname) por parámetro.
 */
export function getSeoForPath(pathName: string): SeoRouteConfig {
    // 2A. Búsqueda en Rutas Estáticas
    if (staticSeoRoutes[pathName]) {
        return staticSeoRoutes[pathName];
    }
    
    // 2B. Búsqueda Dinámica (Academia / Aula-Virtual)
    if (pathName.startsWith('/academia/') || pathName.startsWith('/aula-virtual/')) {
        const parts = pathName.split('/');
        const isPlayer = parts[1] === 'aula-virtual';
        const courseId = parts[2];
        
        const course = COURSES.find(c => c.id === courseId);
        
        if (course) {
            if (isPlayer) {
                 return {
                     title: `${course.title} | Aula Virtual | Flip`,
                     description: `Estudiando el curso ${course.title} en Flip`,
                     image: course.image
                 };
            } else {
                 return {
                     title: `Curso: ${course.title} | Academia Flip`,
                     description: `Aprende: ${course.description} Forma parte de nuestra Academia Digital.`,
                     image: course.image
                 };
            }
        }
    }
    
    // 3. Fallback General (Todo lo que no haga match es enviado al predeterminado del home)
    return staticSeoRoutes['/'];
}
