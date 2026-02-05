/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_EMAILJS_SERVICE_ID: string
    readonly VITE_EMAILJS_PUBLIC_KEY: string
    readonly VITE_EMAILJS_TEMPLATE_ID_RECURSOS: string
    readonly VITE_EMAILJS_TEMPLATE_ID_CONTACTO: string
    readonly VITE_MP_PUBLIC_KEY: string
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

