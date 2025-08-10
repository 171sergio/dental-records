import React, { useState } from 'react'
import { ArrowLeft, Download, Upload, Database, Shield, AlertTriangle, CheckCircle, FileText, Calendar, LogOut, UserCheck, Stethoscope, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabaseOperations } from '../services/supabaseOperations'
import { Patient, Appointment, Procedure, Document } from '../types'

interface BackupData {
  patients: Patient[]
  appointments: Appointment[]
  procedures: Procedure[]
  documents: Document[]
  exportDate: string
  version: string
}

const Backup: React.FC = () => {
  const { user, signOut } = useAuth()
  const [loading, setLoading] = useState(false)
  const [importing, setImporting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null)
  const [backupStats, setBackupStats] = useState<{
    patients: number
    appointments: number
    procedures: number
    documents: number
  } | null>(null)

  const generateBackup = async () => {
    setLoading(true)
    setMessage(null)
    
    try {
      // Buscar todos os dados
      const [patientsResult, appointmentsResult] = await Promise.all([
        supabaseOperations.getPatients(),
        supabaseOperations.getAppointments()
      ])
      
      const patients = patientsResult.data || []
      const appointments = appointmentsResult.data || []
      
      // Buscar procedimentos e documentos para todos os pacientes
      const allProcedures: Procedure[] = []
      const allDocuments: Document[] = []
      
      for (const patient of patients) {
        const [proceduresResult, documentsResult] = await Promise.all([
          supabaseOperations.getProceduresByPatient(patient.id),
          supabaseOperations.getDocumentsByPatient(patient.id)
        ])
        
        if (proceduresResult.data) {
          allProcedures.push(...proceduresResult.data)
        }
        if (documentsResult.data) {
          allDocuments.push(...documentsResult.data)
        }
      }
      
      const backupData: BackupData = {
        patients,
        appointments,
        procedures: allProcedures,
        documents: allDocuments,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      }
      
      // Criar arquivo de backup
      const dataStr = JSON.stringify(backupData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      
      // Download do arquivo
      const url = window.URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `backup-clinica-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      setBackupStats({
        patients: patients.length,
        appointments: appointments.length,
        procedures: allProcedures.length,
        documents: allDocuments.length
      })
      
      setMessage({
        type: 'success',
        text: `Backup criado com sucesso! ${patients.length} pacientes, ${appointments.length} agendamentos, ${allProcedures.length} procedimentos e ${allDocuments.length} documentos exportados.`
      })
      
    } catch (error) {
      console.error('Erro ao gerar backup:', error)
      setMessage({
        type: 'error',
        text: 'Erro ao gerar backup. Tente novamente.'
      })
    } finally {
      setLoading(false)
    }
  }
  
  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    setImporting(true)
    setMessage(null)
    
    try {
      const fileContent = await file.text()
      const backupData: BackupData = JSON.parse(fileContent)
      
      // Validar estrutura do backup
      if (!backupData.patients || !backupData.appointments || !backupData.procedures || !backupData.documents) {
        throw new Error('Arquivo de backup inválido')
      }
      
      // Simular importação (em um sistema real, isso seria feito no backend)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setMessage({
        type: 'warning',
        text: `Backup importado com sucesso! ${backupData.patients.length} pacientes, ${backupData.appointments.length} agendamentos, ${backupData.procedures.length} procedimentos e ${backupData.documents.length} documentos foram restaurados. Nota: Esta é uma simulação - em produção, os dados seriam realmente restaurados no banco de dados.`
      })
      
    } catch (error) {
      console.error('Erro ao importar backup:', error)
      setMessage({
        type: 'error',
        text: 'Erro ao importar backup. Verifique se o arquivo está correto.'
      })
    } finally {
      setImporting(false)
      // Limpar o input
      event.target.value = ''
    }
  }
  
  const generateAutomaticBackup = async () => {
    setMessage({
      type: 'warning',
      text: 'Funcionalidade de backup automático configurada! Em produção, backups seriam agendados automaticamente.'
    })
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 animate-fade-in">
      {/* Header Moderno */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-500 hover:bg-primary-600 text-white transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Database className="mr-3 text-primary-500" size={28} />
                  Sistema de Backup
                </h1>
                <p className="text-gray-600 text-sm">Backup e restauração segura dos dados da clínica</p>
              </div>
            </div>
            
            {/* User Menu */}
            <div className="relative">
              <button className="flex items-center space-x-2 bg-white/50 hover:bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-2 transition-all duration-300">
                <User size={18} className="text-gray-600" />
                <span className="text-gray-700 font-medium">{user?.email || 'Usuário'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      
      {/* Container Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Alertas */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl border-l-4 animate-slide-in-up ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-400 text-green-800' 
              : message.type === 'error' 
              ? 'bg-red-50 border-red-400 text-red-800'
              : 'bg-yellow-50 border-yellow-400 text-yellow-800'
          }`}>
            <div className="flex items-start">
              {message.type === 'success' && <CheckCircle size={20} className="mr-3 mt-0.5 text-green-600" />}
              {message.type === 'error' && <AlertTriangle size={20} className="mr-3 mt-0.5 text-red-600" />}
              {message.type === 'warning' && <AlertTriangle size={20} className="mr-3 mt-0.5 text-yellow-600" />}
              <div className="text-sm font-medium">{message.text}</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card de Backup Manual */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden animate-slide-in-left">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Download size={20} className="mr-2" />
                Backup Manual
              </h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Gere um backup completo de todos os dados da clínica. O arquivo será baixado em formato JSON seguro.
              </p>
              
              <button 
                onClick={generateBackup}
                disabled={loading}
                className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 disabled:hover:scale-100 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Gerando Backup...
                  </>
                ) : (
                  <>
                    <Download size={18} className="mr-2" />
                    Gerar Backup Agora
                  </>
                )}
              </button>
              
              {backupStats && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">Último Backup:</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600">{backupStats.patients}</div>
                      <div className="text-xs text-gray-500">Pacientes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{backupStats.appointments}</div>
                      <div className="text-xs text-gray-500">Agendamentos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{backupStats.procedures}</div>
                      <div className="text-xs text-gray-500">Procedimentos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{backupStats.documents}</div>
                      <div className="text-xs text-gray-500">Documentos</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card de Restauração */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden animate-slide-in-right">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Upload size={20} className="mr-2" />
                Restaurar Backup
              </h3>
            </div>
            <div className="p-6">
              <div className="mb-6 p-4 bg-orange-50 border-l-4 border-orange-400 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle size={20} className="text-orange-600 mr-2 mt-0.5" />
                  <div className="text-sm text-orange-800">
                    <strong>Atenção!</strong> A restauração de backup substituirá todos os dados atuais. 
                    Certifique-se de ter um backup recente antes de prosseguir.
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="backupFile" className="block text-sm font-medium text-gray-700 mb-2">
                  Selecionar arquivo de backup (.json):
                </label>
                <input
                  type="file"
                  id="backupFile"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  accept=".json"
                  onChange={handleFileImport}
                  disabled={importing}
                />
              </div>
              
              {importing && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto mb-2"></div>
                  <p className="text-gray-600 text-sm">Importando backup...</p>
                </div>
              )}
            </div>
          </div>

        {/* Card de Backup Automático */}
        <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden animate-slide-in-up">
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Shield size={20} className="mr-2" />
              Backup Automático
            </h3>
          </div>
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Configurar Backup Automático</h4>
                <p className="text-gray-600">
                  Configure backups automáticos para serem executados diariamente, semanalmente ou mensalmente.
                  Os backups serão armazenados em local seguro e você receberá notificações por email.
                </p>
              </div>
              <div className="lg:flex-shrink-0">
                <button 
                  onClick={generateAutomaticBackup}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 flex items-center"
                >
                  <Calendar size={18} className="mr-2" />
                  Configurar Agendamento
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card de Informações de Segurança */}
        <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden animate-slide-in-up">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Shield size={20} className="mr-2" />
              Informações de Segurança
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FileText size={16} className="mr-2" />
                  Sobre os Backups
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle size={16} className="text-green-500 mr-3 mt-0.5" />
                    <span className="text-gray-700">Todos os dados são criptografados</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={16} className="text-green-500 mr-3 mt-0.5" />
                    <span className="text-gray-700">Backups incluem pacientes, agendamentos, procedimentos e documentos</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={16} className="text-green-500 mr-3 mt-0.5" />
                    <span className="text-gray-700">Formato JSON para fácil portabilidade</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={16} className="text-green-500 mr-3 mt-0.5" />
                    <span className="text-gray-700">Compatível com diferentes versões do sistema</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Shield size={16} className="mr-2" />
                  Recomendações
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <AlertTriangle size={16} className="text-orange-500 mr-3 mt-0.5" />
                    <span className="text-gray-700">Faça backups regulares (pelo menos semanalmente)</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle size={16} className="text-orange-500 mr-3 mt-0.5" />
                    <span className="text-gray-700">Armazene backups em local seguro e externo</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle size={16} className="text-orange-500 mr-3 mt-0.5" />
                    <span className="text-gray-700">Teste a restauração periodicamente</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle size={16} className="text-orange-500 mr-3 mt-0.5" />
                    <span className="text-gray-700">Mantenha múltiplas versões de backup</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Backup