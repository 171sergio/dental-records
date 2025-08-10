import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import AppointmentModal from '../components/AppointmentModal'
import { Appointment, Patient } from '../types'
import { supabaseOperations } from '../services/supabaseOperations'
import { getLocalTodayYMD } from '../lib/utils'
import {
  Calendar,
  Plus,
  Clock,
  User,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  LogOut,
  UserCheck,
  Stethoscope
} from 'lucide-react'

const Appointments: React.FC = () => {
  const { user, signOut } = useAuth()
  const { theme } = useTheme()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(getLocalTodayYMD())
  const [showModal, setShowModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | undefined>()
  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>()
  const [filter, setFilter] = useState<'all' | 'agendada' | 'concluida' | 'cancelada'>('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [appointmentsResult, patientsResult] = await Promise.all([
        supabaseOperations.getAppointments(),
        supabaseOperations.getPatients()
      ])
      
      setAppointments(appointmentsResult.data || [])
      setPatients(patientsResult.data || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId)
    return patient?.nome_completo || 'Paciente não encontrado'
  }

  const getPatient = (patientId: string) => {
    return patients.find(p => p.id === patientId)
  }

  const filteredAppointments = appointments.filter(appointment => {
    if (filter !== 'all' && appointment.status !== filter) {
      return false
    }
    return appointment.data_consulta === selectedDate
  })

  const upcomingAppointments = appointments
    .filter(apt => {
      const aptDate = new Date(`${apt.data_consulta}T${apt.hora_consulta}`)
      return aptDate >= new Date() && apt.status === 'agendada'
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.data_consulta}T${a.hora_consulta}`)
      const dateB = new Date(`${b.data_consulta}T${b.hora_consulta}`)
      return dateA.getTime() - dateB.getTime()
    })
    .slice(0, 5)

  const handleNewAppointment = () => {
    setSelectedAppointment(undefined)
    setSelectedPatient(undefined)
    setShowModal(true)
  }

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setSelectedPatient(getPatient(appointment.paciente_id))
    setShowModal(true)
  }

  const handleDeleteAppointment = async (appointment: Appointment) => {
    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) {
      return
    }

    try {
      // Atualizar status para cancelada
      await supabaseOperations.updateAppointment(appointment.id, {
        status: 'cancelada'
      })

      await loadData()
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error)
      alert('Erro ao cancelar agendamento')
    }
  }

  const handleCompleteAppointment = async (appointment: Appointment) => {
    try {
      await supabaseOperations.updateAppointment(appointment.id, {
        status: 'concluida'
      })
      await loadData()
    } catch (error) {
      console.error('Erro ao marcar como concluída:', error)
      alert('Erro ao marcar consulta como concluída')
    }
  }

  const handleSaveAppointment = async (appointment: Appointment) => {
    await loadData()
    setShowModal(false)
  }

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

  const getStatusBadge = (status: string | null) => {
    const statusConfig = {
      'agendada': { class: 'bg-blue-100 text-blue-800', icon: Clock, text: 'Agendada' },
      'concluida': { class: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Concluída' },
      'cancelada': { class: 'bg-red-100 text-red-800', icon: XCircle, text: 'Cancelada' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || 
                   { class: 'bg-gray-100 text-gray-800', icon: Clock, text: 'Agendada' }
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}>
        <Icon size={12} className="mr-1" />
        {config.text}
      </span>
    )
  }

  const getTimeSlots = () => {
    const slots = []
    for (let hour = 8; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`)
      if (hour < 18) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`)
      }
    }
    return slots
  }

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen page-enter ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Carregando agendamentos...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'
    }`}>
      {/* Header Moderno */}
      <div className={`backdrop-blur-sm border-b sticky top-0 z-50 shadow-sm ${
        theme === 'dark' 
          ? 'bg-gray-800/95 border-gray-700/50' 
          : 'bg-white/95 border-gray-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className={`flex items-center hover:text-blue-600 transition-colors font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                <ArrowLeft size={20} className="mr-2" />
                <span>Dashboard</span>
              </Link>
              <div className={`h-6 w-px ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
              <div className="flex items-center">
                <Stethoscope size={24} className="text-blue-600 mr-3" />
                <h1 className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                }`}>
                  Agendamentos
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleNewAppointment}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-xl shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center space-x-2"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Novo Agendamento</span>
              </button>
              
              <div className="relative group">
                <button className={`flex items-center space-x-3 hover:text-blue-600 transition-colors p-2 rounded-lg ${
                  theme === 'dark' 
                    ? 'text-gray-200 hover:bg-blue-900/30' 
                    : 'text-gray-800 hover:bg-blue-50'
                }`}>
                  <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                    <User size={18} className="text-white" />
                  </div>
                  <span className={`hidden md:block font-medium ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}>
                    {user?.email}
                  </span>
                </button>
                
                <div className={`absolute right-0 mt-2 w-52 rounded-xl shadow-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 backdrop-blur-sm ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700/50' 
                    : 'bg-white border-gray-200/50'
                }`}>
                  <div className="py-2">
                    <button
                      onClick={handleSwitchAccount}
                      className={`flex items-center w-full px-4 py-3 text-sm transition-colors ${
                        theme === 'dark' 
                          ? 'text-gray-300 hover:bg-blue-900/30 hover:text-blue-400' 
                          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                      }`}
                    >
                      <UserCheck size={16} className="mr-3 text-blue-600" />
                      Trocar Conta
                    </button>
                    <div className={`border-t my-1 ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
                    }`}></div>
                    <button
                      onClick={handleLogout}
                      className={`flex items-center w-full px-4 py-3 text-sm text-red-600 transition-colors ${
                        theme === 'dark' ? 'hover:bg-red-900/30' : 'hover:bg-red-50'
                      }`}
                    >
                      <LogOut size={16} className="mr-3" />
                      Sair
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar com próximos agendamentos */}
          <div className="lg:col-span-1">
            <div className={`backdrop-blur-sm rounded-2xl p-6 border shadow-xl h-full ${
              theme === 'dark' 
                ? 'bg-gray-800/95 border-gray-700/50' 
                : 'bg-white/95 border-gray-200/50'
            }`}>
              <h2 className={`text-xl font-bold mb-6 flex items-center ${
                theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
              }`}>
                <Clock size={20} className="mr-3 text-blue-600" />
                Próximos Agendamentos
              </h2>
              <div className="space-y-4">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map(apt => (
                    <div key={apt.id} className={`p-4 rounded-xl border hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer ${
                      theme === 'dark' 
                        ? 'bg-gradient-to-r from-blue-900/50 to-blue-800/50 border-blue-700/50' 
                        : 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200/50'
                    }`}>
                      <p className={`font-bold truncate ${
                        theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                      }`}>
                        {getPatientName(apt.paciente_id)}
                      </p>
                      <p className={`text-sm flex items-center mt-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <Clock size={14} className="mr-2 text-blue-600" /> 
                        {apt.hora_consulta}
                      </p>
                      <p className={`text-sm mt-1 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {new Date(apt.data_consulta + 'T00:00:00').toLocaleDateString('pt-BR')}
                      </p>
                      <div className="mt-3">{getStatusBadge(apt.status)}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Clock size={48} className={`mx-auto mb-4 ${
                      theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                    }`} />
                    <p className={`font-medium ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Nenhum agendamento futuro.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Área principal - Calendário do dia */}
          <div className="lg:col-span-3">
            <div className={`backdrop-blur-sm rounded-2xl p-6 border shadow-xl ${
              theme === 'dark' 
                ? 'bg-gray-800/95 border-gray-700/50' 
                : 'bg-white/95 border-gray-200/50'
            }`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                <div className="flex items-center">
                  <Calendar size={24} className="text-blue-600 mr-3" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    className={`text-lg font-bold border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                </div>
                <div className="flex items-center space-x-2 flex-wrap gap-2">
                  {[
                    { key: 'all', label: 'Todos', color: 'bg-gray-600', hoverColor: 'hover:bg-gray-700' },
                    { key: 'agendada', label: 'Agendadas', color: 'bg-blue-600', hoverColor: 'hover:bg-blue-700' },
                    { key: 'concluida', label: 'Concluídas', color: 'bg-green-600', hoverColor: 'hover:bg-green-700' },
                    { key: 'cancelada', label: 'Canceladas', color: 'bg-red-600', hoverColor: 'hover:bg-red-700' }
                  ].map(f => (
                    <button 
                      key={f.key} 
                      onClick={() => setFilter(f.key as any)} 
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                        filter === f.key 
                          ? `${f.color} text-white shadow-lg transform scale-105` 
                          : theme === 'dark'
                            ? `bg-gray-700 ${f.hoverColor} hover:text-white text-gray-300 hover:scale-105`
                            : `bg-gray-100 ${f.hoverColor} hover:text-white text-gray-700 hover:scale-105`
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

               <div className="overflow-x-auto">
                 {filteredAppointments.length > 0 ? (
                   <div className={`rounded-xl border overflow-hidden shadow-lg ${
                     theme === 'dark' 
                       ? 'bg-gray-700 border-gray-600/50' 
                       : 'bg-white border-gray-200/50'
                   }`}>
                     <table className="w-full">
                       <thead className={`${
                         theme === 'dark' 
                           ? 'bg-gradient-to-r from-blue-900/50 to-blue-800/50' 
                           : 'bg-gradient-to-r from-blue-50 to-blue-100'
                       }`}>
                         <tr>
                           <th className={`text-left py-4 px-6 font-bold ${
                             theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                           }`}>Horário</th>
                           <th className={`text-left py-4 px-6 font-bold ${
                             theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                           }`}>Paciente</th>
                           <th className={`text-left py-4 px-6 font-bold ${
                             theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                           }`}>Status</th>
                           <th className={`text-right py-4 px-6 font-bold ${
                             theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                           }`}>Ações</th>
                         </tr>
                       </thead>
                       <tbody className={`divide-y ${
                         theme === 'dark' ? 'divide-gray-600' : 'divide-gray-100'
                       }`}>
                         {filteredAppointments.sort((a, b) => a.hora_consulta.localeCompare(b.hora_consulta)).map(appointment => (
                           <tr key={appointment.id} className={`transition-all duration-200 ${
                             theme === 'dark' 
                               ? 'hover:bg-blue-900/30' 
                               : 'hover:bg-blue-50/50'
                           }`}>
                             <td className={`px-6 py-4 font-bold ${
                               theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                             }`}>
                               {appointment.hora_consulta}
                             </td>
                             <td className={`px-6 py-4 font-medium ${
                               theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                             }`}>
                               {getPatientName(appointment.paciente_id)}
                             </td>
                             <td className="px-6 py-4">{getStatusBadge(appointment.status)}</td>
                             <td className="px-6 py-4 text-right">
                               <div className="flex items-center justify-end space-x-2">
                                 {appointment.status === 'agendada' && (
                                   <button 
                                     onClick={() => handleCompleteAppointment(appointment)} 
                                     title="Marcar como Concluída" 
                                     className={`p-2 text-green-600 hover:text-green-700 rounded-xl transition-all duration-200 hover:scale-110 ${
                                       theme === 'dark' ? 'hover:bg-green-900/30' : 'hover:bg-green-50'
                                     }`}
                                   >
                                     <CheckCircle size={18} />
                                   </button>
                                 )}
                                 <button 
                                   onClick={() => handleEditAppointment(appointment)} 
                                   title="Editar" 
                                   className={`p-2 text-blue-600 hover:text-blue-700 rounded-xl transition-all duration-200 hover:scale-110 ${
                                     theme === 'dark' ? 'hover:bg-blue-900/30' : 'hover:bg-blue-50'
                                   }`}
                                 >
                                   <Edit size={18} />
                                 </button>
                                 {appointment.status !== 'cancelada' && (
                                   <button 
                                     onClick={() => handleDeleteAppointment(appointment)} 
                                     title="Cancelar" 
                                     className={`p-2 text-red-600 hover:text-red-700 rounded-xl transition-all duration-200 hover:scale-110 ${
                                       theme === 'dark' ? 'hover:bg-red-900/30' : 'hover:bg-red-50'
                                     }`}
                                   >
                                     <Trash2 size={18} />
                                   </button>
                                 )}
                               </div>
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                 ) : (
                   <div className="text-center py-16">
                     <AlertCircle size={48} className={`mx-auto mb-4 ${
                       theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                     }`} />
                     <p className={`text-lg font-medium ${
                       theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                     }`}>
                       Nenhum agendamento para esta data.
                     </p>
                     <p className={`text-sm mt-2 ${
                       theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                     }`}>
                       Selecione uma data diferente ou crie um novo agendamento.
                     </p>
                   </div>
                 )}
               </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <AppointmentModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveAppointment}
          appointment={selectedAppointment}
          patient={selectedPatient}
        />
      )}
    </div>
  )
}

export default Appointments
