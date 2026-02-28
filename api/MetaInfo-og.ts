import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

// Copia súper reducida de los cursos vitales para la metaetiqueta para evitar colapsar la Vercel Function importando componentes de React u otros Node modules complejos.
// Idealmente se leería de una BD o el import original siempre y cuando el transpiler de Vercel lo soporte bien. 
// Aquí extraemos lo vital por seguridad de ejecución.
import { COURSES } from '../data/courses';

export default function handler(req: VercelRequest, res: VercelResponse) {
    // 1. Obtener la ruta solicitada
    const urlPath = req.url || '/';

    // 2. Determinar si es un crawler
    const userAgent = req.headers['user-agent'] || '';
    const isBot = /bot|facebook|whatsapp|linkedin|twitter|slack|telegram|discord/i.test(userAgent);

    // 3. Determinar la URL absoluta base para imágenes
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'flip-f.vercel.app'; // Cambiar por tu dominio real de ser necesario
    const baseUrl = `${protocol}://${host}`;

    // 4. Valores Default (Los de index.html)
    let metaTitle = 'Flip | Agencia de Marketing Digital';
    let metaDescription = 'Agencia de Marketing Digital. Transformación de negocios y entrenamiento de expertos con estrategias digitales de alto impacto.';
    let metaImage = `${baseUrl}/Meta-img.png`;
    let metaUrl = `${baseUrl}${urlPath}`;

    // 5. Diccionario de Rutas Estáticas
    const routeMetaMap: Record<string, { title: string, description: string }> = {
        '/': { title: 'Flip | Agencia de Marketing Digital', description: 'Agencia de Marketing Digital. Transformación de negocios y entrenamiento de expertos con estrategias digitales de alto impacto.' },
        '/nosotros': { title: 'Sobre Nosotros | Flip-F', description: 'Conoce más acerca de Flip-F, nuestra misión, visión y equipo de trabajo.' },
        '/recursos-gratis': { title: 'Recursos Gratuitos | Flip-F', description: 'Descarga herramientas, guías y recursos gratuitos para potenciar tu marca.' },
        '/recursos-pago': { title: 'Recursos Premium | Flip-F', description: 'Accede a plantillas, ebooks y herramientas exclusivas de Flip-F.' },
        '/academia': { title: 'Academia | Flip-F', description: 'Descubre nuestros cursos de marketing digital, análisis de datos e inteligencia artificial.' },
        '/consultas': { title: 'Consultorías | Flip', description: 'Reserva tu consultoría personalizada con nuestros expertos.' },
        '/login': { title: 'Iniciar Sesión | Flip-F', description: 'Ingresa a tu cuenta de Flip-F para acceder a tu contenido.' },
        '/register': { title: 'Registro | Flip-F', description: 'Crea tu cuenta en Flip-F para formarte, descargar recursos y más.' },
        '/ayuda': { title: 'Ayuda | Flip-F', description: 'Centro de ayuda y soporte técnico de Flip-F.' },
        '/privacidad': { title: 'Políticas de Privacidad | Flip-F', description: 'Políticas de privacidad y tratamiento de datos de Flip-F.' },
        '/terminos': { title: 'Términos y Condiciones | Flip-F', description: 'Lee los términos y condiciones de Flip-F.' },
    };

    // 6. Lógica de Enrutamiento
    if (routeMetaMap[urlPath]) {
        metaTitle = routeMetaMap[urlPath].title;
        metaDescription = routeMetaMap[urlPath].description;
    } 
    // Rutas dinámicas de cursos
    else if (urlPath.startsWith('/academia/') || urlPath.startsWith('/aula-virtual/')) {
        const courseId = urlPath.split('/')[2]; 
        const course = COURSES.find(c => c.id === courseId);
        
        if (course) {
            metaTitle = `${course.title} | Flip-F`;
            metaDescription = urlPath.startsWith('/aula-virtual/') 
                ? `Estudiando el curso ${course.title} en Flip-F` 
                : course.description;
            metaImage = course.image.startsWith('http') ? course.image : `${baseUrl}${course.image}`;
        }
    } 
    // Rutas de usuario / checkout
    else if (urlPath.startsWith('/checkout')) {
         metaTitle = 'Finalizar Compra | Flip-F';
         metaDescription = 'Finaliza tu proceso de inscripción o compra de forma segura.';
    } else if (urlPath.includes('/perfil')) {
         metaTitle = 'Mi Perfil | Flip-F';
         metaDescription = 'Gestiona tu información personal y configuración en Flip-F.';
    }

    // 7. Generar el HTML de Respuesta (Optimizado para Bot)
    // En lugar de intentar leer el index.html de la build (lo cual falla frecuentemente en Vercel
    // debido a cómo Vite y Vercel Node Serverless empaquetan los assets), enviaremos un HTML
    // ultra-ligero con los Meta Tags exactos.
    // Si un usuario real llegara a caer aquí por error (aunque el vercel.json debería evitarlo), 
    // añadimos un script de redirección en frontend.
    
    const htmlResponse = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>${metaTitle}</title>
    <!-- Metadatos Básicos -->
    <meta name="description" content="${metaDescription}">
    
    <!-- Open Graph (Facebook, WhatsApp, LinkedIn) -->
    <meta property="og:title" content="${metaTitle}">
    <meta property="og:description" content="${metaDescription}">
    <meta property="og:image" content="${metaImage}">
    <meta property="og:url" content="${metaUrl}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Flip Agencia">
    
    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${metaTitle}">
    <meta name="twitter:description" content="${metaDescription}">
    <meta name="twitter:image" content="${metaImage}">
    <meta name="twitter:domain" content="${host}">
    <meta name="twitter:url" content="${metaUrl}">

    <!-- Redirección de seguridad (por si entra un usuario y no un Bot) -->
    <script>
        // Redirige eliminando un eventual loop de bot
        if (window.location.search.indexOf('bot=true') === -1) {
             window.location.replace(window.location.pathname + "?bot=false");
        }
    </script>
</head>
<body>
    <h1>${metaTitle}</h1>
    <p>${metaDescription}</p>
    <img src="${metaImage}" alt="${metaTitle}" />
</body>
</html>`;

    // 8. Enviar HTML final.
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(htmlResponse);
}
