import React, { useRef } from 'react';
import { User, QuizType } from '../types';
import { Download, RefreshCw, LogOut, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ResultProps {
  score: number;
  user: User;
  quizType: QuizType;
  onRestart: () => void;
  onLogout: () => void;
}

export const Result: React.FC<ResultProps> = ({ score, user, quizType, onRestart, onLogout }) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const generateImage = async (format: 'jpg' | 'pdf') => {
    if (certificateRef.current) {
      // Create canvas with high scale for quality
      const canvas = await html2canvas(certificateRef.current, { scale: 3 });
      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      if (format === 'jpg') {
        const link = document.createElement("a");
        link.href = imgData;
        link.download = `Certificado_${user.collegiateNumber}.jpg`;
        link.click();
      } else {
        // PDF Landscape A4
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [canvas.width, canvas.height] // Match canvas dimensions to avoid resizing issues
        });
        pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
        pdf.save(`Certificado_${user.collegiateNumber}.pdf`);
      }
    }
  };

  const isPassed = score >= 70;

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-brand-100">
          <div className="bg-brand-900 p-6 text-center text-white">
             <h2 className="text-3xl font-bold mb-2">
                {isPassed ? '¡Excelente trabajo!' : 'Examen Finalizado'}
             </h2>
             <p className="text-brand-100 opacity-90">
               {quizType === QuizType.OFFICIAL ? 'Intento Oficial' : 'Modo Práctica'}
             </p>
          </div>

          <div className="p-8 text-center">
             <div className="mb-8 inline-flex items-center justify-center w-32 h-32 rounded-full bg-brand-50 border-4 border-brand-100 shadow-inner">
                <div className="text-center">
                    <span className={`text-5xl font-bold block ${isPassed ? 'text-green-600' : 'text-brand-700'}`}>
                        {score}
                    </span>
                    <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Puntos</span>
                </div>
             </div>
             
             <p className="text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
                Estimado/a <strong>{user.fullName}</strong>, has completado la evaluación con un puntaje de {score}/100. 
                {isPassed 
                    ? " Has demostrado un dominio sólido de los conceptos de escritura científica." 
                    : " Te animamos a repasar los materiales y volver a intentarlo en el modo de práctica."}
             </p>

             <div className="flex justify-center gap-4 flex-wrap">
                <button 
                  onClick={() => generateImage('jpg')}
                  className="flex items-center gap-2 px-5 py-3 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 transition-colors shadow-lg hover:shadow-brand-500/30"
                >
                  <Download size={20} /> Guardar Imagen
                </button>

                <button 
                  onClick={() => generateImage('pdf')}
                  className="flex items-center gap-2 px-5 py-3 bg-brand-800 text-white rounded-lg font-bold hover:bg-brand-900 transition-colors shadow-lg hover:shadow-brand-700/30"
                >
                  <FileText size={20} /> Guardar PDF
                </button>
                
                {quizType === QuizType.PRACTICE && (
                   <button 
                    onClick={onRestart}
                    className="flex items-center gap-2 px-5 py-3 bg-white text-brand-600 border border-brand-200 rounded-lg font-bold hover:bg-brand-50 transition-colors"
                  >
                    <RefreshCw size={20} /> Reiniciar
                  </button>
                )}

                 <button 
                  onClick={onLogout}
                  className="flex items-center gap-2 px-5 py-3 bg-gray-100 text-gray-600 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                >
                  <LogOut size={20} /> Salir
                </button>
             </div>
          </div>
        </div>

        {/* Hidden certificate for screenshot */}
        <div className="overflow-hidden h-0 w-0">
             <div 
                ref={certificateRef} 
                className="w-[1200px] h-[800px] bg-white p-16 relative flex flex-col items-center text-brand-900 shadow-2xl"
                style={{ fontFamily: "'Times New Roman', serif" }}
             >
                {/* Decorative Borders */}
                <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-brand-200 pointer-events-none"></div>
                <div className="absolute top-6 left-6 right-6 bottom-6 border-4 border-brand-900 pointer-events-none"></div>
                
                {/* Watermark/Background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none z-0">
                    <div className="w-[500px] h-[500px] rounded-full border-[40px] border-black"></div>
                </div>

                {/* Header */}
                <div className="z-10 text-center w-full mt-12">
                    <div className="flex justify-center mb-6 text-brand-800">
                        {/* Simple Logo Icon */}
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 10v6M2 10v6M12 2v20M12 12H2M12 12h10M12 12l-5-5M12 12l5-5" />
                        </svg>
                    </div>
                    
                    <h1 className="text-6xl font-bold mb-4 tracking-tight text-brand-900">CERTIFICADO</h1>
                    <p className="text-xl uppercase tracking-[0.4em] text-brand-500 font-sans mb-12">De Finalización</p>
                    
                    <p className="text-2xl italic text-gray-600 mb-8 font-serif">Se otorga el presente reconocimiento a</p>
                    
                    <h2 className="text-5xl font-bold text-brand-800 mb-4 border-b-2 border-brand-200 inline-block px-12 pb-4">
                        {user.fullName}
                    </h2>
                    
                    <p className="text-xl text-gray-500 mb-10 font-sans">
                        No. Colegiado: <span className="font-bold text-brand-700">{user.collegiateNumber}</span>
                    </p>
                    
                    <p className="text-2xl mb-2 max-w-3xl mx-auto leading-relaxed">
                        Por haber completado satisfactoriamente la evaluación de conocimientos del
                    </p>
                    <h3 className="text-3xl font-bold mb-12 text-brand-900">
                        Curso de Escritura Científica
                    </h3>
                </div>

                {/* Footer / Stats */}
                <div className="w-full max-w-4xl flex justify-between items-end z-10 mt-auto mb-8 font-sans">
                    <div className="text-center">
                        <div className="text-5xl font-bold text-brand-600 mb-2">{score}%</div>
                        <div className="text-sm uppercase tracking-wider text-gray-400 font-bold">Puntuación Final</div>
                    </div>
                    
                    <div className="text-center px-12">
                         {/* Badge */}
                         <div className="w-24 h-24 rounded-full border-4 border-brand-200 flex items-center justify-center text-brand-200 mb-2">
                             <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                         </div>
                    </div>

                    <div className="text-center">
                        <p className="text-lg font-bold text-brand-900">{new Date().toLocaleDateString()}</p>
                        <div className="w-48 h-px bg-brand-300 my-2"></div>
                        <p className="text-sm uppercase tracking-wider text-gray-400 font-bold">Fecha de Emisión</p>
                    </div>
                </div>
             </div>
        </div>

      </div>
    </div>
  );
};