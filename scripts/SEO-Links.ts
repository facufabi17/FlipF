import fs from 'fs';
import path from 'path';

// Importar los cursos (necesitamos tsx o ts-node para ejecutar esto en build)
import { COURSES } from '../data/courses';
import { staticSeoRoutes, getSeoForPath } from '../data/data-SEO';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const INDEX_HTML = path.join(DIST_DIR, 'index.html');

// Aquí configuras tu dominio oficial
const BASE_URL = 'https://flip-f.vercel.app'; 

// 2. FUNCIÓN PARA PROCESAR EL HTML
function generatePageHtml(baseHtml: string, title: string, description: string,  imageUrl: string, urlPath: string) {
    const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${BASE_URL}${imageUrl}`;
    const fullUrl = `${BASE_URL}${urlPath}`;

    let html = baseHtml
        .replace(/<title>[\s\S]*?<\/title>/gi, `<title>${title}</title>`)
        .replace(/<meta[^>]*name="description"[^>]*>/gi, `<meta name="description" content="${description}">`)
        .replace(/<meta[^>]*property="og:title"[^>]*>/gi, `<meta property="og:title" content="${title}">`)
        .replace(/<meta[^>]*property="og:description"[^>]*>/gi, `<meta property="og:description" content="${description}">`)
        .replace(/<meta[^>]*property="og:image"[^>]*>/gi, `<meta property="og:image" content="${fullImageUrl}">`)
        .replace(/<meta[^>]*property="og:url"[^>]*>/gi, `<meta property="og:url" content="${fullUrl}">`);

    // Añadir URL si no existe (algunas de tus páginas lo requerían)
    if (!html.includes('og:url')) {
        html = html.replace('</head>', `  <meta property="og:url" content="${fullUrl}">\n</head>`);
    }

    // Añadir Size para arreglar los "Image Cannot Be Rendered" de Facebook (Aconsejable 1200x630 o genérico fuerte)
    if (!html.includes('og:image:width')) {
        html = html.replace('</head>', `  <meta property="og:image:width" content="1200">\n  <meta property="og:image:height" content="630">\n</head>`);
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
    const staticPaths = Object.keys(staticSeoRoutes);
    for (const routePath of staticPaths) {
        if (routePath === '/') continue; // El index ya se sirve de /
        
        const routeData = staticSeoRoutes[routePath];
        const html = generatePageHtml(baseHtml, routeData.title, routeData.description, routeData.image, routePath);
        
        // Crear las subcarpetas si es necesario (ej: /terminos o /checkout)
        const outputDir = path.join(DIST_DIR, routePath.substring(1));
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        fs.writeFileSync(path.join(outputDir, 'index.html'), html);
        console.log(`✅ Creada ruta estática: ${routePath}`);
    }

    // B. Procesar RUTAS DINÁMICAS (Cursos de Academia)
    for (const course of COURSES) {
        // Ruta 1: Detalles del curso
        const detailsPath = `/academia/${course.id}`;
        
        // --- MEJORA SEO PARA CURSOS ---
        // 1. Título: Añadir prefijo de "Curso Online" ayuda a que la persona entienda de qué trata el link al instante.
        const seoTitle = `Curso Online: ${course.title} | Academia Flip`;
        // 2. Descripción: Reforzar el "Call to Action" y contexto si la descripción original es corta.
        const seoDescription = `Aprende: ${course.description} Forma parte de nuestra Academia Digital.`;
        
        const detailsHtml = generatePageHtml(baseHtml, seoTitle, seoDescription, course.image, detailsPath);
        
        const detailsDir = path.join(DIST_DIR, 'academia', course.id);
        if (!fs.existsSync(detailsDir)) {
             fs.mkdirSync(detailsDir, { recursive: true });
        }
        fs.writeFileSync(path.join(detailsDir, 'index.html'), detailsHtml);

        // Ruta 2: Aula Virtual (opcional, para cuando comparten link de estudio)
        const playerPath = `/aula-virtual/${course.id}`;
        const playerHtml = generatePageHtml(baseHtml, `${course.title} | Aula Virtual | Flip`, `Estudiando el curso ${course.title} en Flip`, course.image, playerPath);
        
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
