import { Course } from '../types';
import { COURSE_MARKETING } from './courses/marketing';
import { COURSE_OPERATIONS } from './courses/operations';
import { COURSE_LEADERSHIP } from './courses/leadership';

// Archivo centralizador.
// Para editar un curso específico, ve a la carpeta 'data/courses/'

export const COURSES: Course[] = [
    COURSE_MARKETING,
    COURSE_OPERATIONS,
    COURSE_LEADERSHIP
];