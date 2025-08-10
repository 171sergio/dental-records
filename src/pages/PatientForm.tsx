import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabaseOperations } from '../services/supabaseOperations'
import { ArrowLeft, Save, User, Mail, Phone, MapPin, Calendar, Activity, Heart, AlertTriangle, Pill, LogOut, UserCheck, Stethoscope } from 'lucide-react'
import { useFormValidation, patientSchema, PatientFormData } from '../hooks/useFormValidation'
import FormField from '../components/FormField'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'

const PatientForm: React.FC = () => {
  const { user, signOut } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
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

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch
  } = useFormValidation(patientSchema, {
    medicalHistory: '',
    allergies: '',
    medications: ''
  })

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }
    return value
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
    return value
  }

  const onSubmit = async (data: PatientFormData) => {
    setLoading(true)
    setError('')

    try {
      await supabaseOperations.createPatient({
        nome_completo: data.name,
        cpf: data.cpf,
        email: data.email,
        telefone: data.phone,
        endereco: data.address,
        data_nascimento: data.birthDate,
        status: data.status || 'ativo'
      })

      navigate('/dashboard')
    } catch (error: any) {
      setError('Erro ao cadastrar paciente. Tente novamente.')
      console.error('Erro ao cadastrar paciente:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen ${
      theme === 'dark' 
        ? 'bg-gray-900 text-gray-100' 
        : 'bg-gray-50 text-gray-800'
    }`}>
      {/* Header */}
      <header className={`shadow-md border-b ${
        theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              className={`p-2 rounded-md transition-colors ${
                theme === 'dark' 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className={`text-xl font-bold ${
                theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
              }`}>
                Novo Paciente
              </h1>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Cadastre um novo paciente no sistema
              </p>
            </div>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
                theme === 'dark' 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <span className="hidden md:inline text-sm">{user?.email}</span>
              <User size={20} />
            </button>

            {showUserMenu && (
              <div
                className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-20 border ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <div className={`p-2 border-b ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <Stethoscope size={20} className="text-blue-600" />
                    <div>
                      <div className={`font-bold text-sm ${
                        theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                      }`}>
                        {user?.email}
                      </div>
                      <small className={`${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Dentista
                      </small>
                    </div>
                  </div>
                </div>
                <div className="p-1">
                  <button
                    className={`w-full text-left flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                      theme === 'dark' 
                        ? 'hover:bg-gray-700 text-gray-300' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                    onClick={handleSwitchAccount}
                  >
                    <UserCheck size={16} />
                    Trocar Conta
                  </button>
                  <button
                    className={`w-full text-left flex items-center gap-2 px-3 py-2 text-sm rounded-md text-red-600 transition-colors ${
                      theme === 'dark' ? 'hover:bg-red-900/20' : 'hover:bg-red-50'
                    }`}
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Formulário */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className={`rounded-lg shadow-lg border ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div className={`p-6 border-b ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h5 className={`text-lg font-semibold flex items-center gap-2 ${
                theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
              }`}>
                <User size={20} />
                Informações do Paciente
              </h5>
            </div>

            <div className="p-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-md p-3 mb-4 flex items-center gap-2" role="alert">
                    <AlertTriangle size={18} />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Informações Básicas */}
                  <div className="space-y-4">
                    <h6 className={`text-md font-semibold flex items-center gap-2 border-b pb-2 ${
                      theme === 'dark' 
                        ? 'text-gray-100 border-gray-700' 
                        : 'text-gray-800 border-gray-200'
                    }`}>
                      <User size={16} />
                      Informações Básicas
                    </h6>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        name="name"
                        label="Nome Completo"
                        placeholder="Digite o nome completo"
                        register={register}
                        error={errors.name}
                        required
                      />
                      
                      <FormField
                        name="cpf"
                        label="CPF"
                        placeholder="000.000.000-00"
                        register={register}
                        error={errors.cpf}
                        required
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="email@exemplo.com"
                        register={register}
                        error={errors.email}
                        required
                      />
                      
                      <FormField
                        name="phone"
                        label="Telefone"
                        type="tel"
                        placeholder="(00) 00000-0000"
                        register={register}
                        error={errors.phone}
                        required
                      />
                    </div>
                    
                    <FormField
                      name="address"
                      label="Endereço"
                      placeholder="Rua, número, bairro, cidade - UF"
                      register={register}
                      error={errors.address}
                      required
                    />
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        name="birthDate"
                        label="Data de Nascimento"
                        type="date"
                        register={register}
                        error={errors.birthDate}
                        required
                      />
                      
                      <FormField
                        name="emergencyContact"
                        label="Contato de Emergência"
                        placeholder="Nome do contato"
                        register={register}
                        error={errors.emergencyContact}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Status do Paciente
                      </label>
                      <select
                        {...register('status')}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-gray-100' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="ativo">Ativo</option>
                        <option value="em_tratamento">Em Tratamento</option>
                        <option value="pendente">Pendente</option>
                        <option value="alta">Alta</option>
                        <option value="inativo">Inativo</option>
                      </select>
                      {errors.status && (
                        <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>
                      )}
                    </div>
                    
                    <FormField
                      name="emergencyPhone"
                      label="Telefone de Emergência"
                      type="tel"
                      placeholder="(00) 00000-0000"
                      register={register}
                      error={errors.emergencyPhone}
                      required
                    />
                  </div>

                  {/* Informações Médicas */}
                  <div className="space-y-4">
                    <h6 className={`text-md font-semibold flex items-center gap-2 border-b pb-2 ${
                      theme === 'dark' 
                        ? 'text-gray-100 border-gray-700' 
                        : 'text-gray-800 border-gray-200'
                    }`}>
                      <Heart size={16} />
                      Informações Médicas
                    </h6>
                    <FormField
                      name="medicalHistory"
                      label="Histórico Médico Relevante"
                      type="textarea"
                      placeholder="Descreva o histórico médico..."
                      register={register}
                      error={errors.medicalHistory}
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        name="allergies"
                        label="Alergias"
                        type="textarea"
                        placeholder="Descreva as alergias..."
                        register={register}
                        error={errors.allergies}
                      />
                      <FormField
                        name="medications"
                        label="Medicamentos em Uso"
                        type="textarea"
                        placeholder="Descreva os medicamentos..."
                        register={register}
                        error={errors.medications}
                      />
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  <div className={`flex justify-end gap-4 pt-4 border-t ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard')}
                      disabled={loading}
                      className={`bg-gray-600 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed ${
                        theme === 'dark' ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'
                      }`}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className={`bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
                        theme === 'dark' ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'
                      }`}
                      disabled={loading || !isValid}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Salvar Paciente
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
    </div>
  )
}

export default PatientForm