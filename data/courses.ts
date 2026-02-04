import { Course } from '../types';

// Marketing & Strategy
import { INVESTIGACION_AUDIENCIAS } from './Analista de Marketing Digital y Estrategia/investigacion-audiencias';
import { FUNDAMENTOS_MARKETING } from './Analista de Marketing Digital y Estrategia/fundamentos-marketing';
import { BRANDING_IDENTIDAD } from './Analista de Marketing Digital y Estrategia/branding-identidad';
import { ESTRATEGIA_CONTENIDOS } from './Analista de Marketing Digital y Estrategia/estrategia-contenidos';
import { UX_OPTIMIZACION } from './Analista de Marketing Digital y Estrategia/ux-optimizacion';
import { DESARROLLO_WEB_ESTRATEGICO } from './Analista de Marketing Digital y Estrategia/desarrollo-web';
import { GESTION_REDES } from './Analista de Marketing Digital y Estrategia/gestion-redes';
import { AUTOMATIZACION_MAIL } from './Analista de Marketing Digital y Estrategia/automatizacion-mail';
import { ANALYTICS_DIGITAL } from './Analista de Marketing Digital y Estrategia/analytics-digital';
import { SEO } from './Analista de Marketing Digital y Estrategia/seo';
import { GROWTH_STRATEGIES } from './Analista de Marketing Digital y Estrategia/growth-strategies';
import { PRESUPUESTO } from './Analista de Marketing Digital y Estrategia/presupuesto';

// Data & AI
import { PYTHON_DATOS } from './Analista de Datos e IA/python-datos';
import { SQL_DATABASES } from './Analista de Datos e IA/sql-databases';
import { AI_OPERATIVA } from './Analista de Datos e IA/ai-operativa';
import { ANALISIS_EXPLORATORIO } from './Analista de Datos e IA/analisis-exploratorio';
import { LIBRERIAS_AVANZADAS } from './Analista de Datos e IA/librerias-avanzadas';
import { POWERBI } from './Analista de Datos e IA/powerbi';
import { SERVIDORES_AVANZADOS } from './Analista de Datos e IA/servidores-avanzados';
import { CERTIFICACION_PL300 } from './Analista de Datos e IA/certificacion-pl300';
import { MACHINE_LEARNING } from './Analista de Datos e IA/machine-learning';
import { STORYTELLING_DATOS } from './Analista de Datos e IA/storytelling-datos';
import { NOSQL_DATABASES } from './Analista de Datos e IA/nosql-databases';
import { INGENIERIA_DATOS } from './Analista de Datos e IA/ingenieria-datos';

// Standalone Courses
import { COURSE_OPERATIONS } from './courses/Prueba';

export const COURSES: Course[] = [
    // Marketing
    INVESTIGACION_AUDIENCIAS,
    FUNDAMENTOS_MARKETING,
    BRANDING_IDENTIDAD,
    ESTRATEGIA_CONTENIDOS,
    UX_OPTIMIZACION,
    DESARROLLO_WEB_ESTRATEGICO,
    GESTION_REDES,
    AUTOMATIZACION_MAIL,
    ANALYTICS_DIGITAL,
    SEO,
    GROWTH_STRATEGIES,
    PRESUPUESTO,

    // Data
    PYTHON_DATOS,
    SQL_DATABASES,
    AI_OPERATIVA,
    ANALISIS_EXPLORATORIO,
    LIBRERIAS_AVANZADAS,
    POWERBI,
    SERVIDORES_AVANZADOS,
    CERTIFICACION_PL300,
    MACHINE_LEARNING,
    STORYTELLING_DATOS,
    NOSQL_DATABASES,
    INGENIERIA_DATOS,

    // Standalone
    COURSE_OPERATIONS
];