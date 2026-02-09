import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { ClientDetail } from './pages/ClientDetail';
import { Queue } from './pages/Queue';
import { MOCK_CLIENTS, MOCK_APPOINTMENTS, MOCK_LOGS } from './constants';
import { Client, Appointment, AuditLog } from './types';
import { Users } from 'lucide-react';

const App = () => {
  // Central State Simulation (In a real app, this would be Redux/Context/React Query)
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [logs, setLogs] = useState<AuditLog[]>(MOCK_LOGS);

  const handleUpdateAppointment = (updatedAppt: Appointment) => {
    // Update Appt List
    setAppointments(prev => prev.map(a => a.id === updatedAppt.id ? updatedAppt : a));

    // Create Audit Log if completed
    if (updatedAppt.status === 'Completed') {
      const newLog: AuditLog = {
        id: `l${Date.now()}`,
        clientId: updatedAppt.clientId,
        petId: updatedAppt.petId,
        timestamp: new Date().toISOString(),
        action: 'Consulta Concluída',
        user: updatedAppt.vetName,
        details: `Notas: ${updatedAppt.notes?.substring(0, 50)}... Risco: ${updatedAppt.riskScore}`,
        type: 'Medical'
      };
      setLogs(prev => [newLog, ...prev]);
    }
  };

  const translateStatus = (status: string) => {
    switch(status) {
        case 'Active': return 'Ativo';
        case 'Inactive': return 'Inativo';
        case 'In Limbo': return 'No Limbo';
        default: return status;
    }
  }

  const ClientList = () => (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-slate-800">Diretório de Clientes</h1>
         <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 shadow-sm transition-colors">
           + Novo Cliente
         </button>
       </div>
       <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         <table className="w-full text-left text-sm text-slate-600">
           <thead className="bg-slate-50 text-slate-700 uppercase font-medium text-xs">
             <tr>
               <th className="px-6 py-4">Nome</th>
               <th className="px-6 py-4">Plano</th>
               <th className="px-6 py-4">Pets</th>
               <th className="px-6 py-4">Status</th>
               <th className="px-6 py-4"></th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {clients.map(client => (
               <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                 <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                     {client.name.charAt(0)}
                   </div>
                   {client.name}
                 </td>
                 <td className="px-6 py-4"><span className="px-2 py-1 bg-slate-100 rounded text-slate-600 text-xs font-semibold">{client.plan}</span></td>
                 <td className="px-6 py-4">{client.pets.length} Pets</td>
                 <td className="px-6 py-4">
                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                     client.status === 'Active' ? 'bg-green-100 text-green-700' : 
                     client.status === 'In Limbo' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
                   }`}>
                     {translateStatus(client.status)}
                   </span>
                 </td>
                 <td className="px-6 py-4 text-right">
                   <a href={`#/clients/${client.id}`} className="text-indigo-600 font-medium hover:underline">Detalhes</a>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
    </div>
  );

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard clients={clients} appointments={appointments} />} />
          <Route path="/clients" element={<ClientList />} />
          <Route path="/clients/:id" element={<ClientDetail clients={clients} logs={logs} />} />
          <Route path="/queue" element={<Queue appointments={appointments} clients={clients} onUpdateAppointment={handleUpdateAppointment} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
