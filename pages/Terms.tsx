import React from 'react';

const Terms: React.FC = () => {
    return (
        <div className="animate-fade-in min-h-screen bg-background text-text-primary px-6 py-20">
            <div className="max-w-4xl mx-auto space-y-8 text-gray-300">

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Términos y Condiciones</h1>
                    <p className="text-text-muted">Última actualización: 28 de enero de 2026</p>
                </div>

                <div className="space-y-6 text-lg leading-relaxed">
                    <p>
                        Bienvenido a Flip Manager. Al acceder a nuestro sitio web y utilizar nuestros servicios, aceptas cumplir con los siguientes términos y condiciones. Te recomendamos leerlos atentamente.
                    </p>
                </div>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">1. Servicios de la Agencia</h2>
                    <p>Flip Manager ofrece servicios de marketing digital para empresas.</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Contratación:</strong> La prestación de servicios se regirá por el contrato específico firmado entre las partes.</li>
                        <li><strong>Responsabilidad:</strong> El cliente es responsable de proporcionar la información y accesos necesarios para la ejecución de las estrategias.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">2. Venta de Cursos y Recursos Educativos</h2>
                    <p>Al adquirir nuestros cursos o recursos, aceptas las siguientes reglas:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Acceso:</strong> El acceso a los cursos es personal e intransferible.</li>
                        <li><strong>Uso de Recursos:</strong> Los recursos descargables (plantillas, guías, etc.) son para uso profesional del comprador, pero está prohibida su reventa o distribución masiva sin autorización previa.</li>
                        <li><strong>Certificaciones:</strong> Para obtener el certificado de finalización de ciertos cursos, se requiere que el usuario complete su perfil con su DNI, información que se manejará de forma privada y no será modificable tras su emisión.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">3. Propiedad Intelectual</h2>
                    <p>
                        Todo el contenido presente en este sitio, incluyendo textos, gráficos, logotipos, iconos, imágenes, clips de audio, descargas digitales y compilaciones de datos, es propiedad de Flip Manager o de sus proveedores de contenido y está protegido por las leyes de propiedad intelectual.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">4. Políticas de Pago y Devolución</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Pagos:</strong> Todos los pagos se realizan a través de plataformas seguras de terceros.</li>
                        <li><strong>Reembolsos:</strong> Debido a la naturaleza digital de nuestros cursos y recursos, no se realizarán reembolsos una vez que el usuario haya accedido al contenido o descargado el material, salvo excepciones legales vigentes.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">5. Modificaciones de los Términos</h2>
                    <p>
                        Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en el sitio web. Es responsabilidad del usuario revisar periódicamente esta sección.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">6. Limitación de Responsabilidad</h2>
                    <p>
                        Flip Manager no garantiza resultados específicos (como aumento de ventas o seguidores) derivados del uso de sus cursos o recursos, ya que el éxito depende de la implementación individual y factores externos del mercado.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">7. Ley Aplicable y Jurisdicción</h2>
                    <p>
                        Estos términos se rigen por las leyes de la República Argentina. Cualquier controversia será sometida a los tribunales ordinarios de la ciudad de Resistencia, Chaco.
                    </p>
                </section>

            </div>
        </div>
    );
};

export default Terms;
