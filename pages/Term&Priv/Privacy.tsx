import React from 'react';

const Privacy: React.FC = () => {
    return (
        <div className="animate-fade-in min-h-screen bg-background text-text-primary px-6 py-20">
            <div className="max-w-4xl mx-auto space-y-8 text-gray-300">

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Política de Privacidad</h1>
                    <p className="text-text-muted">Última actualización: 27 de enero de 2026</p>
                </div>

                <div className="space-y-6 text-lg leading-relaxed">
                    <p>
                        En Flip Manager, la privacidad de nuestros usuarios y clientes es una prioridad. Esta Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos la información personal que nos proporcionas al utilizar nuestro sitio web, comprar nuestros cursos o recursos, o contratar nuestros servicios de agencia.
                    </p>
                </div>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">1. Información que Recopilamos</h2>
                    <p>Para ofrecerte la mejor experiencia, recolectamos los siguientes datos:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Datos de contacto:</strong> Nombre, apellido, correo electrónico, número de teléfono y dirección (para facturación).</li>
                        <li><strong>Datos de pago:</strong> Información procesada de forma segura a través de nuestras pasarelas de pago (no almacenamos los datos completos de tus tarjetas en nuestros servidores).</li>
                        <li><strong>Datos de uso:</strong> Información sobre cómo interactúas con nuestra web, cursos y recursos (cookies, dirección IP, tipo de navegador).</li>
                        <li><strong>Datos de clientes de agencia:</strong> Información específica del negocio necesaria para la ejecución de estrategias de marketing (accesos a cuentas publicitarias, perfiles de audiencia, etc.).</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">2. Finalidad del Tratamiento de Datos</h2>
                    <p>Utilizamos tu información para:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Gestión de Cursos y Recursos:</strong> Procesar tu inscripción, enviarte materiales descargables y gestionar tu acceso a la plataforma educativa.</li>
                        <li><strong>Prestación de Servicios de Agencia:</strong> Ejecutar los servicios de marketing contratados y comunicarnos sobre el progreso de los proyectos.</li>
                        <li><strong>Marketing y Comunicaciones:</strong> Enviarte actualizaciones, ofertas especiales y boletines informativos (solo si has dado tu consentimiento explícito).</li>
                        <li><strong>Mejora del Servicio:</strong> Analizar el comportamiento del usuario para optimizar nuestra oferta de productos y la usabilidad de la web.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">3. Compartición de Datos con Terceros</h2>
                    <p>Flip Manager no vende ni alquila tus datos personales a terceros. Sin embargo, compartimos datos con proveedores esenciales para operar:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Plataformas de pago:</strong> (Ej. Mercado Pago, Stripe, PayPal) para procesar transacciones.</li>
                        <li><strong>Servicios de Email Marketing:</strong> Para el envío de comunicaciones automatizadas.</li>
                        <li><strong>Herramientas de Análisis:</strong> (Ej. Google Analytics) para entender el tráfico del sitio.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">4. Protección de la Información</h2>
                    <p>
                        Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos contra acceso no autorizado, pérdida o alteración. Esto incluye el uso de protocolos de cifrado SSL y acceso restringido a la información personal solo a personal autorizado.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">5. Derechos del Usuario</h2>
                    <p>Como titular de los datos, tienes derecho a:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Acceder a los datos personales que tenemos sobre ti.</li>
                        <li>Rectificar cualquier información inexacta o incompleta.</li>
                        <li>Eliminar tus datos (derecho al olvido) cuando ya no sean necesarios para los fines que fueron recogidos.</li>
                        <li>Retirar tu consentimiento en cualquier momento para el envío de comunicaciones comerciales.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">6. Cookies</h2>
                    <p>
                        Utilizamos cookies para mejorar tu experiencia de navegación. Puedes configurar tu navegador para rechazar todas o algunas cookies, aunque esto podría afectar la funcionalidad de ciertas partes del sitio.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">7. Contacto</h2>
                    <p>Si tienes preguntas sobre esta Política de Privacidad o deseas ejercer tus derechos, puedes contactarnos en:</p>
                    <ul className="list-none space-y-1">
                        <li><strong>Correo electrónico:</strong> graficosfl@gmail.com</li>
                        <li><strong>Ubicación:</strong> Resistencia, Chaco, Argentina.</li>
                    </ul>
                </section>

            </div>
        </div>
    );
};

export default Privacy;
