import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, TrendingUp, Users, Clock } from 'lucide-react';
import { Client, Appointment } from '../types';

interface DashboardProps {
  clients: Client[];
  appointments: Appointment[];
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

export const Dashboard: React.FC<DashboardProps> = ({ clients, appointments }) => {
  // Logic for "In Limbo": Active clients with no future appointments
  const now = new Date();
  const limboClients = clients.filter(c => {
    const hasFutureAppt = appointments.some(a => a.clientId === c.id && new Date(a.date) > now);
    return c.status === 'Active' && !hasFutureAppt;
  });

  // Risk Distribution Data (Mock logic based on appt scores)
  const riskData = [
    { name: 'Baixo Risco', value: 65 },
    { name: 'Médio Risco', value: 25 },
    { name: 'Alto Risco', value: 10 },
  ];

  // Productivity/Health Data
  const healthTrendData = [
    { name: 'Seg', improved: 4, stable: 10, declining: 1 },
    { name: 'Ter', improved: 6, stable: 8, declining: 2 },
    { name: 'Qua', improved: 8, stable: 12, declining: 0 },
    { name: 'Qui', improved: 5, stable: 9, declining: 3 },
    { name: 'Sex', improved: 7, stable: 11, declining: 1 },
  ];

  return (
    <div className="space-y-6">
      
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Clientes Ativos</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2">{clients.filter(c => c.status === 'Active').length}</h3>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Clientes "No Limbo"</p>
              <h3 className="text-3xl font-bold text-orange-600 mt-2">{limboClients.length}</h3>
              <p className="text-xs text-orange-400 mt-1">Requer acompanhamento</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg text-orange-600">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Score Médio Saúde</p>
              <h3 className="text-3xl font-bold text-emerald-600 mt-2">8.4</h3>
              <p className="text-xs text-emerald-500 mt-1">+2.1% esta semana</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Agendamentos Pendentes</p>
              <h3 className="text-3xl font-bold text-blue-600 mt-2">{appointments.filter(a => a.status === 'Pending').length}</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <Clock size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Health Evolution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <h3 className="text-lg font-bold text-slate-800 mb-6">Tendência de Saúde (Semanal)</h3>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={healthTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} />
                  <Bar dataKey="improved" stackId="a" fill="#10b981" radius={[0,0,4,4]} name="Melhorou" />
                  <Bar dataKey="stable" stackId="a" fill="#6366f1" name="Estável" />
                  <Bar dataKey="declining" stackId="a" fill="#ef4444" radius={[4,4,0,0]} name="Piorou" />
                </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <h3 className="text-lg font-bold text-slate-800 mb-6">Análise de Risco (Pacientes Atuais)</h3>
           <div className="h-64 flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
             </ResponsiveContainer>
             <div className="absolute flex flex-col items-center justify-center pointer-events-none">
               <span className="text-2xl font-bold text-slate-700">345</span>
               <span className="text-xs text-slate-400">Total Pets</span>
             </div>
           </div>
           <div className="flex justify-center gap-4 mt-2">
              {riskData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index]}}></div>
                   <span className="text-sm text-slate-600">{entry.name}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Limbo List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Clientes no Limbo</h3>
            <p className="text-sm text-slate-500">Clientes ativos sem agendamentos futuros.</p>
          </div>
          <button className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">
            Contatar Todos
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-medium text-xs">
              <tr>
                <th className="px-6 py-4">Nome Cliente</th>
                <th className="px-6 py-4">Pets</th>
                <th className="px-6 py-4">Última Visita</th>
                <th className="px-6 py-4">Contato</th>
                <th className="px-6 py-4">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {limboClients.length > 0 ? limboClients.map(client => (
                <tr key={client.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{client.name}</td>
                  <td className="px-6 py-4">{client.pets.map(p => p.name).join(', ')}</td>
                  <td className="px-6 py-4">3 meses atrás</td>
                  <td className="px-6 py-4">{client.phone}</td>
                  <td className="px-6 py-4">
                    <button className="text-indigo-600 font-medium hover:underline">Agendar Agora</button>
                  </td>
                </tr>
              )) : (
                <tr>
                   <td colSpan={5} className="px-6 py-12 text-center text-slate-400">Ótimo trabalho! Nenhum cliente no limbo.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
