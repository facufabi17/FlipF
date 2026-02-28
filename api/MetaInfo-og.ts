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

    // 7. Leer el archivo index.html compilado
    try {
        // En Vercel, los archivos estáticos luego de un build Vite suelen quedar en la carpeta 'dist'
        // Si no existe ahí, buscamos en la raíz.
        const possiblePaths = [
            path.join(process.cwd(), 'dist', 'index.html'),
            path.join(process.cwd(), 'index.html'),
            path.join(__dirname, '..', 'dist', 'index.html'), // path fallback alternativo
             path.join(__dirname, '..', 'index.html') 
        ];

        let indexPath = '';
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                 indexPath = p;
                 break;
            }
        }

        if (!indexPath) {
            console.error('No se pudo encontrar index.html en Vercel. Paths buscados:', possiblePaths);
            return res.status(500).send('Index HTML Missing');
        }

        let htmlData = fs.readFileSync(indexPath, 'utf8');

        // 7. Reemplazar las etiquetas usando Expresiones Regulares
        // Nota: Asegurarse de usar la tag correcta e interpolar contenido para SEO
        htmlData = htmlData
            .replace(/<title>.*?<\/title>/gi, `<title>${metaTitle}</title>`)
            .replace(/<meta name=["']description["'] content=["'][^"']*["']>/gi, `<meta name="description" content="${metaDescription}">`)
            .replace(/<meta property=["']og:title["'] content=["'][^"']*["']>/gi, `<meta property="og:title" content="${metaTitle}">`)
            .replace(/<meta property=["']og:description["'] content=["'][^"']*["']>/gi, `<meta property="og:description" content="${metaDescription}">`)
            .replace(/<meta property=["']og:image["'] content=["'][^"']*["']>/gi, `<meta property="og:image" content="${metaImage}">`)
            .replace(/<meta property=["']og:type["'] content=["'][^"']*["']>/gi, `<meta property="og:type" content="website">`);

        // Si no existe og:url se la podemos agregar antes de cerrar la etiqueta head para mayor precision de OG
        if (!htmlData.includes('og:url')) {
            htmlData = htmlData.replace('</head>', `  <meta property="og:url" content="${metaUrl}">\n</head>`);
        }

        // Añadir twitter cards explicitly si no están
        if (!htmlData.includes('twitter:card')) {
             htmlData = htmlData.replace('</head>', `  <meta name="twitter:card" content="summary_large_image">\n</head>`);
        }
        if (!htmlData.includes('twitter:title')) {
             htmlData = htmlData.replace('</head>', `  <meta name="twitter:title" content="${metaTitle}">\n</head>`);
        }
        if (!htmlData.includes('twitter:description')) {
             htmlData = htmlData.replace('</head>', `  <meta name="twitter:description" content="${metaDescription}">\n</head>`);
        }
        if (!htmlData.includes('twitter:image')) {
             htmlData = htmlData.replace('</head>', `  <meta name="twitter:image" content="${metaImage}">\n</head>`);
        }

        // 8. Enviar HTML final.
        // Opcional: Para cachear la respuesta en el CDN de Vercel por 1 hora y reducir invocaciones.
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.status(200).send(htmlData);
    } catch (err) {
        console.error('Error enviando el index.html configurado', err);
        // Si hay error en lectura en el server devolvemos un HTML basico hardcodeado
        // Esto asegura que el Crawler NUNCA reciba un error 500 y al menos reciba el titulo.
        const fallbackHtml = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="utf-8">
                <title>${metaTitle}</title>
                <meta name="description" content="${metaDescription}">
                <meta property="og:title" content="${metaTitle}">
                <meta property="og:description" content="${metaDescription}">
                <meta property="og:image" content="${metaImage}">
                <meta property="og:url" content="${metaUrl}">
                <meta property="og:type" content="website">
            </head>
            <body></body>
            </html>
        `;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.status(200).send(fallbackHtml);
    }
}
