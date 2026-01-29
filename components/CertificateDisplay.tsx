import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { QRCodeSVG } from 'qrcode.react';

interface CertificateDisplayProps {
    studentName: string;
    studentDni: string;
    courseName: string;
    completionDate: string;
    directorName?: string;
    directorTitle?: string;
    uniqueId?: string; // Optional: External ID or generated
}

const CertificateDisplay: React.FC<CertificateDisplayProps> = ({
    studentName,
    studentDni,
    courseName,
    completionDate,
    directorName = 'Facundo Lozano',
    directorTitle = 'Director de Flip Manager',
    uniqueId,
}) => {
    const certificateRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [signatureSvg, setSignatureSvg] = useState<string | null>(null);

    // Fetch and process SVG signature for PDF compatibility
    React.useEffect(() => {
        const fetchSignature = async () => {
            try {
                const response = await fetch('/firma-facundo.svg');
                if (response.ok) {
                    let svgText = await response.text();
                    // Force white color directly in SVG attributes to bypass html2canvas filter limitations
                    svgText = svgText.replace(/fill="[^"]*"/g, 'fill="#FFFFFF"');
                    // Add fill if missing in path
                    svgText = svgText.replace(/<path/g, '<path fill="#FFFFFF"');
                    // Remove existing styles to avoid conflicts
                    svgText = svgText.replace(/style="[^"]*"/g, '');
                    setSignatureSvg(svgText);
                }
            } catch (error) {
                console.error('Error loading signature:', error);
            }
        };
        fetchSignature();
    }, []);

    // Generate a fallback ID if not provided
    const certId = uniqueId || `FLIP-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    const handleDownloadPDF = async () => {
        if (!certificateRef.current) return;
        setIsGenerating(true);

        try {
            // 1. Capturar en alta resolución
            const canvas = await html2canvas(certificateRef.current, {
                scale: 2, // Higher scale for better quality
                useCORS: true,
                backgroundColor: '#1a1a1a',
                logging: false,
                allowTaint: true,
            });

            const imgData = canvas.toDataURL('image/png', 1.0); // Max quality

            // 2. Crear PDF con las dimensiones EXACTAS de la imagen (elimina bordes blancos)
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });

            // 3. Agregar imagen cubriendo todo el PDF
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`Certificado-${courseName.replace(/\s+/g, '-')}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Hubo un error al generar el PDF. Por favor intenta de nuevo.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleLinkedInShare = () => {
        // LinkedIn 'Add to Profile' URL construction
        // Documentation: https://addtoprofile.linkedin.com/
        const baseUrl = 'https://www.linkedin.com/profile/add';
        const params = new URLSearchParams({
            startTask: 'CERTIFICATION_NAME',
            name: courseName,
            organizationId: '71874092',
            organizationName: 'Flip Manager | Agencia de Marketing Digital',
            issueYear: new Date().getFullYear().toString(),
            issueMonth: (new Date().getMonth() + 1).toString(),
            certId: certId,
            certUrl: `https://flip-f.vercel.app/#/verify/${certId}`,
        });

        window.open(`${baseUrl}?${params.toString()}`, '_blank');
    };

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-5xl mx-auto p-4 animate-fade-in">
            {/* Inject Google Font for Signature */}
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap');
                    .font-dancing { font-family: 'Dancing Script', cursive; }
                `}
            </style>

            {!uniqueId ? (
                <div className="w-full aspect-[1.414/1] bg-[#1a1a2e] rounded-lg border border-white/10 flex flex-col items-center justify-center p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-opacity-50 mb-4"></div>
                    <p className="text-gray-400">Cargando datos del certificado...</p>
                    <p className="text-xs text-gray-600 mt-2">Si esto persiste, contacta a soporte.</p>
                </div>
            ) : (
                /* --- CERTIFICATE CANVAS --- */
                <div className="relative w-full overflow-hidden shadow-2xl rounded-lg">
                    <div
                        ref={certificateRef}
                        className="relative bg-gradient-to-br from-[#0f0f13] to-[#1a1a2e] text-white p-12 md:p-20 w-full aspect-[1.414/1] flex flex-col items-center justify-between border-[12px] border-double border-primary/30"
                        style={{ minWidth: '800px' }} // Ensure consistent width for PDF generation even on mobile
                    >
                        {/* Decorative Elements */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-br-full blur-3xl pointer-events-none"></div>
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/5 rounded-tl-full blur-3xl pointer-events-none"></div>
                        <div className="absolute top-4 left-4 w-24 h-24 border-t-2 border-l-2 border-primary/20 rounded-tl-3xl"></div>
                        <div className="absolute top-4 right-4 w-24 h-24 border-t-2 border-r-2 border-primary/20 rounded-tr-3xl"></div>
                        <div className="absolute bottom-4 left-4 w-24 h-24 border-b-2 border-l-2 border-primary/20 rounded-bl-3xl"></div>
                        <div className="absolute bottom-4 right-4 w-24 h-24 border-b-2 border-r-2 border-primary/20 rounded-br-3xl"></div>

                        {/* Header */}
                        <div className="text-center z-10 w-full mb-8">
                            {/* Logo Placeholder - Text based if image fails or missing */}
                            <div className="flex items-center justify-center gap-3 mb-6 opacity-90">
                                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary text-2xl">school</span>
                                </div>
                                <span className="text-2xl font-bold tracking-widest uppercase font-display">Flip Manager</span>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-display font-bold uppercase tracking-widest text-white mb-2 shadow-sm drop-shadow-lg">
                                Certificado
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-400 uppercase tracking-[0.5em] font-light">de Finalización</p>
                        </div>

                        {/* Body */}
                        <div className="text-center z-10 flex-1 flex flex-col justify-center w-full max-w-3xl">
                            <p className="text-lg text-gray-400 mb-4 font-light">Se otorga el presente reconocimiento a</p>

                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 font-serif italic tracking-wide pb-4 border-b border-white/10 mx-auto inline-block min-w-[60%]">
                                {studentName}
                            </h2>
                            <p className="text-sm text-gray-500 mb-8 font-mono">DNI: {studentDni}</p>

                            <p className="text-lg text-gray-400 mb-4 font-light">Por haber completado exitosamente el curso profesional</p>

                            <h3 className="text-3xl md:text-4xl font-bold text-primary mb-6 uppercase tracking-wide drop-shadow-md">
                                {courseName}
                            </h3>

                            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
                                Demostrando su dominio en las habilidades y conocimientos impartidos, cumpliendo con todos los requisitos académicos y prácticos exigidos por Flip Manager.
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between items-end w-full mt-12 z-10 px-8">
                            <div className="text-center">
                                <div className="mb-2 relative h-8 w-24 flex items-end justify-center mx-auto">
                                    {/* Digital Signature - Inline SVG for PDF Compatibility */}
                                    {signatureSvg ? (
                                        <div
                                            className="absolute bottom-0 w-full h-full flex items-end justify-center translate-y-2 select-none"
                                            dangerouslySetInnerHTML={{ __html: signatureSvg }}
                                            style={{
                                                transform: 'translateY(10px) scale(1.2)',
                                            }}
                                        />
                                    ) : (
                                        <div id="signature-fallback" className="h-full w-full flex items-end justify-center">
                                            <span className="font-dancing text-3xl text-gray-300 transform -rotate-6 translate-y-2 opacity-80 whitespace-nowrap">
                                                {directorName}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="w-64 h-px bg-gray-500 mb-2"></div>
                                <p className="text-sm font-bold text-white uppercase">{directorName}</p>
                                <p className="text-xs text-primary">{directorTitle}</p>
                            </div>

                            <div className="hidden md:block opacity-90">
                                {/* Real QR Code */}
                                <div className="bg-white p-2 rounded-lg shadow-lg">
                                    <QRCodeSVG
                                        value={`https://flipmanager.com/#/verify/${certId}`}
                                        size={80}
                                        level="M"
                                        fgColor="#000000"
                                        bgColor="#ffffff"
                                    />
                                </div>
                            </div>

                            <div className="text-center">
                                <p className="text-lg font-bold text-white mb-2">{completionDate}</p>
                                <div className="w-48 h-px bg-gray-500 mb-2"></div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha de Emisión</p>
                                <p className="text-[10px] text-gray-600 font-mono mt-1 pt-1 opacity-60">ID: {certId}</p>
                            </div>
                        </div>
                    </div>
                </div>

            )
            }

            {/* --- ACTION BUTTONS --- */}

            <div className="flex flex-col md:flex-row gap-4 w-full justify-center mt-4">
                <button
                    onClick={handleDownloadPDF}
                    disabled={isGenerating}
                    className="flex items-center justify-center gap-2 bg-primary hover:bg-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isGenerating ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white border-opacity-50"></div>
                            Generando PDF...
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined">download</span>
                            Descargar Certificado (PDF)
                        </>
                    )}
                </button>

                <button
                    onClick={handleLinkedInShare}
                    className="flex items-center justify-center gap-2 bg-[#0077b5] hover:bg-[#006097] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-1 active:translate-y-0"
                >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    Añadir a LinkedIn
                </button>
            </div>

            <p className="text-gray-500 text-sm text-center max-w-2xl">
                Nota: Para descargar el certificado en alta calidad, asegúrate de estar en un dispositivo con pantalla grande o usa la versión de escritorio.
            </p>
        </div >
    );
};

export default CertificateDisplay;
