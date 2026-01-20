import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="w-full border-t border-white/5 bg-black/40 mt-20 pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-8">
                <div className="flex flex-col gap-4 max-w-xs">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center size-8 rounded-lg bg-primary/20 border border-white/5">
                          <svg className="w-8 h-8 logo-header transition-transform group-hover:rotate-[180deg] duration-500" viewBox="0 0 1080 1080">
                            <defs>
                              <style>{`.cls-1 { fill: #fff; stroke-width: 0px; }`}</style>
                            </defs>
                              <path className="cls-1" d="M748.89,237.28h-364.86c-10.55,0-20.67,4.19-28.13,11.65l-56.26,56.26c-7.46,7.46-11.65,17.58-11.65,28.13v444.42c0,10.55,4.19,20.67,11.65,28.13l56.26,56.26c7.46,7.46,17.58,11.65,28.13,11.65h46.64c10.55,0,20.67-4.19,28.13-11.65l67.87-67.89v-.02h142.65c10.55,0,20.67-4.19,28.13-11.65l56.26-56.27c7.46-7.46,11.65-17.58,11.65-28.13v-46.61c0-10.55-4.19-20.67-11.65-28.13l-56.26-56.26c-7.46-7.46-17.58-11.65-28.13-11.65h-102.87c-21.97,0-39.78-17.81-39.78-39.78h0c0-21.97,17.81-39.78,39.78-39.78h182.43c10.55,0,20.67-4.19,28.13-11.65l56.26-56.26c7.46-7.46,11.65-17.58,11.65-28.13v-46.61c0-10.55-4.19-20.67-11.65-28.13l-56.26-56.26c-7.46-7.46-17.58-11.65-28.13-11.65ZM725.59,396.4h-182.43c-10.55,0-20.67,4.19-28.13,11.65l-56.26,56.26c-7.46,7.46-11.65,17.58-11.65,28.13v46.61c0,10.55,4.19,20.67,11.65,28.13l56.26,56.26c7.46,7.46,17.58,11.65,28.13,11.65h102.87c21.97,0,39.78,17.81,39.78,39.78h0c0,21.97-17.81,39.78-39.78,39.78h-102.87c-10.55,0-20.67,4.19-28.14,11.66l-56.22,56.25c-7.46,7.46-17.58,11.66-28.14,11.66h-23.33c-21.97,0-39.78-17.81-39.78-39.78v-397.81c0-21.97,17.81-39.78,39.78-39.78h318.25c21.97,0,39.78,17.81,39.78,39.78h0c0,21.97-17.81,39.78-39.78,39.78Z" />
                          </svg>
                        </div>
                        <span className="text-lg font-bold text-white">Flip</span>
                    </div>
                    <p className="text-gray-500 text-sm">Empoderar a la próxima generación de autoridades digitales con herramientas, educación y estrategia.</p>
                </div>
                <div className="flex gap-12 flex-wrap">
                    <div className="flex flex-col gap-3">
                        <h4 className="text-white font-bold text-sm">Plataforma</h4>
                        <Link to="/" className="text-gray-400 text-sm hover:text-primary transition-colors">Inicio</Link>
                        <Link to="/recursos-gratis" className="text-gray-400 text-sm hover:text-primary transition-colors">Recursos Gratis</Link>
                        <Link to="/recursos-pago" className="text-gray-400 text-sm hover:text-primary transition-colors">Recursos de Pago</Link>
                        <Link to="/academia" className="text-gray-400 text-sm hover:text-primary transition-colors">Academia</Link>
                        <Link to="/consultas" className="text-gray-400 text-sm hover:text-primary transition-colors">Consultas</Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h4 className="text-white font-bold text-sm">Compañía</h4>
                        <Link to="/nosotros" className="text-gray-400 text-sm hover:text-primary transition-colors">Nosotros</Link>
                        <a className="text-gray-400 text-sm hover:text-primary transition-colors" href="#">Carreras</a>
                        <a className="text-gray-400 text-sm hover:text-primary transition-colors" href="#">Contacto</a>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h4 className="text-white font-bold text-sm">Legal</h4>
                        <a className="text-gray-400 text-sm hover:text-primary transition-colors" href="#">Privacidad</a>
                        <a className="text-gray-400 text-sm hover:text-primary transition-colors" href="#">Términos</a>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 text-center md:text-left">
                <p className="text-gray-600 text-xs">© 2026 Flip Authority Hub. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;