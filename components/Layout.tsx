import React from 'react';
import { LayoutDashboard, Users, Calendar, ClipboardList, Settings, Activity } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const SidebarItem = ({ icon: Icon, label, to, active }: { icon: any, label: string, to: string, active: boolean }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      active 
        ? 'bg-indigo-600 text-white shadow-md' 
        : 'text-gray-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const getTitle = (path: string) => {
    if (path === '/') return 'Painel de Gestão';
    if (path === '/queue') return 'Fila Operacional';
    if (path.startsWith('/clients')) return 'Gestão de Clientes';
    if (path === '/audit') return 'Logs de Auditoria';
    return 'Sistema';
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 flex flex-col shadow-xl z-20">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-indigo-400">
            <Activity size={28} />
            <span className="text-xl font-bold tracking-tight text-white">VetFlow Pro</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Painel" 
            to="/" 
            active={location.pathname === '/'} 
          />
          <SidebarItem 
            icon={Calendar} 
            label="Fila & Agenda" 
            to="/queue" 
            active={location.pathname === '/queue'} 
          />
          <SidebarItem 
            icon={Users} 
            label="Clientes & Pets" 
            to="/clients" 
            active={location.pathname.startsWith('/clients')} 
          />
          <SidebarItem 
            icon={ClipboardList} 
            label="Auditoria" 
            to="/audit" 
            active={location.pathname === '/audit'} 
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <SidebarItem 
            icon={Settings} 
            label="Configurações" 
            to="/settings" 
            active={location.pathname === '/settings'} 
          />
          <div className="mt-4 px-4 py-2 bg-slate-800 rounded text-xs text-gray-400">
            <p>Operador: <span className="text-white">Dr. Wilson</span></p>
            <p>Turno: <span className="text-green-400">Ativo</span></p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col relative">
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-10 flex items-center justify-between px-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800">
            {getTitle(location.pathname)}
          </h2>
          <div className="flex items-center gap-4">
             <button className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200">
                <span className="sr-only">Notificações</span>
                <Activity size={18} />
             </button>
             <div className="h-8 w-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
               DW
             </div>
          </div>
        </header>
        <div className="p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};
