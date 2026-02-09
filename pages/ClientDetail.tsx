import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Client, Pet, AuditLog } from '../types';
import { ChevronLeft, Plus, History, Activity, Syringe, FileText, DollarSign } from 'lucide-react';

interface ClientDetailProps {
  clients: Client[];
  logs: AuditLog[];
}

export const ClientDetail: React.FC<ClientDetailProps> = ({ clients, logs }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const client = clients.find(c => c.id === id);

  if (!client) return <div className="p-8">Cliente não encontrado</div>;

  const clientLogs = logs.filter(l => l.clientId === client.id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getLogIcon = (type: AuditLog['type']) => {
    switch (type) {
      case 'Medical': return <Syringe size={16} />;
      case 'Financial': return <DollarSign size={16} />;
      case 'Admin': return <FileText size={16} />;
      default: return <Activity size={16} />;
    }
  };

  const getLogColor = (type: AuditLog['type']) => {
    switch (type) {
      case 'Medical': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 'Financial': return 'bg-amber-100 text-amber-600 border-amber-200';
      case 'Admin': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-indigo-100 text-indigo-600';
    }
  };

  const translateStatus = (status: string) => {
      switch(status) {
          case 'Active': return 'Ativo';
          case 'Inactive': return 'Inativo';
          case 'In Limbo': 'No Limbo';
          default: return status;
      }
  }

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/clients')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
        <ChevronLeft size={20} /> Voltar para Clientes
      </button>

      {/* Client Header */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div className="flex items-center gap-6">
           <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600">
             {client.name.charAt(0)}
           </div>
           <div>
             <h1 className="text-2xl font-bold text-slate-900">{client.name}</h1>
             <div className="flex gap-4 mt-2 text-sm text-slate-500">
               <span>{client.email}</span>
               <span>•</span>
               <span>{client.phone}</span>
               <span>•</span>
               <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium uppercase">{translateStatus(client.status)}</span>
             </div>
           </div>
        </div>
        
        <div className="flex gap-3">
           <div className="text-right mr-4">
             <p className="text-xs text-slate-500 uppercase font-semibold">Plano Atual</p>
             <p className="text-xl font-bold text-slate-900">{client.plan}</p>
           </div>
           <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
             Editar Perfil
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Pets Column */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Pets</h2>
            <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
              <Plus size={20} />
            </button>
          </div>
          
          {client.pets.map(pet => (
            <div key={pet.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer group">
              <div className="flex gap-4">
                <img src={pet.imageUrl} alt={pet.name} className="w-16 h-16 rounded-lg object-cover bg-slate-100" />
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 group-hover:text-indigo-600">{pet.name}</h3>
                  <p className="text-sm text-slate-500">{pet.breed}, {pet.age} anos</p>
                  <div className="mt-2 flex items-center gap-2 text-xs font-medium">
                    <span className="px-2 py-1 bg-slate-100 rounded text-slate-600">{pet.weight} kg</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               <History size={20} className="text-slate-400" /> 
               Histórico & Auditoria
             </h2>
             <button className="text-sm text-indigo-600 hover:underline">Exportar Histórico</button>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
             <div className="relative border-l-2 border-slate-200 space-y-8 pl-8">
               {clientLogs.map((log) => (
                 <div key={log.id} className="relative">
                   <div className={`absolute -left-[41px] p-2 rounded-full border-2 border-white shadow-sm ${getLogColor(log.type)}`}>
                     {getLogIcon(log.type)}
                   </div>
                   <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                     <div>
                       <h4 className="font-bold text-slate-800">{log.action}</h4>
                       <p className="text-slate-600 mt-1 text-sm">{log.details}</p>
                       <p className="text-xs text-slate-400 mt-2">
                         Por <span className="font-medium text-slate-600">{log.user}</span>
                         {log.petId && ` • Pet: ${client.pets.find(p => p.id === log.petId)?.name || 'Desconhecido'}`}
                       </p>
                     </div>
                     <span className="text-xs font-medium text-slate-400 whitespace-nowrap bg-slate-50 px-2 py-1 rounded">
                       {new Date(log.timestamp).toLocaleDateString('pt-BR')}
                     </span>
                   </div>
                 </div>
               ))}
               
               {/* Start Node */}
               <div className="relative">
                  <div className="absolute -left-[39px] h-4 w-4 rounded-full bg-slate-300 border-2 border-white"></div>
                  <p className="text-sm text-slate-400 italic">Cliente registrado em {new Date(client.joinedDate).toLocaleDateString('pt-BR')}</p>
               </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};
