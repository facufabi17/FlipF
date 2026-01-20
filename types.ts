export interface ToastMessage {
    id: string;
    text: string;
    type: 'success' | 'error' | 'info';
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
}

export enum AcademyView {
    CATALOG = 'catalog',
    MY_COURSES = 'my-courses',
    DETAILS = 'details',
    CHECKOUT = 'checkout',
    PLAYER = 'player'
}

export interface ResourceLink {
    title: string;
    url: string;
    type: 'pdf' | 'video' | 'link' | 'file';
}

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
}

export interface Quiz {
    id: string;
    title: string;
    questions: QuizQuestion[];
    passingScore: number;
}

export interface Lesson {
    id: string;
    title: string;
    duration: string;
    description: string;
    videoUrl?: string;
    presentationUrl?: string;
    textContent?: string;
    resources: ResourceLink[];
}

export interface CourseModule {
    id: string;
    title: string;
    lessons: Lesson[];
    quiz?: Quiz;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    category: string;
    modules: CourseModule[];
}

// --- NUEVO: Recursos de Pago ---
export interface PaidResource {
    id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    category: 'Marketing' | 'Operaciones' | 'Sistemas' | 'Otro';
    type: 'Ebook' | 'Template' | 'System';
    downloadUrl: string; // Link real de descarga tras la compra
}

// --- NUEVO: Item del Carrito ---
export interface CartItem {
    id: string;
    title: string;
    price: number;
    image: string;
    type: 'course' | 'resource';
}

export interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
    enrolledCourses: string[]; 
    ownedResources: string[]; // Lista de IDs de recursos comprados
    progress?: Record<string, string[]>; 
}