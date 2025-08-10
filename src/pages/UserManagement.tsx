import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  ArrowLeft,
  Search,
  Eye,
  EyeOff,
  Mail,
  User,
  Calendar,
  LogOut,
  UserCheck,
  Stethoscope
} from 'lucide-react';

interface AppUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'dentist' | 'assistant';
  status: 'active' | 'inactive';
  created_at: string;
  last_login?: string;
}

const UserManagement: React.FC = () => {
  const { user, signOut } = useAuth();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AppUser | undefined>();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'assistant' as AppUser['role'],
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock data para demonstração
  const mockUsers: AppUser[] = [
    {
      id: '1',
      email: 'admin@clinica.com',
      name: 'Administrador',
      role: 'admin',
      status: 'active',
      created_at: '2024-01-15T10:00:00Z',
      last_login: '2024-01-20T14:30:00Z'
    },
    {
      id: '2',
      email: 'dr.silva@clinica.com',
      name: 'Dr. João Silva',
      role: 'dentist',
      status: 'active',
      created_at: '2024-01-16T09:00:00Z',
      last_login: '2024-01-20T08:15:00Z'
    },
    {
      id: '3',
      email: 'maria.assistente@clinica.com',
      name: 'Maria Santos',
      role: 'assistant',
      status: 'active',
      created_at: '2024-01-17T11:00:00Z',
      last_login: '2024-01-19T16:45:00Z'
    }
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUsers(mockUsers);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewUser = () => {
    setSelectedUser(undefined);
    setFormData({
      email: '',
      name: '',
      role: 'assistant',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setShowModal(true);
  };

  const handleEditUser = (user: AppUser) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      name: user.name,
      role: user.role,
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setShowModal(true);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.name) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!selectedUser) {
      if (!formData.password) {
        newErrors.password = 'Senha é obrigatória';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Senhas não coincidem';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveUser = async () => {
    if (!validateForm()) return;

    try {
      if (selectedUser) {
        // Atualizar usuário existente
        const updatedUsers = users.map(u =>
          u.id === selectedUser.id
            ? { ...u, email: formData.email, name: formData.name, role: formData.role }
            : u
        );
        setUsers(updatedUsers);
      } else {
        // Criar novo usuário
        const newUser: AppUser = {
          id: Date.now().toString(),
          email: formData.email,
          name: formData.name,
          role: formData.role,
          status: 'active',
          created_at: new Date().toISOString()
        };
        setUsers([...users, newUser]);
      }

      setShowModal(false);
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) {
      return;
    }

    try {
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
    }
  };

  const toggleUserStatus = async (userId: string) => {
    try {
      const updatedUsers = users.map(u =>
        u.id === userId
          ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' as AppUser['status'] }
          : u
      );
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Erro ao alterar status do usuário:', error);
    }
  };

  const getRoleBadge = (role: AppUser['role']) => {
    const roleConfig = {
      admin: { class: 'bg-danger', icon: ShieldCheck, text: 'Administrador' },
      dentist: { class: 'bg-primary', icon: Shield, text: 'Dentista' },
      assistant: { class: 'bg-secondary', icon: User, text: 'Assistente' }
    };

    const config = roleConfig[role];
    const Icon = config.icon;

    return (
      <span className={`badge ${config.class} d-flex align-items-center`}>
        <Icon size={12} className="me-1" />
        {config.text}
      </span>
    );
  };

  const getStatusBadge = (status: AppUser['status']) => {
    return (
      <span className={`badge ${status === 'active' ? 'bg-success' : 'bg-warning'}`}>
        {status === 'active' ? 'Ativo' : 'Inativo'}
      </span>
    );
  };

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const handleSwitchAccount = async () => {
    try {
      await signOut()
      window.location.href = '/login'
    } catch (error) {
      console.error('Erro ao trocar conta:', error)
    }
  }

  // Verificar se o usuário atual é admin
  const isAdmin = user?.email === 'admin@clinica.com'; // Simplificado para demo

  if (!isAdmin) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center page-enter">
        <div className="text-center">
          <Shield size={64} className="text-muted mb-3" />
          <h3 className="text-muted">Acesso Negado</h3>
          <p className="text-muted mb-4">Você não tem permissão para acessar esta página.</p>
          <Link to="/dashboard" className="btn-modern btn-primary-modern">
            <ArrowLeft size={16} className="me-2" />
            Voltar ao Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 page-enter">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-3" style={{ width: '40px', height: '40px' }}></div>
          <p className="text-muted">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 page-enter">
      {/* Header */}
      <div className="card-modern mb-4 animate-fade-in">
        <div className="container-responsive p-3 p-md-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center">
              <div className="d-inline-block p-2 rounded-circle bg-gradient-primary me-3">
                <Stethoscope size={20} className="text-white" />
              </div>
              <span className="h5 mb-0 text-gradient fw-bold">Clínica Odontológica</span>
            </div>
            
            <div className="d-flex align-items-center">
              <div className="dropdown">
                <button 
                  className="btn-modern btn-primary-modern dropdown-toggle d-flex align-items-center" 
                  type="button" 
                  data-bs-toggle="dropdown"
                >
                  <User size={16} className="me-2" />
                  {user?.email || 'Usuário'}
                </button>
                <ul className="dropdown-menu shadow-lg border-0">
                  <li>
                    <div className="dropdown-header text-muted small">
                      Conectado como:
                    </div>
                  </li>
                  <li>
                    <div className="dropdown-item-text small text-primary fw-medium px-3 py-1">
                      {user?.email}
                    </div>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item hover-lift" onClick={handleSwitchAccount}>
                      <UserCheck size={16} className="me-2" />
                      Trocar Conta
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item hover-lift text-danger" onClick={handleLogout}>
                      <LogOut size={16} className="me-2" />
                      Sair
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <div className="d-flex align-items-center">
              <Link to="/dashboard" className="btn-modern btn-primary-modern me-3 hover-lift">
                <ArrowLeft size={16} />
              </Link>
              <div>
                <h1 className="h3 mb-1 text-gradient">Gestão de Usuários</h1>
                <p className="text-muted mb-0 d-none d-sm-block">Gerencie os usuários do sistema</p>
              </div>
            </div>
            <button
              className="btn-modern btn-success-modern hover-lift"
              onClick={handleNewUser}
            >
              <Plus size={18} className="me-1" />
              <span className="d-none d-sm-inline">Novo Usuário</span>
              <span className="d-sm-none">Novo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-responsive">
        <div className="card-modern animate-slide-in-right">
          <div className="card-header bg-white border-bottom">
            <div className="row align-items-center g-3">
              <div className="col-12 col-md-6">
                <h5 className="card-title mb-0 text-gradient">Lista de Usuários</h5>
              </div>
              <div className="col-12 col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <Search size={18} className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Buscar usuário..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card-body p-0">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-5">
                <Users size={48} className="text-muted mb-3" />
                <h5 className="text-muted">Nenhum usuário encontrado</h5>
                <p className="text-muted mb-3">
                  {searchTerm ? 'Tente ajustar os filtros de busca' : 'Comece adicionando um novo usuário'}
                </p>
                {!searchTerm && (
                  <button
                    className="btn-modern btn-primary-modern hover-lift"
                    onClick={handleNewUser}
                  >
                    <Plus size={18} className="me-2" />
                    Adicionar Primeiro Usuário
                  </button>
                )}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Nome</th>
                      <th className="d-none d-md-table-cell">Email</th>
                      <th>Função</th>
                      <th className="d-none d-sm-table-cell">Status</th>
                      <th className="d-none d-lg-table-cell">Último Login</th>
                      <th className="text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="fw-medium">
                          <div>{user.name}</div>
                          <small className="text-muted d-md-none">{user.email}</small>
                        </td>
                        <td className="d-none d-md-table-cell">{user.email}</td>
                        <td>{getRoleBadge(user.role)}</td>
                        <td className="d-none d-sm-table-cell">{getStatusBadge(user.status)}</td>
                        <td className="d-none d-lg-table-cell">
                          {user.last_login
                            ? new Date(user.last_login).toLocaleDateString('pt-BR')
                            : 'Nunca'
                          }
                        </td>
                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-1">
                            <button
                              className="btn-modern btn-primary-modern btn-sm hover-lift"
                              onClick={() => handleEditUser(user)}
                              title="Editar usuário"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              className={`btn-modern btn-sm hover-lift ${
                                user.status === 'active' ? 'btn-warning-modern' : 'btn-success-modern'
                              }`}
                              onClick={() => toggleUserStatus(user.id)}
                              title={user.status === 'active' ? 'Desativar' : 'Ativar'}
                            >
                              {user.status === 'active' ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                            <button
                              className="btn-modern btn-danger-modern btn-sm hover-lift"
                              onClick={() => handleDeleteUser(user.id)}
                              title="Excluir usuário"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-responsive">
            <div className="modal-content card-modern">
              <div className="modal-header border-bottom">
                <h5 className="modal-title text-gradient">
                  {selectedUser ? 'Editar Usuário' : 'Novo Usuário'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-grid-2">
                    <div className="form-group-modern">
                      <label className="form-label-modern">Nome Completo</label>
                      <input
                        type="text"
                        className={`form-control-modern ${errors.name ? 'is-invalid' : ''}`}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Digite o nome completo"
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    <div className="form-group-modern">
                      <label className="form-label-modern">Email</label>
                      <input
                        type="email"
                        className={`form-control-modern ${errors.email ? 'is-invalid' : ''}`}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Digite o email"
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                  </div>

                  <div className="form-group-modern">
                    <label className="form-label-modern">Função</label>
                    <select
                      className="form-control-modern"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as AppUser['role'] })}
                    >
                      <option value="assistant">Assistente</option>
                      <option value="dentist">Dentista</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>

                  {!selectedUser && (
                    <div className="form-grid-2">
                      <div className="form-group-modern">
                        <label className="form-label-modern">Senha</label>
                        <div className="input-wrapper">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className={`form-control-modern ${errors.password ? 'is-invalid' : ''}`}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Digite a senha"
                          />
                          <button
                            type="button"
                            className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ zIndex: 10 }}
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                      </div>

                      <div className="form-group-modern">
                        <label className="form-label-modern">Confirmar Senha</label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className={`form-control-modern ${errors.confirmPassword ? 'is-invalid' : ''}`}
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          placeholder="Confirme a senha"
                        />
                        {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                      </div>
                    </div>
                  )}
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-modern btn-outline-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn-modern btn-primary-modern"
                  onClick={handleSaveUser}
                >
                  {selectedUser ? 'Atualizar' : 'Criar'} Usuário
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;