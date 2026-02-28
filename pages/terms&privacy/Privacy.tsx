import React from 'react';
import SEOMeta from '../../components/SEO-Meta';

export default function Privacy() {
    return (
        <div className="animate-fade-in min-h-screen bg-background text-text-primary px-6 py-20">
            <SEOMeta />
            <div className="max-w-4xl mx-auto space-y-8 text-gray-300">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Política de Privacidad</h1>
                    <p className="text-text-muted">Última actualización: 28 de febrero de 2026</p>
                </div>

                <div className="space-y-6 text-lg leading-relaxed">
                    <p>
                        En <strong>Flip</strong>, valoramos tu privacidad y nos comprometemos a proteger tus datos personales. Esta Política de Privacidad explica cómo recopilamos, utilizamos, compartimos y protegemos tu información cuando utilizas nuestra plataforma de e-learning, compras nuestros cursos o descargas nuestros recursos digitales.
                    </p>
                </div>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">1. Información que recopilamos</h2>
                    <p>Para brindarte nuestros servicios, recopilamos y procesamos los siguientes datos personales al momento de registrarte o realizar una compra:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Datos Personales:</strong> Nombre y Apellido.</li>
                        <li><strong>Datos de Identificación Fiscal:</strong> DNI, CUIL o CUIT (necesarios para la facturación y emisión de certificados).</li>
                        <li><strong>Datos de Contacto:</strong> Correo electrónico.</li>
                        <li><strong>Datos de Facturación y Ubicación:</strong> Dirección completa, Código Postal, Provincia, Ciudad y País.</li>
                    </ul>
                    <p className="text-sm text-gray-400 mt-2">
                        <em>Nota sobre los pagos:</em> No almacenamos ni procesamos directamente los datos de tus tarjetas de crédito o débito. Todo el procesamiento de pagos se realiza de forma tokenizada a través del SDK y Bricks de Mercado Pago.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">2. Uso de la información</h2>
                    <p>Utilizamos la información recopilada con las siguientes finalidades técnicas y operativas:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Gestión de Cursos y Usuarios:</strong> Facilitar tu acceso a la plataforma, inscribirte en los cursos adquiridos y emitir los certificados correspondientes.</li>
                        <li><strong>Facturación y Procesamiento:</strong> Emitir las facturas correspondientes a tus compras de acuerdo con la legislación vigente.</li>
                        <li><strong>Prevención de Fraude y Seguridad:</strong> Validar la autenticidad de las transacciones y proteger las cuentas de accesos no autorizados mediante contraseñas encriptadas.</li>
                        <li><strong>Soporte Técnico:</strong> Brindarte asistencia ante incidencias en la plataforma.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">3. Compartir información con terceros</h2>
                    <p>En Flip no vendemos ni comercializamos tus datos. Sin embargo, para que nuestra plataforma funcione correctamente, tu información es gestionada a través de los siguientes proveedores de infraestructura (terceros de confianza):</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Supabase:</strong> Utilizamos Supabase como nuestro proveedor de base de datos y sistema de autenticación. Tus datos personales y de cuenta se almacenan en sus servidores seguros, y tus contraseñas se encuentran fuertemente encriptadas.</li>
                        <li><strong>Mercado Pago:</strong> Actúa como nuestra pasarela para el procesamiento de pagos (tarjetas y dinero en cuenta). Al realizar una compra, los datos de pago se procesan directamente en sus servidores bajo estrictos estándares de seguridad informáticos como PCI-DSS.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">4. Cookies y Tecnologías de Seguimiento</h2>
                    <p>Utilizamos tecnologías de seguimiento para analizar el comportamiento en la web, procesar compras y ofrecer una mejor experiencia de usuario:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Google Analytics 4 (GA4):</strong> Usamos GA4 y su Measurement Protocol para recopilar estadísticas anónimas sobre el tráfico de la web, páginas visitadas y eventos de e-commerce. Para ello, se almacena una cookie (<code>_ga</code>) en tu navegador.</li>
                        <li><strong>Almacenamiento Local (Local/Session Storage):</strong> Utilizamos el <code>sessionStorage</code> y <code>localStorage</code> de tu navegador exclusivamente para mantener el estado del sistema, como el carrito de compras, gestionar el seguimiento del proceso de checkout de forma fluida y atribuir correctamente las conversiones.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">5. Tus Derechos (Derechos ARCO)</h2>
                    <p>Como titular de tus datos personales, te asisten los llamados derechos ARCO, aplicables en las normativas de protección de datos de Argentina (Ley 25.326) y Latinoamérica:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Acceso:</strong> Tienes derecho a solicitar y conocer la información personal que tenemos sobre ti.</li>
                        <li><strong>Rectificación:</strong> Puedes actualizar o corregir tus datos si son inexactos o están incompletos desde tu panel de usuario o contactándonos de manera directa.</li>
                        <li><strong>Cancelación:</strong> Puedes solicitar la eliminación de tu cuenta y de tus datos personales de nuestras bases de datos, siempre que no existan obligaciones legales (como registros de facturación) que nos obliguen a conservarlos por un plazo determinado.</li>
                        <li><strong>Oposición:</strong> Tienes el derecho de oponerte a que utilicemos tus datos para fines específicos, como por ejemplo el envío de correos promocionales o de marketing.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">6. Modificaciones y Contacto</h2>
                    <p>
                        Nos reservamos el derecho de actualizar esta Política de Privacidad para reflejar cambios en nuestras prácticas técnicas o legales. Toda actualización relevante será notificada en esta misma página.
                    </p>
                    <p>
                        Si deseas ejercer tus Derechos ARCO o tienes alguna duda específica sobre el tratamiento ético de tus datos personales, por favor contáctanos al correo electrónico <strong>soporte@flip-f.com</strong> (o bien a través de los diversos canales de soporte que disponemos de modo oficial en este sitio).
                    </p>
                </section>
            </div>
        </div>
    );
}
