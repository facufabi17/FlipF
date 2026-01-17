import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();
    const { itemCount, total } = useCart();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleNavigate = (path: string) => {
        navigate(path);
        setMobileMenuOpen(false);
        setUserMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        setMobileMenuOpen(false);
        setUserMenuOpen(false);
        navigate('/');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background-dark/80 backdrop-blur-md">
            <div className="flex h-16 items-center justify-between px-6 lg:px-12 max-w-7xl mx-auto">
                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer group" onClick={() => handleNavigate('/')}>
                    <div className="flex items-center justify-center size-8 rounded-lg bg-primary/20 border border-white/5">
                        <svg className="w-8 h-8 logo-header transition-transform group-hover:rotate-[180deg] duration-500" viewBox="0 0 1080 1080">
                            <defs>
                                <style>{`.cls-1 { fill: #FFF; stroke-width: 0px; }`}</style>
                            </defs>
                            <path className="cls-1" d="M748.89,237.28h-364.86c-10.55,0-20.67,4.19-28.13,11.65l-56.26,56.26c-7.46,7.46-11.65,17.58-11.65,28.13v444.42c0,10.55,4.19,20.67,11.65,28.13l56.26,56.26c7.46,7.46,17.58,11.65,28.13,11.65h46.64c10.55,0,20.67-4.19,28.13-11.65l67.87-67.89v-.02h142.65c10.55,0,20.67-4.19,28.13-11.65l56.26-56.27c7.46-7.46,11.65-17.58,11.65-28.13v-46.61c0-10.55-4.19-20.67-11.65-28.13l-56.26-56.26c-7.46-7.46-17.58-11.65-28.13-11.65h-102.87c-21.97,0-39.78-17.81-39.78-39.78h0c0-21.97,17.81-39.78,39.78-39.78h182.43c10.55,0,20.67-4.19,28.13-11.65l56.26-56.26c7.46-7.46,11.65-17.58,11.65-28.13v-46.61c0-10.55-4.19-20.67-11.65-28.13l-56.26-56.26c-7.46-7.46-17.58-11.65-28.13-11.65ZM725.59,396.4h-182.43c-10.55,0-20.67,4.19-28.13,11.65l-56.26,56.26c-7.46,7.46-11.65,17.58-11.65,28.13v46.61c0,10.55,4.19,20.67,11.65,28.13l56.26,56.26c7.46,7.46,17.58,11.65,28.13,11.65h102.87c21.97,0,39.78,17.81,39.78,39.78h0c0,21.97-17.81,39.78-39.78,39.78h-102.87c-10.55,0-20.67,4.19-28.14,11.66l-56.22,56.25c-7.46,7.46-17.58,11.66-28.14,11.66h-23.33c-21.97,0-39.78-17.81-39.78-39.78v-397.81c0-21.97,17.81-39.78,39.78-39.78h318.25c21.97,0,39.78,17.81,39.78,39.78h0c0,21.97-17.81,39.78-39.78,39.78Z" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">Flip</span>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link to="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Inicio</Link>
                    {/* Recursos Dropdown */}
                    <div className="relative group h-full flex items-center">
                        <button className="text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-1 py-4">
                            Recursos
                            <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                        <div className="absolute top-full left-0 hidden group-hover:block w-44 bg-[#1b131f] border border-white/5 rounded-xl shadow-2xl py-2 z-[100]">
                            <Link to="/recursos-gratis" className="w-full text-left block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Recursos Gratis</Link>
                            <Link to="/recursos-pago" className="w-full text-left block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Recursos de Pago</Link>
                        </div>
                    </div>

                    <Link to="/academia" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Academia</Link>
                    <Link to="/consultas" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Consultas</Link>
                    <Link to="/nosotros" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Nosotros</Link>

                </nav>

                {/* Acciones */}
                <div className="flex items-center gap-4">
                    {/* Carrito */}
                    <Link to="/checkout" className="relative p-2 text-gray-300 hover:text-white transition-colors group">
                        <span className="material-symbols-outlined">shopping_cart</span>
                        {itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white shadow-sm ring-2 ring-[#1b131f]">
                                {itemCount}
                            </span>
                        )}
                        {/* Tooltip con total */}
                        {itemCount > 0 && (
                            <div className="absolute top-full right-0 mt-2 hidden group-hover:block bg-[#1b131f] border border-white/10 p-2 rounded text-xs text-white whitespace-nowrap shadow-xl">
                                Total: ${total.toLocaleString()}
                            </div>
                        )}
                    </Link>

                    {isAuthenticated ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 md:gap-3 focus:outline-none group p-1 md:pr-2 rounded-full hover:bg-white/5 transition-colors"
                            >
                                <span className="text-sm font-medium text-white hidden md:block group-hover:text-primary transition-colors">{user?.name}</span>
                                <div className="size-9 md:size-10 rounded-full bg-gradient-to-br from-primary to-accent p-[2px] shadow-lg shadow-primary/20">
                                    <div className="w-full h-full rounded-full bg-[#1b131f] flex items-center justify-center">
                                        <span className="font-bold text-white text-sm md:text-base">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                                    </div>
                                </div>
                                <span className={`material-symbols-outlined text-gray-400 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`}>expand_more</span>
                            </button>

                            {/* User Dropdown */}
                            {userMenuOpen && (
                                <div className="absolute right-0 top-full mt-3 w-64 bg-[#1b131f] border border-white/10 rounded-xl shadow-2xl py-2 z-[100] animate-fade-in origin-top-right">
                                    <div className="px-4 py-3 border-b border-white/5 mb-1 hidden md:block">
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Cuenta</p>
                                        <p className="text-xs text-white truncate mt-1">{user?.email}</p>
                                    </div>

                                    <Link to="/mis-cursos" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setUserMenuOpen(false)}>
                                        <span className="material-symbols-outlined text-[20px] text-primary">school</span>
                                        Mis Cursos
                                    </Link>
                                    <Link to="/mis-recursos" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setUserMenuOpen(false)}>
                                        <span className="material-symbols-outlined text-[20px] text-accent">folder_open</span>
                                        Mis Recursos
                                    </Link>

                                    <div className="border-t border-white/5 my-1"></div>

                                    <Link to="/perfil" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setUserMenuOpen(false)}>
                                        <span className="material-symbols-outlined text-[20px] text-gray-400">person</span>
                                        Información de usuario
                                    </Link>
                                    <Link to="/ayuda" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setUserMenuOpen(false)}>
                                        <span className="material-symbols-outlined text-[20px] text-gray-400">help</span>
                                        Ayuda
                                    </Link>

                                    <div className="border-t border-white/5 my-1"></div>

                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left">
                                        <span className="material-symbols-outlined text-[20px]">logout</span>
                                        Cerrar Sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="hidden md:block text-sm font-medium text-white hover:text-gray-300 transition-colors">Iniciar Sesión</Link>
                            <Link to="/register" className="bg-primary/20 hover:bg-primary/40 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all border border-white/5">
                                Empezar
                            </Link>
                        </>
                    )}

                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white">
                        <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-background-dark border-t border-white/5 p-4 flex flex-col gap-4 animate-fade-in">
                    <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white">Inicio</Link>
                    <Link to="/nosotros" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white">Nosotros</Link>
                    <Link to="/recursos-gratis" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white">Recursos Gratis</Link>
                    <Link to="/recursos-pago" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white">Recursos de Pago</Link>
                    <Link to="/academia" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white">Academia</Link>

                    {isAuthenticated && (
                        <>
                            <div className="border-t border-white/10 my-2"></div>
                            <Link to="/mis-cursos" onClick={() => setMobileMenuOpen(false)} className="text-primary font-bold">Mis Cursos</Link>
                            <Link to="/mis-recursos" onClick={() => setMobileMenuOpen(false)} className="text-accent font-bold">Mis Recursos</Link>
                            <Link to="/perfil" onClick={() => setMobileMenuOpen(false)} className="text-gray-300">Información de usuario</Link>
                            <Link to="/ayuda" onClick={() => setMobileMenuOpen(false)} className="text-gray-300">Ayuda</Link>
                        </>
                    )}

                    {!isAuthenticated && (
                        <>
                            <div className="border-t border-white/10 my-2"></div>
                            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white">Iniciar Sesión</Link>
                            <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="text-primary font-bold">Registrarse</Link>
                        </>
                    )}
                </div>
            )}
        </header>
    );
};

export default Navbar;