import React, { useState, useEffect } from 'react';
import { Appointment, Client, Pet } from '../types';
import { Clock, Play, CheckCircle, AlertCircle, X, Sparkles, User, BrainCircuit } from 'lucide-react';
import { analyzeConsultation } from '../services/geminiService';

interface QueueProps {
  appointments: Appointment[];
  clients: Client[];
  onUpdateAppointment: (appt: Appointment) => void;
}

export const Queue: React.FC<QueueProps> = ({ appointments, clients, onUpdateAppointment }) => {
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Completed'>('All');

  const filteredAppts = appointments.filter(a => filter === 'All' || a.status === filter);

  // Monitoring Form State
  const [notes, setNotes] = useState('');
  const [serviceType, setServiceType] = useState('Routine');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  useEffect(() => {
    if (selectedAppt) {
      setNotes(selectedAppt.notes || '');
      setServiceType(selectedAppt.serviceType);
      setAnalysisResult({
        riskScore: selectedAppt.riskScore,
        sentiment: selectedAppt.sentiment,
        healthTrend: selectedAppt.healthEvolution
      });
    }
  }, [selectedAppt]);

  const handleAIAnalysis = async () => {
    if (!notes) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeConsultation(notes, serviceType);
      setAnalysisResult(result);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveConsultation = () => {
    if (selectedAppt) {
      onUpdateAppointment({
        ...selectedAppt,
        notes,
        status: 'Completed',
        riskScore: analysisResult?.riskScore,
        sentiment: analysisResult?.sentiment,
        healthEvolution: analysisResult?.healthTrend
      });
      setSelectedAppt(null);
    }
  };

  const translateStatus = (s: string) => {
    switch(s) {
      case 'Pending': return 'Pendente';
      case 'In Progress': return 'Em Andamento';
      case 'Completed': return 'Concluído';
      default: return s;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-140px)]">
      
      {/* List Column */}
      <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
           <h3 className="font-bold text-slate-700">Fila Diária</h3>
           <div className="flex bg-white rounded-lg p-1 border border-slate-200">
             {(['All', 'Pending', 'In Progress'] as const).map(f => (
               <button 
                 key={f}
                 onClick={() => setFilter(f)}
                 className={`px-3 py-1 text-xs font-medium rounded ${filter === f ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 {f === 'All' ? 'Todos' : translateStatus(f)}
               </button>
             ))}
           </div>
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-2">
          {filteredAppts.map(appt => {
             const client = clients.find(c => c.id === appt.clientId);
             const pet = client?.pets.find(p => p.id === appt.petId);
             
             return (
               <div 
                 key={appt.id}
                 onClick={() => setSelectedAppt(appt)}
                 className={`p-4 rounded-lg border cursor-pointer transition-all ${
                   selectedAppt?.id === appt.id 
                    ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' 
                    : 'bg-white border-slate-200 hover:border-indigo-300'
                 }`}
               >
                 <div className="flex justify-between items-start mb-2">
                   <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        appt.status === 'Pending' ? 'bg-blue-400' :
                        appt.status === 'In Progress' ? 'bg-amber-400' : 'bg-green-400'
                      }`} />
                      <span className="text-xs font-semibold text-slate-500 uppercase">{translateStatus(appt.status)}</span>
                   </div>
                   <span className="text-xs font-mono text-slate-400">
                     {new Date(appt.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                   </span>
                 </div>
                 <h4 className="font-bold text-slate-800">{pet?.name} <span className="font-normal text-slate-500">({pet?.breed})</span></h4>
                 <p className="text-sm text-slate-600 mt-1">{client?.name}</p>
                 <div className="mt-3 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded border border-slate-200">
                      {appt.serviceType === 'Routine' ? 'Rotina' : appt.serviceType === 'Welcome' ? 'Boas-vindas' : 'Pós-Vet'}
                    </span>
                    <span className="text-xs text-slate-400">c/ {appt.vetName}</span>
                 </div>
               </div>
             );
          })}
        </div>
      </div>

      {/* Monitoring / Action Column */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
         {selectedAppt ? (
           <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                 <div>
                   <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                     Monitoramento Operacional
                     {selectedAppt.status === 'In Progress' && <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full"></span>}
                   </h2>
                   <p className="text-sm text-slate-500">ID da Consulta: #{selectedAppt.id.toUpperCase()}</p>
                 </div>
                 <div className="flex gap-2">
                    {selectedAppt.status === 'Pending' && (
                      <button 
                        onClick={() => onUpdateAppointment({...selectedAppt, status: 'In Progress'})}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 font-medium"
                      >
                        <Play size={18} /> Iniciar Consulta
                      </button>
                    )}
                    {selectedAppt.status === 'In Progress' && (
                      <button 
                         onClick={handleSaveConsultation}
                         className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium"
                      >
                        <CheckCircle size={18} /> Concluir & Assinar
                      </button>
                    )}
                 </div>
              </div>

              {/* Form Content */}
              <div className="flex-1 p-8 overflow-y-auto">
                 <div className="grid grid-cols-2 gap-6 mb-8">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Serviço</label>
                      <select 
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                        className="w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                      >
                        <option value="Welcome">Boas-vindas / Triagem</option>
                        <option value="Routine">Consulta de Rotina</option>
                        <option value="Post-Vet">Retorno / Pós-Vet</option>
                        <option value="Emergency">Emergência</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Veterinário Responsável</label>
                      <div className="w-full rounded-lg border-slate-200 border p-2.5 bg-slate-50 text-slate-600 flex items-center gap-2">
                         <User size={16} /> {selectedAppt.vetName}
                      </div>
                    </div>
                 </div>

                 <div className="mb-6">
                   <div className="flex justify-between items-center mb-2">
                     <label className="block text-sm font-medium text-slate-700">Notas Clínicas & Observações</label>
                     <button 
                        onClick={handleAIAnalysis}
                        disabled={isAnalyzing || !notes}
                        className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 disabled:opacity-50 font-medium"
                     >
                       <BrainCircuit size={14} /> 
                       {isAnalyzing ? 'Analisando...' : 'Analisar com IA'}
                     </button>
                   </div>
                   <textarea 
                     className="w-full h-40 rounded-lg border-slate-300 border p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 leading-relaxed"
                     placeholder="Insira detalhes sobre peso, temperatura, humor e exame físico..."
                     value={notes}
                     onChange={(e) => setNotes(e.target.value)}
                   />
                 </div>

                 {/* Analysis Results */}
                 {(analysisResult || selectedAppt.riskScore) && (
                   <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                        <Sparkles size={18} className="text-amber-500" />
                        Análise de Risco (IA)
                      </h4>
                      <div className="grid grid-cols-3 gap-6">
                        
                        {/* Risk Score */}
                        <div className="text-center p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                           <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Risco</p>
                           <div className={`text-3xl font-bold ${
                             (analysisResult?.riskScore ?? 0) > 70 ? 'text-red-600' : 
                             (analysisResult?.riskScore ?? 0) > 30 ? 'text-amber-600' : 'text-green-600'
                           }`}>
                             {analysisResult?.riskScore ?? 0}
                           </div>
                        </div>

                         {/* Sentiment */}
                         <div className="text-center p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                           <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Sentimento (Dono)</p>
                           <div className="text-lg font-bold text-slate-800 mt-1">
                             {analysisResult?.sentiment === 'Positive' ? 'Positivo' : analysisResult?.sentiment === 'Negative' ? 'Negativo' : 'Neutro' || 'Neutro'}
                           </div>
                        </div>

                        {/* Health Evolution */}
                        <div className="text-center p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                           <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Tendência Saúde</p>
                           <div className="text-lg font-bold text-slate-800 mt-1 capitalize">
                             {analysisResult?.healthTrend === 'improving' ? 'Melhorando' : analysisResult?.healthTrend === 'declining' ? 'Piorando' : 'Estável' || 'Estável'}
                           </div>
                        </div>

                      </div>
                      
                      {analysisResult?.summary && (
                        <div className="mt-4 p-3 bg-indigo-50 rounded border border-indigo-100 text-sm text-indigo-800">
                          <strong>Resumo:</strong> {analysisResult.summary}
                        </div>
                      )}
                   </div>
                 )}
              </div>
           </div>
         ) : (
           <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Clock size={32} />
              </div>
              <p className="font-medium">Selecione um agendamento para iniciar</p>
           </div>
         )}
      </div>
    </div>
  );
};
