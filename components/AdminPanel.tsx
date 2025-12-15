import React, { useEffect, useState } from 'react';
import { ExamResult } from '../types';
import { LogOut, Search, Trash2 } from 'lucide-react';

interface AdminPanelProps {
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedResults = localStorage.getItem('exam_results');
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
  }, []);

  const handleClearData = () => {
    if (confirm('¿Está seguro de que desea borrar todos los registros? Esta acción no se puede deshacer.')) {
      localStorage.removeItem('exam_results');
      // Also clear individual attempts to allow retakes if needed
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('exam_taken_')) {
          localStorage.removeItem(key);
        }
      });
      setResults([]);
    }
  };

  const filteredResults = results.filter(r => 
    r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.collegiateNumber.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-brand-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-brand-900">Panel de Administración</h1>
          <div className="flex gap-4">
             <button
              onClick={handleClearData}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <Trash2 size={18} />
              Borrar Registros
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-brand-200 text-brand-800 rounded-lg hover:bg-brand-300 transition-colors"
            >
              <LogOut size={18} />
              Salir
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-brand-100">
          <div className="p-4 border-b border-brand-100 bg-brand-50 flex items-center gap-4">
            <Search className="text-brand-400" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o número de colegiado..." 
              className="w-full bg-transparent border-none focus:ring-0 text-brand-900 placeholder-brand-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-brand-100 text-brand-900">
                <tr>
                  <th className="p-4 font-semibold">Fecha</th>
                  <th className="p-4 font-semibold">Nombre Completo</th>
                  <th className="p-4 font-semibold">No. Colegiado</th>
                  <th className="p-4 font-semibold">Tipo</th>
                  <th className="p-4 font-semibold text-right">Nota / 100</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-50">
                {filteredResults.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      No hay registros encontrados.
                    </td>
                  </tr>
                ) : (
                  filteredResults.map((result, index) => (
                    <tr key={index} className="hover:bg-brand-50 transition-colors">
                      <td className="p-4 text-gray-600">
                        {new Date(result.date).toLocaleDateString()} {new Date(result.date).toLocaleTimeString()}
                      </td>
                      <td className="p-4 font-medium text-brand-900">{result.fullName}</td>
                      <td className="p-4 text-gray-600">{result.collegiateNumber}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          result.type === 'OFFICIAL' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {result.type === 'OFFICIAL' ? 'OFICIAL' : 'PRÁCTICA'}
                        </span>
                      </td>
                      <td className="p-4 text-right font-bold text-brand-700">{result.score}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};