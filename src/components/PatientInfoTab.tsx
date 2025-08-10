import React, { useState } from 'react'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Patient, PatientFormData } from '../types'
import { supabaseOperations } from '../services/supabaseOperations'
import { Edit3, Save, X, User, Mail, Phone, MapPin, Calendar, FileText } from 'lucide-react'

interface PatientInfoTabProps {
  patient: Patient
  onPatientUpdated: () => void
}

const schema = yup.object({
  nome_completo: yup.string().required('Nome é obrigatório'),
  cpf: yup.string().required('CPF é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  telefone: yup.string().required('Telefone é obrigatório'),
  endereco: yup.string().required('Endereço é obrigatório'),
  data_nascimento: yup.string().required('Data de nascimento é obrigatória'),
  status: yup.string().required('Status é obrigatório')
})

const PatientInfoTab: React.FC<PatientInfoTabProps> = ({ patient, onPatientUpdated }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PatientFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      nome_completo: patient.nome_completo,
      cpf: patient.cpf,
      email: patient.email,
      telefone: patient.telefone,
      endereco: patient.endereco,
      data_nascimento: patient.data_nascimento,
      status: patient.status
    }
  })

  const onSubmit = async (data: PatientFormData) => {
    setLoading(true)
    try {
      const { error } = await supabaseOperations.updatePatient(patient.id, data)
      
      if (error) {
        throw error
      }
      
      setIsEditing(false)
      onPatientUpdated()
      alert('Informações do paciente atualizadas com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar paciente:', error)
      alert('Erro ao atualizar informações do paciente.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    reset()
    setIsEditing(false)
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  }

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }
    return phone
  }

  const getStatusBadge = (status: string | null) => {
    const statusClasses: { [key: string]: string } = {
      'ativo': 'bg-green-100 text-green-800',
      'inativo': 'bg-gray-100 text-gray-800',
      'pendente': 'bg-yellow-100 text-yellow-800',
      'em_tratamento': 'bg-blue-100 text-blue-800',
      'alta': 'bg-purple-100 text-purple-800',
    };
    const displayStatus = status || 'pendente';
    const classes = statusClasses[displayStatus] || 'bg-gray-100 text-gray-800';
    const displayName = displayStatus === 'em_tratamento' ? 'Em Tratamento' : 
                       displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1);
    return <span className={`px-3 py-1 text-xs font-medium rounded-full ${classes}`}>{displayName}</span>;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Informações do Paciente</h3>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Edit3 size={16} className="mr-2" />
            Editar Informações
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <button 
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
            >
              <X size={16} className="mr-2" />
              Cancelar
            </button>
            <button 
              type="submit"
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </div>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        /* Modo de edição */
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1">
              <label htmlFor="nome_completo" className="block text-sm font-medium text-gray-700 mb-1">
                <User size={16} className="inline-block mr-2 text-gray-500" />
                Nome Completo *
              </label>
              <input
                type="text"
                id="nome_completo"
                {...register('nome_completo')}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.nome_completo ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.nome_completo && (
                <p className="mt-1 text-sm text-red-600">{errors.nome_completo.message}</p>
              )}
            </div>

            <div className="col-span-1">
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
                <FileText size={16} className="inline-block mr-2 text-gray-500" />
                CPF *
              </label>
              <input
                type="text"
                id="cpf"
                {...register('cpf')}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.cpf ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.cpf && (
                <p className="mt-1 text-sm text-red-600">{errors.cpf.message}</p>
              )}
            </div>

            <div className="col-span-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                <Mail size={16} className="inline-block mr-2 text-gray-500" />
                Email *
              </label>
              <input
                type="email"
                id="email"
                {...register('email')}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="col-span-1">
              <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                <Phone size={16} className="inline-block mr-2 text-gray-500" />
                Telefone *
              </label>
              <input
                type="tel"
                id="telefone"
                {...register('telefone')}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.telefone ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.telefone && (
                <p className="mt-1 text-sm text-red-600">{errors.telefone.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin size={16} className="inline-block mr-2 text-gray-500" />
                Endereço *
              </label>
              <input
                type="text"
                id="endereco"
                {...register('endereco')}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.endereco ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.endereco && (
                <p className="mt-1 text-sm text-red-600">{errors.endereco.message}</p>
              )}
            </div>

            <div className="col-span-1">
              <label htmlFor="data_nascimento" className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar size={16} className="inline-block mr-2 text-gray-500" />
                Data de Nascimento *
              </label>
              <input
                type="date"
                id="data_nascimento"
                {...register('data_nascimento')}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.data_nascimento ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.data_nascimento && (
                <p className="mt-1 text-sm text-red-600">{errors.data_nascimento.message}</p>
              )}
            </div>

            <div className="col-span-1">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                id="status"
                {...register('status')}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.status ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
                <option value="pendente">Pendente</option>
                <option value="em_tratamento">Em Tratamento</option>
                <option value="alta">Alta</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>
          </div>
        </form>
      ) : (
        /* Modo de visualização */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna de Informações Principais */}
          <div className="lg:col-span-2 bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              {/* Nome Completo */}
              <div className="info-item">
                <label className="flex items-center text-sm font-medium text-gray-500">
                  <User size={16} className="mr-2 text-indigo-500" />
                  Nome Completo
                </label>
                <p className="mt-1 text-md text-gray-900">{patient.nome_completo}</p>
              </div>

              {/* CPF */}
              <div className="info-item">
                <label className="flex items-center text-sm font-medium text-gray-500">
                  <FileText size={16} className="mr-2 text-indigo-500" />
                  CPF
                </label>
                <p className="mt-1 text-md text-gray-900">{formatCPF(patient.cpf)}</p>
              </div>

              {/* Email */}
              <div className="info-item">
                <label className="flex items-center text-sm font-medium text-gray-500">
                  <Mail size={16} className="mr-2 text-indigo-500" />
                  Email
                </label>
                <a href={`mailto:${patient.email}`} className="mt-1 text-md text-indigo-600 hover:underline">
                  {patient.email}
                </a>
              </div>

              {/* Telefone */}
              <div className="info-item">
                <label className="flex items-center text-sm font-medium text-gray-500">
                  <Phone size={16} className="mr-2 text-indigo-500" />
                  Telefone
                </label>
                <a href={`tel:${patient.telefone}`} className="mt-1 text-md text-indigo-600 hover:underline">
                  {formatPhone(patient.telefone)}
                </a>
              </div>

              {/* Endereço */}
              <div className="md:col-span-2 info-item">
                <label className="flex items-center text-sm font-medium text-gray-500">
                  <MapPin size={16} className="mr-2 text-indigo-500" />
                  Endereço
                </label>
                <p className="mt-1 text-md text-gray-900">{patient.endereco}</p>
              </div>

              {/* Data de Nascimento */}
              <div className="info-item">
                <label className="flex items-center text-sm font-medium text-gray-500">
                  <Calendar size={16} className="mr-2 text-indigo-500" />
                  Data de Nascimento
                </label>
                <p className="mt-1 text-md text-gray-900">
                  {new Date(patient.data_nascimento).toLocaleDateString('pt-BR')}
                </p>
              </div>

              {/* Status */}
              <div className="info-item">
                <label className="flex items-center text-sm font-medium text-gray-500">
                  Status
                </label>
                <div className="mt-1">
                  {getStatusBadge(patient.status)}
                </div>
              </div>
            </div>
          </div>

          {/* Coluna do Avatar e Resumo */}
          <div className="lg:col-span-1 bg-gray-50 p-6 rounded-lg flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
              <User size={48} className="text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">{patient.nome_completo.split(' ')[0]}</h3>
            <p className="text-md text-gray-600 mb-4">{calculateAge(patient.data_nascimento)} anos</p>
            
            <div className="w-full border-t border-gray-200 pt-4 mt-4">
              <div className="text-sm font-medium text-gray-500">Paciente desde</div>
              <p className="text-md text-gray-900 font-semibold">
                {new Date(patient.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientInfoTab