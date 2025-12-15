import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Question, QuizState, User, QuizType } from '../types';
import { Flag, CheckCircle, Clock, ArrowRight, ArrowLeft, Menu, X, Grid, AlertTriangle } from 'lucide-react';

interface QuizProps {
  questions: Question[];
  user: User;
  quizType: QuizType;
  onFinish: (score: number, answers: Record<number, string>) => void;
}

export const Quiz: React.FC<QuizProps> = ({ questions, user, quizType, onFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [marked, setMarked] = useState<number[]>([]);
  // Time limit: 90 seconds * number of questions
  const [timeLeft, setTimeLeft] = useState(questions.length * 90);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showFinishConfirmation, setShowFinishConfirmation] = useState(false);

  // Refs for state that is accessed inside callbacks/effects to prevent stale closures without re-triggering effects
  const answersRef = useRef(answers);
  const isSubmittedRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  // Update answers ref whenever answers state changes
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const currentQuestion = questions[currentQuestionIndex];

  // Logic to finish exam
  const finishExam = useCallback(() => {
    if (isSubmittedRef.current) return;
    isSubmittedRef.current = true;
    setShowFinishConfirmation(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const finalAnswers = answersRef.current;
    let calculatedScore = 0;
    questions.forEach(q => {
      if (finalAnswers[q.id] === q.correctOptionId) {
        calculatedScore += (100 / questions.length);
      }
    });

    onFinish(Math.round(calculatedScore), finalAnswers);
  }, [questions, onFinish]);

  // Handle "Finish" button click - Opens Modal
  const handleFinishClick = () => {
    setShowFinishConfirmation(true);
  };

  // Anti-cheat detection
  useEffect(() => {
    if (quizType !== QuizType.OFFICIAL) return;

    const handleVisibilityChange = () => {
      if (document.hidden && !isSubmittedRef.current) {
        alert("Advertencia de seguridad: Se ha detectado un cambio de pestaña. El examen se enviará automáticamente.");
        finishExam();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [quizType, finishExam]);

  // Timer Effect
  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [finishExam]);

  const toggleMark = (id: number) => {
    setMarked(prev => 
      prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
    );
  };

  const handleSelectOption = (optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionId
    }));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = (Object.keys(answers).length / questions.length) * 100;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      
      {/* Confirmation Modal */}
      {showFinishConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden transform scale-100 animate-in zoom-in-95 duration-200">
            <div className="bg-brand-50 p-6 flex justify-center border-b border-brand-100">
              <div className="w-16 h-16 bg-white border-4 border-brand-100 rounded-full flex items-center justify-center text-brand-600 shadow-sm">
                 <CheckCircle size={32} />
              </div>
            </div>
            
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">¿Finalizar Examen?</h3>
              <p className="text-gray-500 mb-6 text-sm">
                Estás a punto de enviar tus respuestas. Una vez enviado, no podrás realizar cambios.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-3 mb-6 border border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Progreso</span>
                  <span className="text-lg font-bold text-brand-700">
                    {Object.keys(answers).length} <span className="text-gray-400 font-normal">de</span> {questions.length}
                  </span>
                  <span className="text-xs text-gray-500 block">Preguntas respondidas</span>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowFinishConfirmation(false)}
                  className="flex-1 py-3 px-4 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 hover:text-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={finishExam}
                  className="flex-1 py-3 px-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative z-40 h-full w-80 bg-white border-r border-gray-200 shadow-xl md:shadow-none flex flex-col transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 bg-brand-900 text-white flex-shrink-0">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-xl font-bold">Navegación</h2>
                    <div className="text-sm opacity-90 mt-1">
                        {user.fullName}
                    </div>
                    <div className="text-xs text-brand-300">Col: {user.collegiateNumber}</div>
                </div>
                <button 
                    onClick={() => setIsSidebarOpen(false)} 
                    className="md:hidden text-white hover:bg-brand-800 p-1 rounded"
                >
                    <X size={20} />
                </button>
            </div>
            
            <div className="flex items-center gap-3 bg-brand-800 p-3 rounded-lg border border-brand-700">
            <Clock size={20} className="text-brand-300" />
            <div className="flex flex-col">
                <span className="text-xs text-brand-300 uppercase font-bold">Tiempo Restante</span>
                <span className={`font-mono text-2xl font-bold leading-none ${timeLeft < 60 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                    {formatTime(timeLeft)}
                </span>
            </div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-white">
            <div className="grid grid-cols-4 gap-2">
            {questions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isMarked = marked.includes(q.id);
                const isCurrent = currentQuestionIndex === idx;

                let baseClass = "h-12 w-full rounded-lg flex items-center justify-center text-sm font-bold border-2 transition-all cursor-pointer relative";
                
                if (isCurrent) {
                baseClass += " border-brand-500 bg-brand-50 text-brand-700 shadow-sm";
                } else if (isAnswered) {
                baseClass += " bg-brand-600 text-white border-brand-600";
                } else {
                baseClass += " bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100 hover:border-gray-200";
                }

                return (
                <button
                    key={q.id}
                    onClick={() => {
                        setCurrentQuestionIndex(idx);
                        setIsSidebarOpen(false);
                    }}
                    className={baseClass}
                >
                    {idx + 1}
                    {isMarked && (
                    <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 rounded-full p-0.5 shadow-sm ring-1 ring-white">
                        <Flag size={10} fill="currentColor" />
                    </div>
                    )}
                </button>
                );
            })}
            </div>
            
            <div className="mt-8 space-y-3 text-xs text-gray-500 px-2 font-medium">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-brand-600 shadow-sm"></div> Respondida
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-brand-50 border-2 border-brand-500 shadow-sm"></div> Actual
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gray-50 border-2 border-gray-100"></div> Pendiente
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white border border-gray-200 flex items-center justify-center">
                    <Flag size={10} className="text-yellow-500" fill="currentColor" /> 
                </div>
                Marcada
            </div>
            </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3 overflow-hidden">
            <div className="bg-brand-600 h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mb-4 font-medium">
                <span>Progreso</span>
                <span>{Math.round(progress)}%</span>
            </div>
            <button 
            onClick={handleFinishClick}
            className="w-full py-3 bg-brand-800 hover:bg-brand-900 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
            <CheckCircle size={18} />
            Finalizar Examen
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full w-full relative">
        {/* Header Mobile */}
        <div className="md:hidden bg-brand-900 text-white p-4 flex justify-between items-center shadow-md z-20 sticky top-0">
           <div className="flex items-center gap-3">
               <button onClick={() => setIsSidebarOpen(true)} className="p-1 hover:bg-brand-800 rounded">
                   <Menu size={24} />
               </button>
               <span className="text-sm font-medium opacity-90">Pregunta {currentQuestionIndex + 1}/{questions.length}</span>
           </div>
           
           <div className={`font-mono font-bold text-lg px-3 py-1 rounded bg-brand-800 border border-brand-700 ${timeLeft < 60 ? 'text-red-300 border-red-900 bg-red-900/50' : ''}`}>
               {formatTime(timeLeft)}
           </div>
        </div>

        {/* Question Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-12 bg-brand-50 scroll-smooth">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            <div className="bg-white rounded-2xl shadow-xl border border-brand-100 flex flex-col overflow-hidden min-h-[500px]">
              
              {/* Card Header */}
              <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                     <span className="bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        Pregunta {currentQuestionIndex + 1}
                     </span>
                     {answers[currentQuestion.id] && (
                         <span className="flex items-center gap-1 text-green-600 text-xs font-bold">
                             <CheckCircle size={14} /> Respondida
                         </span>
                     )}
                </div>
                
                <button 
                  onClick={() => toggleMark(currentQuestion.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    marked.includes(currentQuestion.id) 
                      ? 'bg-yellow-100 text-yellow-800 ring-2 ring-yellow-400 ring-offset-1' 
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <Flag size={16} fill={marked.includes(currentQuestion.id) ? "currentColor" : "none"} />
                  {marked.includes(currentQuestion.id) ? 'Revisar luego' : 'Marcar para revisar'}
                </button>
              </div>

              {/* Question Text */}
              <div className="px-6 md:px-8 py-6">
                 <h1 className="text-lg md:text-2xl font-medium text-gray-800 leading-relaxed">
                    {currentQuestion.text}
                 </h1>
              </div>

              {/* Options */}
              <div className="px-6 md:px-8 pb-8 space-y-3 flex-1">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4 group relative overflow-hidden ${
                      answers[currentQuestion.id] === option.id
                        ? 'border-brand-500 bg-brand-50 shadow-md'
                        : 'border-gray-100 hover:border-brand-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 shrink-0 transition-colors mt-0.5 ${
                       answers[currentQuestion.id] === option.id
                        ? 'bg-brand-500 border-brand-500 text-white'
                        : 'bg-white border-gray-300 text-gray-400 group-hover:border-brand-300 group-hover:text-brand-400'
                    }`}>
                      {option.id}
                    </div>
                    <span className={`text-base leading-relaxed ${answers[currentQuestion.id] === option.id ? 'text-brand-900 font-medium' : 'text-gray-600'}`}>
                      {option.text}
                    </span>
                    
                    {answers[currentQuestion.id] === option.id && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-500 opacity-20">
                            <CheckCircle size={48} />
                        </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Card Footer / Navigation */}
              <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-100 mt-auto">
                 <div className="flex justify-between items-center">
                    <button
                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
                        currentQuestionIndex === 0
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'bg-white text-brand-600 shadow-sm hover:shadow-md hover:bg-gray-50 border border-gray-200'
                        }`}
                    >
                        <ArrowLeft size={20} />
                        <span className="hidden md:inline">Anterior</span>
                    </button>

                    <div className="hidden md:flex gap-1">
                        {questions.map((_, i) => (
                            <div key={i} className={`w-2 h-2 rounded-full ${i === currentQuestionIndex ? 'bg-brand-500' : 'bg-gray-200'}`}></div>
                        ))}
                    </div>

                    {currentQuestionIndex < questions.length - 1 ? (
                        <button
                        onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                        className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-lg font-bold shadow-md hover:bg-brand-700 hover:shadow-brand-500/30 transition-all"
                        >
                        <span className="hidden md:inline">Siguiente</span>
                        <ArrowRight size={20} />
                        </button>
                    ) : (
                        <button
                        onClick={handleFinishClick}
                        className="flex items-center gap-2 px-8 py-3 bg-brand-800 text-white rounded-lg font-bold shadow-md hover:bg-brand-900 hover:shadow-lg transition-all"
                        >
                        Finalizar
                        <CheckCircle size={20} />
                        </button>
                    )}
                </div>
              </div>

            </div>
            
            <p className="text-center text-xs text-brand-300 mt-6 opacity-60">
                Sistema de Evaluación Segura &copy; 2025
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};