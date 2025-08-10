import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, FileText, BarChart3, Database, UserCog, Stethoscope, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface SidebarProps {
  isOpen: boolean;
}

const navLinks = [
  { to: '/dashboard', icon: LayoutDashboard, text: 'Dashboard' },
  { to: '/paciente/novo', icon: Users, text: 'Novo Paciente' },
  { to: '/agendamentos', icon: Calendar, text: 'Agendamentos' },
  { to: '/relatorios', icon: BarChart3, text: 'Relatórios' },
  { to: '/backup', icon: Database, text: 'Backup' },
  { to: '/usuarios', icon: UserCog, text: 'Usuários' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className={`fixed left-0 top-0 h-full transition-all duration-300 z-40 shadow-xl ${isOpen ? 'w-64' : 'w-20'} ${
      theme === 'dark' 
        ? 'bg-gray-900/95 backdrop-blur-lg text-gray-100 border-r border-gray-700/50' 
        : 'bg-white/95 backdrop-blur-lg text-gray-800 border-r border-gray-200/50'
    }`}>
      <div className={`flex items-center justify-center h-20 border-b bg-gradient-to-r from-blue-600 to-blue-700 ${
        theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'
      }`}>
        <Stethoscope size={32} className="text-white" />
        {isOpen && <h1 className="text-2xl font-bold ml-2 text-white">OdontoSys</h1>}
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center p-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105' 
                  : theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-blue-400 hover:transform hover:scale-105'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:transform hover:scale-105'
              }`
            }
          >
            <link.icon size={22} />
            {isOpen && <span className="ml-4 font-medium">{link.text}</span>}
          </NavLink>
        ))}
      </nav>
      
      {/* Botão de alternância de tema */}
      <div className="px-4 pb-6">
        <button
          onClick={toggleTheme}
          className={`flex items-center p-3 rounded-xl transition-all duration-200 w-full ${
            theme === 'dark'
              ? 'text-gray-300 hover:bg-gray-800 hover:text-yellow-400'
              : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
          } hover:transform hover:scale-105`}
        >
          {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
          {isOpen && (
            <span className="ml-4 font-medium">
              {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;