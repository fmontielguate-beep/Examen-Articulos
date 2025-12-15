import React, { useState, useEffect } from 'react';
import { User, AppMode, QuizType, ExamResult } from './types';
import { QUESTIONS } from './data/questions';
import { Quiz } from './components/Quiz';
import { Result } from './components/Result';
import { AdminPanel } from './components/AdminPanel';
import { Lock, User as UserIcon, BookOpen, ShieldCheck } from 'lucide-react';

function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.LOGIN);
  const [quizType, setQuizType] = useState<QuizType>(QuizType.OFFICIAL);
  const [user, setUser] = useState<User>({ fullName: '', collegiateNumber: '' });
  const [password, setPassword] = useState('');
  const [score, setScore] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState(QUESTIONS);
  const [error, setError] = useState('');

  // Shuffle questions helper
  const shuffle = (array: any[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const handleStartLogin = (type: string) => {
    // Reset state
    setError('');
    setPassword('');
    
    if (type === 'ADMIN') {
        setMode(AppMode.ADMIN);
        return;
    }

    if (!user.fullName.trim() || !user.collegiateNumber.trim()) {
      setError('Por favor ingrese su nombre y número de colegiado.');
      return;
    }

    if (type === 'OFFICIAL') {
      // Check if already taken
      if (localStorage.getItem(`exam_taken_${user.collegiateNumber}`)) {
        setError('Usted ya ha realizado el examen oficial. No se permiten múltiples intentos.');
        return;
      }
      setQuizType(QuizType.OFFICIAL);
      startQuiz();
    } else {
      setQuizType(QuizType.PRACTICE);
      setMode(AppMode.INSTRUCTION); // Ask for password
    }
  };

  const verifyPassword = () => {
    if (mode === AppMode.ADMIN) {
        if (password === 'Miquel2021') {
            return true; 
        } else {
            setError('Contraseña de administrador incorrecta.');
            return false;
        }
    } else {
        // Practice
        if (password === 'Helena2016') {
            startQuiz();
            return true;
        } else {
             setError('Contraseña de práctica incorrecta.');
             return false;
        }
    }
  };

  const startQuiz = () => {
    setShuffledQuestions(shuffle(QUESTIONS));
    setMode(AppMode.QUIZ);
  };

  const handleFinishQuiz = (finalScore: number) => {
    // Update State FIRST to ensure UI feedback
    setScore(finalScore);
    setMode(AppMode.RESULT);

    // Save result safely
    try {
      const newResult: ExamResult = {
        fullName: user.fullName,
        collegiateNumber: user.collegiateNumber,
        score: finalScore,
        date: new Date().toISOString(),
        type: quizType
      };

      const existingResults = JSON.parse(localStorage.getItem('exam_results') || '[]');
      localStorage.setItem('exam_results', JSON.stringify([...existingResults, newResult]));

      if (quizType === QuizType.OFFICIAL) {
        localStorage.setItem(`exam_taken_${user.collegiateNumber}`, 'true');
      }
    } catch (e) {
      console.error("Error saving result to local storage", e);
      // Fallback or alert if needed, but UI has already moved to Result
    }
  };

  // --- RENDER VIEWS ---

  if (mode === AppMode.ADMIN) {
     if (password !== 'Miquel2021') {
         return (
             <div className="min-h-screen bg-brand-50 flex items-center justify-center p-4">
                 <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-brand-100">
                     <div className="flex justify-center mb-6 text-brand-600"><Lock size={48} /></div>
                     <h2 className="text-2xl font-bold text-center text-brand-900 mb-6">Acceso Administrativo</h2>
                     {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
                     <input
                        type="password"
                        placeholder="Contraseña"
                        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-brand-500 outline-none"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                     />
                     <div className="flex gap-3">
                         <button onClick={() => setMode(AppMode.LOGIN)} className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-lg">Cancelar</button>
                         <button onClick={() => verifyPassword()} className="flex-1 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700">Entrar</button>
                     </div>
                 </div>
             </div>
         )
     }
     return <AdminPanel onLogout={() => { setMode(AppMode.LOGIN); setPassword(''); }} />;
  }

  if (mode === AppMode.INSTRUCTION) {
      return (
           <div className="min-h-screen bg-brand-50 flex items-center justify-center p-4">
               <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-brand-100">
                   <div className="flex justify-center mb-6 text-brand-600"><BookOpen size={48} /></div>
                   <h2 className="text-2xl font-bold text-center text-brand-900 mb-2">Modo Práctica</h2>
                   <p className="text-center text-gray-500 mb-6">Ingrese la contraseña del curso de prueba.</p>
                   {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
                   <input
                      type="password"
                      placeholder="Contraseña"
                      className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-brand-500 outline-none"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                   />
                   <div className="flex gap-3">
                       <button onClick={() => setMode(AppMode.LOGIN)} className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-lg">Cancelar</button>
                       <button onClick={() => verifyPassword()} className="flex-1 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700">Comenzar</button>
                   </div>
               </div>
           </div>
      );
  }

  if (mode === AppMode.QUIZ) {
    return (
      <Quiz 
        questions={shuffledQuestions}
        user={user}
        quizType={quizType}
        onFinish={handleFinishQuiz}
      />
    );
  }

  if (mode === AppMode.RESULT) {
    return (
      <Result 
        score={score}
        user={user}
        quizType={quizType}
        onRestart={startQuiz}
        onLogout={() => { setMode(AppMode.LOGIN); setUser({fullName: '', collegiateNumber: ''}); }}
      />
    );
  }

  // LOGIN SCREEN
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-lg w-full relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-brand-600"></div>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-brand-900 mb-2">Evaluación de Escritura</h1>
          <p className="text-gray-500">Curso de Escritura Científica</p>
        </div>

        {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2">
                <ShieldCheck size={18} className="mt-0.5 shrink-0" />
                {error}
            </div>
        )}

        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
            <div className="relative">
                <UserIcon className="absolute left-3 top-3 text-gray-400" size={20} />
                <input 
                  type="text" 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all outline-none"
                  placeholder="Ingrese su nombre"
                  value={user.fullName}
                  onChange={e => setUser({...user, fullName: e.target.value})}
                />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número de Colegiado</label>
            <div className="relative">
                <ShieldCheck className="absolute left-3 top-3 text-gray-400" size={20} />
                <input 
                  type="text" 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all outline-none"
                  placeholder="Ingrese su número"
                  value={user.collegiateNumber}
                  onChange={e => setUser({...user, collegiateNumber: e.target.value})}
                />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => handleStartLogin('OFFICIAL')}
            className="group relative p-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl transition-all shadow-lg hover:shadow-brand-500/30 flex flex-col items-center justify-center gap-2"
          >
            <span className="font-bold text-lg">Examen Oficial</span>
            <span className="text-xs opacity-75 group-hover:opacity-100">Un solo intento</span>
          </button>

          <button 
            onClick={() => handleStartLogin('PRACTICE')}
            className="group relative p-4 bg-white border-2 border-brand-200 hover:border-brand-400 text-brand-700 rounded-xl transition-all hover:bg-brand-50 flex flex-col items-center justify-center gap-2"
          >
             <span className="font-bold text-lg">Modo Práctica</span>
             <span className="text-xs opacity-75">Reiniciable</span>
          </button>
        </div>

        <div className="mt-8 text-center">
            <button 
                onClick={() => handleStartLogin('ADMIN')}
                className="text-xs text-gray-400 hover:text-brand-600 underline"
            >
                Acceso Administrador
            </button>
        </div>
      </div>
    </div>
  );
}

export default App;