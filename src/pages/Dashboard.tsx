import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, BarChart3, Plus, Search, Eye, Stethoscope, ArrowRight } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { supabaseOperations } from '../services/supabaseOperations';
import { Patient, Appointment } from '../types';
import { getLocalTodayYMD } from '../lib/utils';
import { supabase } from '../services/supabase';

const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();

    // Realtime: escutar mudanças em appointments e patients
    const channel = supabase
      .channel('dashboard-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
        loadData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, () => {
        loadData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    filterPatients();
  }, [searchTerm, patients]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [patientsResult, appointmentsResult] = await Promise.all([
        supabaseOperations.getPatients(),
        supabaseOperations.getAppointments()
      ]);
      
      if (patientsResult.error) {
        setError(patientsResult.error.message);
      } else {
        setPatients(patientsResult.data || []);
      }
      
      if (appointmentsResult.error) {
        setError(appointmentsResult.error.message);
      } else {
        setAppointments(appointmentsResult.data || []);
      }
    } catch (err: any) {
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const filterPatients = () => {
    return patients.filter(patient =>
      patient.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.cpf && patient.cpf.includes(searchTerm))
    );
  };

  const filteredPatients = filterPatients();

  // Calcular agendamentos de hoje
  const getTodayAppointments = () => {
    const today = getLocalTodayYMD(); // YYYY-MM-DD local
    return appointments.filter(apt => apt.data_consulta === today && apt.status === 'agendada').length;
  };


  // Calcular altas do mês atual
  const getMonthlyDischarges = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return patients.filter(patient => {
      if (!patient.status || patient.status !== 'alta') return false;
      
      const updatedDate = new Date(patient.updated_at);
      return updatedDate.getMonth() === currentMonth && 
             updatedDate.getFullYear() === currentYear;
    }).length;
  };

  const handleLogout = async () => {
    // Implementar logout
  };

  const handleSwitchAccount = () => {
    // Implementar troca de conta
  };

  const getStatusBadge = (status: string | null) => {
    const statusMap = {
      ativo: { label: 'Ativo', color: 'bg-green-100 text-green-800' },
      em_tratamento: { label: 'Em Tratamento', color: 'bg-blue-100 text-blue-800' },
      alta: { label: 'Alta', color: 'bg-purple-100 text-purple-800' },
      inativo: { label: 'Inativo', color: 'bg-gray-100 text-gray-800' },
      pendente: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pendente;
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="page-enter">
      {/* Header do Conteúdo Principal */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className={`text-3xl font-bold ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
          }`}>
            Dashboard
          </h2>
          <p className={`${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Visão geral do seu consultório.
          </p>
        </div>
        <Link 
          to="/paciente/novo"
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-blue-500/50 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center space-x-2"
        >
          <Plus size={20}/>
          <span>Novo Paciente</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card Total de Pacientes */}
        <div className={`backdrop-blur-lg rounded-2xl p-6 border shadow-xl flex items-center space-x-4 animate-fade-in hover:scale-105 transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-gray-800/95 border-gray-700/50' 
            : 'bg-white/95 border-gray-200/50'
        }`}>
          <div className="p-4 rounded-full bg-blue-500">
            <Users size={28} className="text-white" />
          </div>
          <div>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Total de Pacientes
            </p>
            <p className={`text-3xl font-bold ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
            }`}>
              {patients.length}
            </p>
          </div>
        </div>

        {/* Card Pacientes Ativos */}
        <div className={`backdrop-blur-lg rounded-2xl p-6 border shadow-xl flex items-center space-x-4 animate-fade-in hover:scale-105 transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-gray-800/95 border-gray-700/50' 
            : 'bg-white/95 border-gray-200/50'
        }`} style={{animationDelay: '0.1s'}}>
          <div className="p-4 rounded-full bg-green-500">
            <Stethoscope size={28} className="text-white" />
          </div>
          <div>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Pacientes Ativos
            </p>
            <p className={`text-3xl font-bold ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
            }`}>
              {patients.filter(p => p.status === 'ativo').length}
            </p>
          </div>
        </div>

        {/* Card Agendamentos Hoje */}
        <div className={`backdrop-blur-lg rounded-2xl p-6 border shadow-xl flex items-center space-x-4 animate-fade-in hover:scale-105 transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-gray-800/95 border-gray-700/50' 
            : 'bg-white/95 border-gray-200/50'
        }`} style={{animationDelay: '0.2s'}}>
          <div className="p-4 rounded-full bg-orange-500">
            <Calendar size={28} className="text-white" />
          </div>
          <div>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Agendamentos Hoje
            </p>
            <p className={`text-3xl font-bold ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
            }`}>
              {loading ? '...' : getTodayAppointments()}
            </p>
          </div>
        </div>

        {/* Card Alta no Mês */}
        <div className={`backdrop-blur-lg rounded-2xl p-6 border shadow-xl flex items-center space-x-4 animate-fade-in hover:scale-105 transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-gray-800/95 border-gray-700/50' 
            : 'bg-white/95 border-gray-200/50'
        }`} style={{animationDelay: '0.3s'}}>
          <div className="p-4 rounded-full bg-purple-500">
            <BarChart3 size={28} className="text-white" />
          </div>
          <div>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Altas este Mês
            </p>
            <p className={`text-3xl font-bold ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
            }`}>
              {loading ? '...' : getMonthlyDischarges()}
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Pacientes */}
      <div className={`backdrop-blur-lg rounded-2xl p-6 border shadow-xl animate-fade-in ${
        theme === 'dark' 
          ? 'bg-gray-800/95 border-gray-700/50' 
          : 'bg-white/95 border-gray-200/50'
      }`} style={{animationDelay: '0.6s'}}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-semibold ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
          }`}>
            Pacientes Recentes
          </h3>
          <Link 
            to="/patients" 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all duration-200"
          >
            Ver todos <ArrowRight size={16} />
          </Link>
        </div>

        <div className="relative w-full max-w-sm mb-6">
          <input
            type="text"
            placeholder="Buscar por nome, CPF ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border-2 border-transparent rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
              theme === 'dark' 
                ? 'bg-gray-700 text-gray-100' 
                : 'bg-gray-50 text-gray-800'
            }`}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-400"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            <p>{error}</p>
            <button onClick={loadData} className={`mt-4 px-4 py-2 rounded-lg transition ${
              theme === 'dark' 
                ? 'bg-red-900 text-red-300 hover:bg-red-800' 
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}>Tentar Novamente</button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPatients.length === 0 ? (
              <div className="text-center py-8">
                <p className={`${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Nenhum paciente encontrado.
                </p>
              </div>
            ) : (
              filteredPatients.slice(0, 5).map((patient) => (
                <div key={patient.id} className={`flex items-center justify-between p-4 rounded-xl border hover:shadow-md transition-all duration-200 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {patient.nome_completo.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className={`font-semibold ${
                        theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                      }`}>
                        {patient.nome_completo}
                      </h4>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {patient.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {getStatusBadge(patient.status)}
                    <Link 
                      to={`/paciente/${patient.id}`}
                      className={`text-blue-600 hover:text-blue-700 transition-colors duration-200 p-2 rounded-lg flex items-center space-x-2 ${
                        theme === 'dark' ? 'hover:bg-blue-900/30' : 'hover:bg-blue-50'
                      }`}
                    >
                      <Eye size={18} />
                      <span className="text-sm font-medium">Ver Prontuário</span>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;