import React, { useState } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import { Toast } from './components/Toast';
import Home from './pages/Home';
import About from './pages/About';
import FreeResources from './pages/FreeResources';
import PaidResources from './pages/PaidResources';
import Academy from './pages/Academy';
import CourseDetails from './pages/CourseDetails';
import Checkout from './pages/Checkout';
import MyCourses from './pages/MyCourses';
import MyResources from './pages/MyResources';
import CoursePlayer from './pages/CoursePlayer';
import Consulting from './pages/Consulting';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import Help from './pages/Help';
import { ToastMessage } from './types';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Componente auxiliar para manejar la visibilidad del ChatBot
const ChatBotWithVisibility: React.FC = () => {
    const location = useLocation();
    // Rutas donde no debe aparecer el ChatBot
    const hiddenPrefixes = ['/mis-cursos', '/aula-virtual'];
    const shouldHide = hiddenPrefixes.some(prefix => location.pathname.startsWith(prefix));

    if (shouldHide) return null;
    return <ChatBot />;
};

const App: React.FC = () => {
    const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null);

    const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToastMessage({ id: Date.now().toString(), text, type });
    };

    return (
        <AuthProvider>
            <CartProvider>
                <HashRouter>
                    <div className="flex flex-col min-h-screen">
                        <Navbar />
                        
                        <main className="flex-1 w-full relative">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/nosotros" element={<About />} />
                                <Route path="/recursos-gratis" element={<FreeResources />} />
                                <Route path="/recursos-pago" element={<PaidResources onShowToast={showToast} />} />
                                
                                <Route path="/academia" element={<Academy />} />
                                <Route path="/academia/:id" element={<CourseDetails onShowToast={showToast} />} />
                                
                                {/* Checkout maneja Carrito (sin id) y Compra Directa (con id) */}
                                <Route path="/checkout" element={<Checkout onShowToast={showToast} />} />
                                <Route path="/checkout/:id" element={<Checkout onShowToast={showToast} />} />
                                
                                <Route path="/mis-cursos" element={<MyCourses />} />
                                <Route path="/mis-recursos" element={<MyResources />} />
                                <Route path="/perfil" element={<UserProfile onShowToast={showToast} />} />
                                <Route path="/ayuda" element={<Help />} />
                                
                                <Route path="/aula-virtual/:id" element={<CoursePlayer />} />

                                <Route path="/consultas" element={<Consulting onShowToast={showToast} />} />
                                <Route path="/login" element={<Login onShowToast={showToast} />} />
                                <Route path="/register" element={<Register onShowToast={showToast} />} />
                            </Routes>
                        </main>

                        <Footer />
                        <ChatBotWithVisibility />
                        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
                    </div>
                </HashRouter>
            </CartProvider>
        </AuthProvider>
    );
};

export default App;