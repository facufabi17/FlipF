//import { supabase } from './lib/supabase';

import React, { useState } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import { Toast } from './components/Toast';
import Home from './pages/Home';
import About from './pages/About';
import FreeResources from './pages/FreeResources';
import PaidResources from './pages/PaidResources';
import Academy from './pages/Academy';
import CourseDetails from './pages/CourseDetails';
import Checkout from './pages/Checkout';
import MyCourses from './pages/Usuario/MyCourses';
import MyCertificates from './pages/Usuario/MyCertificates';
import VerifyCertificate from './pages/VerifyCertificate';
import MyResources from './pages/Usuario/MyResources';
import CoursePlayer from './pages/CoursePlayer';
import Consulting from './pages/Consulting';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/Usuario/UserProfile';
import Help from './pages/Help';
import Privacy from './pages/Term&Priv/Privacy';
import Terms from './pages/Term&Priv/Terms';
import UpdatePassword from './pages/UpdatePassword';
import { ToastMessage } from './types';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AuthHandler from './context/AuthHandler';
import ScrollToTop from './components/ScrollToTop';

//const { data: todos } = await supabase.from('todos').select()



const App: React.FC = () => {
    const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null);

    const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToastMessage({ id: Date.now().toString(), text, type });
    };

    return (
        <AuthProvider>
            <CartProvider>
                <HashRouter>
                    <ScrollToTop />
                    <AuthHandler />
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
                                <Route path="/mis-certificados" element={<MyCertificates />} />
                                <Route path="/verify/:id" element={<VerifyCertificate />} />
                                <Route path="/mis-recursos" element={<MyResources />} />
                                <Route path="/perfil" element={<UserProfile onShowToast={showToast} />} />
                                <Route path="/ayuda" element={<Help />} />
                                <Route path="/privacidad" element={<Privacy />} />
                                <Route path="/terminos" element={<Terms />} />
                                <Route path="/actualizar-password" element={<UpdatePassword />} />

                                <Route path="/aula-virtual/:id" element={<CoursePlayer />} />

                                <Route path="/consultas" element={<Consulting onShowToast={showToast} />} />
                                <Route path="/login" element={<Login onShowToast={showToast} />} />
                                <Route path="/register" element={<Register onShowToast={showToast} />} />
                            </Routes>
                        </main>

                        <Footer />
                        <WhatsAppButton />
                        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
                    </div>
                </HashRouter>
            </CartProvider>
        </AuthProvider>
    );
};

export default App;