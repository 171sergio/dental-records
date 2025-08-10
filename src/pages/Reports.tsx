import React, { useState, useEffect } from 'react'
import { ArrowLeft, BarChart3, PieChart, TrendingUp, Users, Calendar, FileText, Download, LogOut, UserCheck, Stethoscope, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { supabaseOperations } from '../services/supabaseOperations'
import { Patient, Appointment, Procedure } from '../types'
import { useAuth } from '../hooks/useAuth'

interface ReportData {
  totalPatients: number
  activePatients: number
  totalAppointments: number
  completedAppointments: number
  canceledAppointments: number
  totalProcedures: number
  monthlyAppointments: { month: string; count: number }[]
  proceduresByType: { type: string; count: number }[]
  patientsByStatus: { status: string; count: number }[]
}

const Reports: React.FC = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month')
  const [selectedReport, setSelectedReport] = useState<'overview' | 'patients' | 'appointments' | 'procedures'>('overview')
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const handleSwitchAccount = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Erro ao trocar conta:', error)
    }
  }

  useEffect(() => {
    loadReportData()
  }, [selectedPeriod])

  const loadReportData = async () => {
    setLoading(true)
    try {
      const [patientsResult, appointmentsResult] = await Promise.all([
        supabaseOperations.getPatients(),
        supabaseOperations.getAppointments()
      ])
      
      // Buscar todos os procedimentos de todos os pacientes
      const patients = patientsResult.data || []
      const allProcedures: Procedure[] = []
      for (const patient of patients) {
        const { data } = await supabaseOperations.getProceduresByPatient(patient.id)
        if (data) {
          allProcedures.push(...data)
        }
      }

      const appointments = appointmentsResult.data || []
      const procedures = allProcedures

      // Calcular estatísticas
      const totalPatients = patients.length
      const activePatients = patients.filter(p => p.status === 'ativo' || p.status === 'em_tratamento').length
      const totalAppointments = appointments.length
      const completedAppointments = appointments.filter(a => a.status === 'concluida').length
      const canceledAppointments = appointments.filter(a => a.status === 'cancelada').length
      const totalProcedures = procedures.length

      // Agrupamentos por mês (últimos 6 meses)
      const monthlyAppointments = generateMonthlyData(appointments)
      
      // Procedimentos por tipo
      const proceduresByType = generateProceduresByType(procedures)
      
      // Pacientes por status
      const patientsByStatus = [
        { status: 'Ativo', count: patients.filter(p => p.status === 'ativo').length },
        { status: 'Em Tratamento', count: patients.filter(p => p.status === 'em_tratamento').length },
        { status: 'Pendente', count: patients.filter(p => p.status === 'pendente').length },
        { status: 'Alta', count: patients.filter(p => p.status === 'alta').length },
        { status: 'Inativo', count: patients.filter(p => p.status === 'inativo').length }
      ]

      setReportData({
        totalPatients,
        activePatients,
        totalAppointments,
        completedAppointments,
        canceledAppointments,
        totalProcedures,
        monthlyAppointments,
        proceduresByType,
        patientsByStatus
      })
    } catch (error) {
      console.error('Erro ao carregar dados do relatório:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateMonthlyData = (appointments: Appointment[]) => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']
    return months.map(month => ({
      month,
      count: Math.floor(Math.random() * 20) + 5 // Dados simulados
    }))
  }

  const generateProceduresByType = (procedures: Procedure[]) => {
    const types = ['Limpeza', 'Restauração', 'Extração', 'Canal', 'Ortodontia']
    return types.map(type => ({
      type,
      count: Math.floor(Math.random() * 15) + 1 // Dados simulados
    }))
  }

  const exportReport = () => {
    if (!reportData) return
    
    const csvContent = `
Relatório de Estatísticas - ${new Date().toLocaleDateString()}

Resumo Geral:
Total de Pacientes,${reportData.totalPatients}
Pacientes Ativos,${reportData.activePatients}
Total de Agendamentos,${reportData.totalAppointments}
Agendamentos Concluídos,${reportData.completedAppointments}
Agendamentos Cancelados,${reportData.canceledAppointments}
Total de Procedimentos,${reportData.totalProcedures}

Pacientes por Status:
${reportData.patientsByStatus.map(item => `${item.status},${item.count}`).join('\n')}

Procedimentos por Tipo:
${reportData.proceduresByType.map(item => `${item.type},${item.count}`).join('\n')}
    `
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 page-enter">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-3" style={{ width: '40px', height: '40px' }}></div>
          <p className="text-muted">Carregando relatórios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="relative">
        {/* Header Moderno */}
        <div className="p-4 mb-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center">
                  <Link to="/dashboard" className="bg-primary-500 hover:bg-primary-600 text-white rounded-full p-3 mr-4 transition-all duration-300 hover:scale-110">
                    <ArrowLeft size={20} />
                  </Link>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                      <BarChart3 size={32} className="mr-3 text-primary-600" />
                      Relatórios e Estatísticas
                    </h1>
                    <p className="text-gray-600 mt-1">Análise detalhada e insights dos dados da clínica</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={exportReport}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 flex items-center shadow-lg"
                  >
                    <Download size={18} className="mr-2" />
                    Exportar CSV
                  </button>
                  
                  {/* User Menu Moderno */}
                  <div className="relative">
                    <button 
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center"
                      onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                      <Stethoscope size={18} className="mr-2" />
                      <span className="hidden md:inline">{user?.email}</span>
                      <User size={18} className="ml-2" />
                    </button>
                    
                    {showUserMenu && (
                      <>
                        <div 
                          className="fixed inset-0 z-40"
                          onClick={() => setShowUserMenu(false)}
                        ></div>
                        <div className="absolute right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 min-w-[200px] z-50">
                          <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center">
                              <div className="bg-primary-100 rounded-full p-2 mr-3">
                                <Stethoscope size={20} className="text-primary-600" />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-800">{user?.email}</div>
                                <div className="text-sm text-gray-500">Dentista</div>
                              </div>
                            </div>
                          </div>
                          <div className="p-2">
                            <button 
                              className="w-full text-left flex items-center py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors"
                              onClick={handleSwitchAccount}
                            >
                              <UserCheck size={16} className="mr-2" />
                              Trocar Conta
                            </button>
                            <button 
                              className="w-full text-left flex items-center py-2 px-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                              onClick={handleLogout}
                            >
                              <LogOut size={16} className="mr-2" />
                              Sair
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros Modernos */}
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Calendar size={16} className="mr-2" />
                  Período de Análise
                </label>
                <select 
                  className="w-full bg-gray-50 border-0 rounded-xl py-3 px-4 text-gray-700 font-medium focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as any)}
                >
                  <option value="month">📅 Último Mês</option>
                  <option value="quarter">📊 Último Trimestre</option>
                  <option value="year">📈 Último Ano</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <BarChart3 size={16} className="mr-2" />
                  Tipo de Relatório
                </label>
                <select 
                  className="w-full bg-gray-50 border-0 rounded-xl py-3 px-4 text-gray-700 font-medium focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                  value={selectedReport}
                  onChange={(e) => setSelectedReport(e.target.value as any)}
                >
                  <option value="overview">🔍 Visão Geral</option>
                  <option value="patients">👥 Pacientes</option>
                  <option value="appointments">📅 Agendamentos</option>
                  <option value="procedures">🦷 Procedimentos</option>
                </select>
              </div>
            </div>
          </div>
        </div>

      {reportData && (
        <>
        {/* Cards de Estatísticas Modernos */}
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:-translate-y-2 transition-all duration-300">
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h3 className="text-3xl font-bold mb-1">{reportData.totalPatients}</h3>
                  <p className="text-blue-100 font-medium">Total de Pacientes</p>
                </div>
                <div className="bg-white/20 rounded-full p-3">
                  <Users size={28} />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 opacity-20">
                <Users size={80} />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:-translate-y-2 transition-all duration-300">
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h3 className="text-3xl font-bold mb-1">{reportData.activePatients}</h3>
                  <p className="text-green-100 font-medium">Pacientes Ativos</p>
                </div>
                <div className="bg-white/20 rounded-full p-3">
                  <TrendingUp size={28} />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 opacity-20">
                <TrendingUp size={80} />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:-translate-y-2 transition-all duration-300">
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h3 className="text-3xl font-bold mb-1">{reportData.totalAppointments}</h3>
                  <p className="text-purple-100 font-medium">Total Agendamentos</p>
                </div>
                <div className="bg-white/20 rounded-full p-3">
                  <Calendar size={28} />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 opacity-20">
                <Calendar size={80} />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:-translate-y-2 transition-all duration-300">
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h3 className="text-3xl font-bold mb-1">{reportData.totalProcedures}</h3>
                  <p className="text-orange-100 font-medium">Total Procedimentos</p>
                </div>
                <div className="bg-white/20 rounded-full p-3">
                  <FileText size={28} />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 opacity-20">
                <FileText size={80} />
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos e Tabelas Modernos */}
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Gráfico de Agendamentos por Mês */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full p-3 mr-4">
                  <BarChart3 size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Agendamentos por Mês</h3>
              </div>
              <div className="space-y-4">
                {reportData.monthlyAppointments.map((item, index) => (
                  <div key={item.month} className="flex items-center">
                    <div className="w-16 text-sm text-gray-600 font-medium">
                      {item.month}
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${Math.max((item.count / 25) * 100, 8)}%`
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-10 text-sm font-bold text-gray-800 text-right">
                      {item.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gráfico de Procedimentos por Tipo */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-full p-3 mr-4">
                  <PieChart size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Procedimentos por Tipo</h3>
              </div>
              <div className="space-y-4">
                {reportData.proceduresByType.map((item, index) => {
                  const colors = [
                    'from-green-500 to-green-600',
                    'from-purple-500 to-purple-600',
                    'from-orange-500 to-orange-600',
                    'from-red-500 to-red-600',
                    'from-blue-500 to-blue-600'
                  ];
                  return (
                    <div key={item.type} className="flex items-center">
                      <div className="w-24 text-sm text-gray-600 font-medium">
                        {item.type}
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`bg-gradient-to-r ${colors[index % colors.length]} h-full rounded-full transition-all duration-500`}
                            style={{ 
                              width: `${(item.count / Math.max(...reportData.proceduresByType.map(d => d.count))) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                      <div className="w-10 text-sm font-bold text-gray-800 text-right">
                        {item.count}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tabela de Distribuição de Pacientes */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-full p-3 mr-4">
                <Users size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Distribuição de Pacientes por Status</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <th className="text-left py-4 px-6 font-bold text-gray-800 rounded-l-xl">Status</th>
                    <th className="text-left py-4 px-6 font-bold text-gray-800">Quantidade</th>
                    <th className="text-left py-4 px-6 font-bold text-gray-800">Percentual</th>
                    <th className="text-left py-4 px-6 font-bold text-gray-800 rounded-r-xl">Progresso</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reportData.patientsByStatus.map((item, index) => {
                    const percentage = ((item.count / reportData.totalPatients) * 100).toFixed(1)
                    const statusColors = {
                      'Em Tratamento': 'from-green-500 to-green-600',
                      'Pendente': 'from-orange-500 to-orange-600',
                      'Alta': 'from-blue-500 to-blue-600'
                    }
                    const colorClass = statusColors[item.status as keyof typeof statusColors] || 'from-gray-500 to-gray-600'
                    
                    return (
                      <tr key={item.status} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <span className={`bg-gradient-to-r ${colorClass} text-white px-4 py-2 rounded-full text-sm font-medium`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-bold text-gray-800">{item.count}</td>
                        <td className="py-4 px-6 text-gray-600">
                          {percentage}%
                        </td>
                        <td className="py-4 px-6">
                          <div className="bg-gray-200 rounded-full h-2 w-24 overflow-hidden">
                            <div 
                              className={`bg-gradient-to-r ${colorClass} h-full rounded-full transition-all duration-500`}
                              style={{ 
                                width: `${percentage}%`
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        </>
      )}
      </div>
    </div>
  )
}

export default Reports