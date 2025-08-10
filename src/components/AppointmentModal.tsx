import React, { useState, useEffect } from 'react'
import { X, Calendar, Clock, User, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import { Patient, Appointment } from '../types'
import { supabaseOperations } from '../services/supabaseOperations'
import { useFormValidation, appointmentSchema, AppointmentFormData } from '../hooks/useFormValidation'
import FormField from './FormField'

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  patient?: Patient
  appointment?: Appointment
  onSave: (appointment: Appointment) => void
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  patient,
  appointment,
  onSave
}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [patients, setPatients] = useState<Patient[]>([])
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    reset
  } = useFormValidation(appointmentSchema, {
    patientId: patient?.id || '',
    date: '',
    time: '',
    type: 'consulta',
    observations: ''
  })

  useEffect(() => {
    if (isOpen) {
      loadPatients()
      if (appointment) {
        reset({
          patientId: appointment.paciente_id,
          date: appointment.data_consulta,
          time: appointment.hora_consulta,
          type: 'consulta',
          observations: appointment.observacoes
        })
      } else {
        reset({
          patientId: patient?.id || '',
          date: '',
          time: '',
          type: 'consulta',
          observations: ''
        })
      }
      setError('')
      setSuccess('')
    }
  }, [isOpen, appointment, patient, reset])

  const loadPatients = async () => {
    try {
      const { data } = await supabaseOperations.getPatients()
      setPatients(data || [])
    } catch (err) {
      console.error('Erro ao carregar pacientes:', err)
    }
  }

  const onSubmit = async (data: AppointmentFormData) => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Verificar se a data não é no passado
      const appointmentDate = new Date(`${data.date}T${data.time}`)
      if (appointmentDate < new Date()) {
        throw new Error('Não é possível agendar para uma data/hora no passado')
      }

      // Salvar no banco de dados
      let savedAppointment: Appointment
      
      if (appointment) {
        // Atualizar agendamento existente
        const { data: result } = await supabaseOperations.updateAppointment(appointment.id, {
          paciente_id: data.patientId,
          data_consulta: data.date,
          hora_consulta: data.time,
          observacoes: data.observations
        })
        savedAppointment = result
      } else {
        // Criar novo agendamento
        const { data: result } = await supabaseOperations.createAppointment({
          paciente_id: data.patientId,
          data_consulta: data.date,
          hora_consulta: data.time,
          observacoes: data.observations,
          status: 'agendada'
        })
        savedAppointment = result
      }

      setSuccess(appointment ? 'Agendamento atualizado com sucesso!' : 'Agendamento criado com sucesso!')
      onSave(savedAppointment)
      
      setTimeout(() => {
        onClose()
      }, 1500)

    } catch (err: any) {
      setError(err.message || 'Erro ao salvar agendamento')
    } finally {
      setLoading(false)
    }
  }



  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Calendar className="mr-2" size={20} />
            {appointment ? 'Editar Agendamento' : 'Novo Agendamento'}
          </h2>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={onClose}
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-6">
              {/* Alertas */}
              {error && (
                <div className="flex items-center p-4 mb-4 text-sm text-red-800 bg-red-100 rounded-lg">
                  <AlertCircle size={18} className="mr-2" />
                  {error}
                </div>
              )}
              
              {success && (
                <div className="flex items-center p-4 mb-4 text-sm text-green-800 bg-green-100 rounded-lg">
                  <CheckCircle size={18} className="mr-2" />
                  {success}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Seleção de Paciente */}
                <FormField
                  name="patientId"
                  label="Paciente"
                  type="select"
                  register={register}
                  error={errors.patientId}
                  required
                  disabled={loading || !!patient}
                  options={[
                    ...patients.map(p => ({
                      value: p.id,
                      label: p.nome_completo
                    }))
                  ]}
                />

                {/* Tipo de Consulta */}
                <FormField
                  name="type"
                  label="Tipo de Consulta"
                  type="select"
                  register={register}
                  error={errors.type}
                  required
                  disabled={loading}
                  options={[
                    { value: 'consulta', label: 'Consulta' },
                    { value: 'limpeza', label: 'Limpeza' },
                    { value: 'procedimento', label: 'Procedimento' },
                    { value: 'emergencia', label: 'Emergência' }
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Data da Consulta */}
                <FormField
                  name="date"
                  label="Data da Consulta"
                  type="date"
                  register={register}
                  error={errors.date}
                  required
                  disabled={loading}
                  min={new Date().toISOString().split('T')[0]}
                />

                {/* Hora da Consulta */}
                <FormField
                  name="time"
                  label="Hora da Consulta"
                  type="time"
                  register={register}
                  error={errors.time}
                  required
                  disabled={loading}
                />
              </div>

              {/* Observações */}
              <FormField
                name="observations"
                label="Observações"
                type="textarea"
                placeholder="Observações sobre a consulta..."
                register={register}
                error={errors.observations}
                disabled={loading}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                type="button"
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !isValid}
              >
                {loading ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  appointment ? 'Atualizar' : 'Agendar'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
  )
}

export default AppointmentModal