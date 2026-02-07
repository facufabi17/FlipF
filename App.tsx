//import { supabase } from './lib/supabase';

import React, { useState, Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import { Toast } from './components/Toast';
import { ToastMessage } from './types';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AuthHandler from './context/AuthHandler';
import ScrollToTop from './components/ScrollToTop';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const FreeResources = lazy(() => import('./pages/FreeResources'));
const PaidResources = lazy(() => import('./pages/PaidResources'));
const Academy = lazy(() => import('./pages/Academy'));
const CourseDetails = lazy(() => import('./pages/CourseDetails'));
const Checkout = lazy(() => import('./pages/Checkout'));
const MyCourses = lazy(() => import('./pages/user/MyCourses'));
const MyCertificates = lazy(() => import('./pages/user/MyCertificates'));
const VerifyCertificate = lazy(() => import('./pages/VerifyCertificate'));
const PurchaseHistory = lazy(() => import('./pages/user/PurchaseHistory'));
const MyResources = lazy(() => import('./pages/user/MyResources'));
const CoursePlayer = lazy(() => import('./pages/CoursePlayer'));
const Consulting = lazy(() => import('./pages/Consulting'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const UserProfile = lazy(() => import('./pages/user/UserProfile'));
const Help = lazy(() => import('./pages/Help'));
const Privacy = lazy(() => import('./pages/terms&privacy/Privacy'));
const Terms = lazy(() => import('./pages/terms&privacy/Terms'));
const UpdatePassword = lazy(() => import('./pages/UpdatePassword'));
const PagoAprobado = lazy(() => import('./pages/PagoAprobado'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));

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
                            <Suspense fallback={<LoadingSpinner />}>
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
                                    <Route path="/pago_apro" element={<PagoAprobado />} />
                                    <Route path="/historial-compras" element={<PurchaseHistory />} />

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
                                    <Route path="/login" element={<Login onShowToast={showToast} />} />
                                    <Route path="/register" element={<Register onShowToast={showToast} />} />
                                    <Route path="/payment-success" element={<PaymentSuccess />} />
                                </Routes>
                            </Suspense>
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