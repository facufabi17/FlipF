import fs from 'fs';
import path from 'path';

// Importar los cursos (necesitamos tsx o ts-node para ejecutar esto en build)
import { COURSES } from '../data/courses';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const INDEX_HTML = path.join(DIST_DIR, 'index.html');

// Aquí configuras tu dominio oficial
const BASE_URL = 'https://flip-f.vercel.app'; 

// 1. DICCIONARIO DE RUTAS ESTÁTICAS
// (Todas las páginas de tu sitio que NO son un curso específico)
const staticRoutes = [
    { path: '/', title: 'Flip | Agencia de Marketing Digital', description: 'Agencia de Marketing Digital. Transformación de negocios y entrenamiento de expertos con estrategias digitales de alto impacto.', image: '/Meta-img.png' },
    { path: '/nosotros', title: 'Sobre Nosotros | Flip-F', description: 'Conoce más acerca de Flip-F, nuestra misión, visión y equipo de trabajo.', image: '/Meta-img.png' },
    { path: '/recursos-gratis', title: 'Recursos Gratuitos | Flip-F', description: 'Descarga herramientas, guías y recursos gratuitos para potenciar tu marca.', image: '/Meta-img.png' },
    { path: '/recursos-pago', title: 'Recursos Premium | Flip-F', description: 'Accede a plantillas, ebooks y herramientas exclusivas de Flip-F.', image: '/Meta-img.png' },
    { path: '/academia', title: 'Academia | Flip-F', description: 'Descubre nuestros cursos de marketing digital, análisis de datos e inteligencia artificial.', image: '/Meta-img.png' },
    { path: '/consultas', title: 'Consultorías | Flip', description: 'Reserva tu consultoría personalizada con nuestros expertos.', image: '/Meta-img.png' },
    { path: '/login', title: 'Iniciar Sesión | Flip-F', description: 'Ingresa a tu cuenta de Flip-F para acceder a tu contenido.', image: '/Meta-img.png' },
    { path: '/register', title: 'Registro | Flip-F', description: 'Crea tu cuenta en Flip-F para formarte, descargar recursos y más.', image: '/Meta-img.png' },
    { path: '/ayuda', title: 'Ayuda | Flip-F', description: 'Centro de ayuda y soporte técnico de Flip-F.', image: '/Meta-img.png' },
    { path: '/privacidad', title: 'Políticas de Privacidad | Flip-F', description: 'Políticas de privacidad y tratamiento de datos de Flip-F.', image: '/Meta-img.png' },
    { path: '/terminos', title: 'Términos y Condiciones | Flip-F', description: 'Lee los términos y condiciones de Flip-F.', image: '/Meta-img.png' },
    { path: '/checkout', title: 'Finalizar Compra | Flip-F', description: 'Proceso de pago y facturación seguro de Flip-F.', image: '/Meta-img.png' },
    { path: '/perfil', title: 'Mi Perfil | Flip-F', description: 'Panel de control y preferencias de usuario.', image: '/Meta-img.png' }
];

// 2. FUNCIÓN PARA PROCESAR EL HTML
function generatePageHtml(baseHtml: string, title: string, description: string,  imageUrl: string, urlPath: string) {
    const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${BASE_URL}${imageUrl}`;
    const fullUrl = `${BASE_URL}${urlPath}`;

    let html = baseHtml
        .replace(/<title>.*?<\/title>/gi, `<title>${title}</title>`)
        .replace(/<meta name="description" content="[^"]*">/gi, `<meta name="description" content="${description}">`)
        .replace(/<meta property="og:title" content="[^"]*">/gi, `<meta property="og:title" content="${title}">`)
        .replace(/<meta property="og:description" content="[^"]*">/gi, `<meta property="og:description" content="${description}">`)
        .replace(/<meta property="og:image" content="[^"]*">/gi, `<meta property="og:image" content="${fullImageUrl}">`)
        .replace(/<meta property="og:url" content="[^"]*">/gi, `<meta property="og:url" content="${fullUrl}">`);

    // Añadir URL si no existe
    if (!html.includes('og:url')) {
        html = html.replace('</head>', `  <meta property="og:url" content="${fullUrl}">\n</head>`);
    }

    // Asegurar Twitter Cards
    if (!html.includes('twitter:card')) {
        html = html.replace('</head>', `  <meta name="twitter:card" content="summary_large_image">\n</head>`);
        html = html.replace('</head>', `  <meta name="twitter:title" content="${title}">\n</head>`);
        html = html.replace('</head>', `  <meta name="twitter:description" content="${description}">\n</head>`);
        html = html.replace('</head>', `  <meta name="twitter:image" content="${fullImageUrl}">\n</head>`);
    }

    return html;
}

// 3. FUNCIÓN PRINCIPAL DE GENERACIÓN
async function generateSeoPages() {
    console.log('🚀 Iniciando Generación de Páginas SEO Estáticas (SSG)...');

    if (!fs.existsSync(INDEX_HTML)) {
        console.error('❌ Error: No se encontró index.html en /dist. Debes ejecutar "npm run build" o "vite build" primero.');
        process.exit(1);
    }

    const baseHtml = fs.readFileSync(INDEX_HTML, 'utf8');

    // A. Procesar RUTAS ESTÁTICAS
    for (const route of staticRoutes) {
        if (route.path === '/') continue; // El index ya se sirve de /
        
        const html = generatePageHtml(baseHtml, route.title, route.description, route.image, route.path);
        
        // Crear las subcarpetas si es necesario (ej: /terminos o /checkout)
        const outputDir = path.join(DIST_DIR, route.path.substring(1));
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        fs.writeFileSync(path.join(outputDir, 'index.html'), html);
        console.log(`✅ Creada ruta estática: ${route.path}`);
    }

    // B. Procesar RUTAS DINÁMICAS (Cursos de Academia)
    for (const course of COURSES) {
        // Ruta 1: Detalles del curso
        const detailsPath = `/academia/${course.id}`;
        const detailsHtml = generatePageHtml(baseHtml, `${course.title} | Flip-F`, course.description, course.image, detailsPath);
        
        const detailsDir = path.join(DIST_DIR, 'academia', course.id);
        if (!fs.existsSync(detailsDir)) {
             fs.mkdirSync(detailsDir, { recursive: true });
        }
        fs.writeFileSync(path.join(detailsDir, 'index.html'), detailsHtml);

        // Ruta 2: Aula Virtual (opcional, para cuando comparten link de estudio)
        const playerPath = `/aula-virtual/${course.id}`;
        const playerHtml = generatePageHtml(baseHtml, `${course.title} | Aula Virtual | Flip-F`, `Estudiando el curso ${course.title} en Flip-F`, course.image, playerPath);
        
        const playerDir = path.join(DIST_DIR, 'aula-virtual', course.id);
        if (!fs.existsSync(playerDir)) {
             fs.mkdirSync(playerDir, { recursive: true });
        }
        fs.writeFileSync(path.join(playerDir, 'index.html'), playerHtml);

        console.log(`📚 Generados archivos para el curso: ${course.title}`);
    }

    console.log('✨ Generación SSG Completada Vercel servirá estos archivos instantáneamente a los Crawlers e indexadores web.');
}

generateSeoPages();
