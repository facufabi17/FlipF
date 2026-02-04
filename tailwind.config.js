/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./App.tsx",
        "./index.tsx",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./context/**/*.{js,ts,jsx,tsx}",
        "./api/**/*.{js,ts,jsx,tsx}",
        "./lib/**/*.{js,ts,jsx,tsx}",
        "./services/**/*.{js,ts,jsx,tsx}",
        "./data/**/*.{js,ts,jsx,tsx}"
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#842db4",
                "background": "#1b131f",
                "accent": "#FF007F",
                "background-light": "#f7f6f8",
                "background-dark": "#1b131f",
                "surface-dark": "#291d2f",
                "surface-darker": "#150f18",
                "border-dark": "#392942",
                "text-muted": "#b39ac1",
                "cta": "#FF007F",
                "tech": "#00F5F1",
                "card-bg": "#291d2f",
                "card-hover": "#34243b",
                "border-color": "#523a5f"
            },
            fontFamily: {
                "display": ["Space Grotesk", "sans-serif"],
                "body": ["Noto Sans", "sans-serif"]
            },
            backgroundImage: {
                'grid-pattern': "linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)"
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            },
            boxShadow: {
                'cyan-glow': '0 0 20px rgba(0, 245, 241, 0.5)',
            }
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/container-queries'),
    ],
}
