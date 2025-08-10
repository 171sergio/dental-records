import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// Removido import do Supabase - usando dados mock
import { Patient, Procedure, Document } from '../types'
import { supabaseOperations } from '../services/supabaseOperations'
import { ArrowLeft, User, FileText, Image, LogOut, UserCheck, Stethoscope } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import PatientInfoTab from '../components/PatientInfoTab'
import OdontogramaTab from '../components/OdontogramaTab'
import DocumentsTab from '../components/DocumentsTab'

const PatientRecord: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('info')
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
    if (id) {
      loadPatientData()
    }
  }, [id])

  const loadPatientData = async () => {
    if (!id) return

    try {
      // Carregar dados do paciente
      const { data: patientData } = await supabaseOperations.getPatientById(id!)
      
      if (!patientData) {
        throw new Error('Paciente não encontrado')
      }
      setPatient(patientData)

      // Carregar procedimentos
      const { data: proceduresData } = await supabaseOperations.getProceduresByPatient(id!)
      setProcedures(proceduresData || [])

      // Carregar documentos
      const { data: documentsData } = await supabaseOperations.getDocumentsByPatient(id!)
      setDocuments(documentsData || [])
    } catch (error) {
      console.error('Erro ao carregar dados do paciente:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-600"></div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100 text-center">
        <h4 className="text-2xl font-bold text-gray-700 mb-4">Paciente não encontrado</h4>
        <button 
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700 transition-colors"
          onClick={() => navigate('/dashboard')}
        >
          Voltar ao Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center">
          <button
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 mr-4"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Prontuário do Paciente</h1>
            <p className="text-sm text-gray-500">{patient.nome_completo}</p>
          </div>
        </div>
        
        {/* User Menu */}
        <div className="relative">
          <button 
            className="flex items-center space-x-2 p-2 rounded-md bg-gray-100 hover:bg-gray-200"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <Stethoscope size={18} className="text-gray-600" />
            <span className="hidden md:inline text-sm font-medium text-gray-700">{user?.email}</span>
            <User size={18} className="text-gray-600" />
          </button>
          
          {showUserMenu && (
            <>
              <div 
                className="fixed inset-0 bg-black bg-opacity-10 z-10"
                onClick={() => setShowUserMenu(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-20 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <Stethoscope size={20} className="mr-3 text-indigo-600" />
                    <div>
                      <div className="font-semibold text-gray-800">{user?.email}</div>
                      <small className="text-gray-500">Dentista</small>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button 
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={handleSwitchAccount}
                  >
                    <UserCheck size={16} className="mr-3" />
                    Trocar Conta
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} className="mr-3" />
                    Sair
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      <main className="p-6"> 
        {/* Patient Summary Card */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{patient.nome_completo}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-600">
                <p><strong className="font-medium text-gray-700">CPF:</strong> {patient.cpf}</p>
                <p><strong className="font-medium text-gray-700">Email:</strong> {patient.email}</p>
                <p><strong className="font-medium text-gray-700">Telefone:</strong> {patient.telefone}</p>
                <p><strong className="font-medium text-gray-700">Status:</strong> <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">{patient.status}</span></p>


              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">
                Cadastrado em {new Date(patient.created_at).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('info')}
                className={`${activeTab === 'info' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                <User size={16} className="inline-block mr-2"/>
                Informações
              </button>
              <button
                onClick={() => setActiveTab('odontogram')}
                className={`${activeTab === 'odontogram' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                <Image size={16} className="inline-block mr-2"/>
                Odontograma
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`${activeTab === 'documents' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                <FileText size={16} className="inline-block mr-2"/>
                Documentos
              </button>
            </nav>
          </div>

          <div className="mt-8">
            {activeTab === 'info' && <PatientInfoTab patient={patient} onPatientUpdated={loadPatientData} />}
            {activeTab === 'odontogram' && <OdontogramaTab patientId={patient.id} procedures={procedures} onProcedureAdded={loadPatientData} />}
            {activeTab === 'documents' && <DocumentsTab patientId={patient.id} documents={documents} onDocumentAdded={loadPatientData} />}
          </div>
        </div>
      </main>


    </div>
  )
}

export default PatientRecord