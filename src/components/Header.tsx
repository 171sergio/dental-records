import React from 'react';
import { Menu, Bell, UserCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();

  return (
    <header className={`backdrop-blur-lg shadow-md p-4 flex items-center justify-between z-10 border-b ${
      theme === 'dark' 
        ? 'bg-gray-800/50 border-gray-700' 
        : 'bg-white/50 border-gray-200'
    }`}>
      <div className="flex items-center">
        <button 
          onClick={onToggleSidebar} 
          className={`mr-4 ${
            theme === 'dark' 
              ? 'text-gray-300 hover:text-white' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Menu size={24} />
        </button>
        <h1 className={`text-xl font-semibold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Dashboard
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <button className={`${
          theme === 'dark' 
            ? 'text-gray-300 hover:text-white' 
            : 'text-gray-600 hover:text-gray-900'
        }`}>
          <Bell size={22} />
        </button>
        <div className="relative">
          <button className={`flex items-center space-x-2 ${
            theme === 'dark' 
              ? 'text-gray-300 hover:text-white' 
              : 'text-gray-600 hover:text-gray-900'
          }`}>
            <UserCircle size={28} />
            <span className="hidden md:block">{user?.nome || 'Usuário'}</span>
          </button>
          {/* Dropdown do usuário pode ser adicionado aqui */}
        </div>
        <button onClick={signOut} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
          Sair
        </button>
      </div>
    </header>
  );
};

export default Header;