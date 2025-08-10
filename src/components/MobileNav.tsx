import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Home,
  Users,
  Calendar,
  FileText,
  BarChart3,
  Database,
  Settings,
  User,
  Shield,
  LogOut,
  UserCheck,
  Menu,
  X
} from 'lucide-react';

interface MobileNavProps {
  isAuthenticated: boolean;
  userEmail?: string;
}

const MobileNav: React.FC<MobileNavProps> = ({ isAuthenticated, userEmail }) => {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (!isAuthenticated) {
    return null;
  }

  const isAdmin = userEmail === 'admin@clinica.com';

  const handleLogout = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleSwitchAccount = () => {
    // Primeiro faz logout, depois redireciona para login
    signOut().then(() => {
      window.location.href = '/login';
    });
  };

  const navItems = [
    {
      path: '/dashboard',
      icon: Home,
      label: 'Início'
    },
    {
      path: '/agendamentos',
      icon: Calendar,
      label: 'Agenda'
    },
    {
      path: '/relatorios',
      icon: BarChart3,
      label: 'Relatórios'
    },
    {
      path: '/backup',
      icon: Database,
      label: 'Backup'
    },
    ...(isAdmin ? [{
      path: '/usuarios',
      icon: Shield,
      label: 'Usuários'
    }] : [])
  ];

  return (
    <>
      <nav className="mobile-nav card-glass">
        <div className="mobile-nav-grid">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-nav-item hover-scale ${isActive ? 'active' : ''}`}
              >
                <div className={`nav-icon-wrapper ${isActive ? 'bg-gradient-primary' : ''}`}>
                  <Icon size={18} className={isActive ? 'text-white' : 'text-muted'} />
                </div>
                <span className={`nav-label ${isActive ? 'text-gradient-primary' : 'text-muted'}`}>{item.label}</span>
              </Link>
            );
          })}
          
          {/* Botão do usuário */}
          <button
            className={`mobile-nav-item user-menu-btn hover-scale ${showUserMenu ? 'active' : ''}`}
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className={`nav-icon-wrapper ${showUserMenu ? 'bg-gradient-primary' : ''}`}>
              <User size={18} className={showUserMenu ? 'text-white' : 'text-muted'} />
            </div>
            <span className={`nav-label ${showUserMenu ? 'text-gradient-primary' : 'text-muted'}`}>Conta</span>
          </button>
        </div>
      </nav>

      {/* Menu do usuário */}
      {showUserMenu && (
        <div className="user-menu-overlay animate-fade-in" onClick={() => setShowUserMenu(false)}>
          <div className="user-menu-modal card-glass animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="user-menu-header">
              <div className="user-avatar bg-gradient-primary">
                <User size={24} className="text-white" />
              </div>
              <div className="user-info">
                <h4 className="text-gradient-primary">{user?.email || 'Usuário'}</h4>
                <p className="text-muted small">{user?.email}</p>
              </div>
              <button 
                className="close-menu-btn btn-modern hover-scale"
                onClick={() => setShowUserMenu(false)}
              >
                <X size={18} className="text-muted" />
              </button>
            </div>
            
            <div className="user-menu-actions">
              <button 
                className="user-menu-action btn-gradient-primary hover-scale"
                onClick={handleSwitchAccount}
              >
                <UserCheck size={18} />
                <span>Trocar Conta</span>
              </button>
              
              <button 
                className="user-menu-action btn-gradient-warning hover-scale"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;