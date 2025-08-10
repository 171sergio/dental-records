import { supabase } from './supabase'
import { Patient, Procedure, Document, Appointment } from '../types/index'

// Interface para resposta padrão do Supabase
interface SupabaseResponse<T> {
  data: T | null
  error: any
}

export const supabaseOperations = {
  // ==================== PACIENTES ====================
  
  // Buscar todos os pacientes
  getPatients: async (): Promise<SupabaseResponse<Patient[]>> => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar pacientes:', error)
        return { data: null, error }
      }

      return { data: data || [], error: null }
    } catch (error) {
      console.error('Erro inesperado ao buscar pacientes:', error)
      return { data: null, error }
    }
  },

  // Buscar paciente por ID
  getPatientById: async (id: string): Promise<SupabaseResponse<Patient>> => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Erro ao buscar paciente:', error)
        return { data: null, error }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Erro inesperado ao buscar paciente:', error)
      return { data: null, error }
    }
  },

  // Criar novo paciente
  createPatient: async (patientData: Omit<Patient, 'id' | 'created_at' | 'updated_at'>): Promise<SupabaseResponse<Patient>> => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .insert([{
          nome_completo: patientData.nome_completo,
          cpf: patientData.cpf,
          email: patientData.email,
          telefone: patientData.telefone,
          endereco: patientData.endereco,
          data_nascimento: patientData.data_nascimento,
          status: patientData.status || 'em_tratamento'
        }])
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar paciente:', error)
        return { data: null, error }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Erro inesperado ao criar paciente:', error)
      return { data: null, error }
    }
  },

  // Atualizar paciente
  updatePatient: async (id: string, updates: Partial<Patient>): Promise<SupabaseResponse<Patient>> => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar paciente:', error)
        return { data: null, error }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Erro inesperado ao atualizar paciente:', error)
      return { data: null, error }
    }
  },

  // Deletar paciente
  deletePatient: async (id: string): Promise<SupabaseResponse<boolean>> => {
    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Erro ao deletar paciente:', error)
        return { data: null, error }
      }

      return { data: true, error: null }
    } catch (error) {
      console.error('Erro inesperado ao deletar paciente:', error)
      return { data: null, error }
    }
  },

  // ==================== PROCEDIMENTOS ====================

  // Buscar procedimentos por paciente
  getProceduresByPatient: async (patientId: string): Promise<SupabaseResponse<Procedure[]>> => {
    try {
      const { data, error } = await supabase
        .from('procedures')
        .select('*')
        .eq('paciente_id', patientId)
        .order('data_procedimento', { ascending: false })

      if (error) {
        console.error('Erro ao buscar procedimentos:', error)
        return { data: null, error }
      }

      return { data: data || [], error: null }
    } catch (error) {
      console.error('Erro inesperado ao buscar procedimentos:', error)
      return { data: null, error }
    }
  },

  // Criar novo procedimento
  createProcedure: async (procedureData: Omit<Procedure, 'id' | 'created_at'>): Promise<SupabaseResponse<Procedure>> => {
    try {
      const { data, error } = await supabase
        .from('procedures')
        .insert([procedureData])
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar procedimento:', error)
        return { data: null, error }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Erro inesperado ao criar procedimento:', error)
      return { data: null, error }
    }
  },

  // Atualizar procedimento
  updateProcedure: async (id: string, updates: Partial<Procedure>): Promise<SupabaseResponse<Procedure>> => {
    try {
      const { data, error } = await supabase
        .from('procedures')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar procedimento:', error)
        return { data: null, error }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Erro inesperado ao atualizar procedimento:', error)
      return { data: null, error }
    }
  },

  // Deletar procedimento
  deleteProcedure: async (id: string): Promise<SupabaseResponse<boolean>> => {
    try {
      const { error } = await supabase
        .from('procedures')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Erro ao deletar procedimento:', error)
        return { data: null, error }
      }

      return { data: true, error: null }
    } catch (error) {
      console.error('Erro inesperado ao deletar procedimento:', error)
      return { data: null, error }
    }
  },

  // ==================== DOCUMENTOS ====================

  // Buscar documentos por paciente
  getDocumentsByPatient: async (patientId: string): Promise<SupabaseResponse<Document[]>> => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('paciente_id', patientId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar documentos:', error)
        return { data: null, error }
      }

      return { data: data || [], error: null }
    } catch (error) {
      console.error('Erro inesperado ao buscar documentos:', error)
      return { data: null, error }
    }
  },

  // Criar novo documento
  createDocument: async (documentData: Omit<Document, 'id' | 'created_at'>): Promise<SupabaseResponse<Document>> => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert([documentData])
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar documento:', error)
        return { data: null, error }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Erro inesperado ao criar documento:', error)
      return { data: null, error }
    }
  },

  // Deletar documento
  deleteDocument: async (id: string): Promise<SupabaseResponse<boolean>> => {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Erro ao deletar documento:', error)
        return { data: null, error }
      }

      return { data: true, error: null }
    } catch (error) {
      console.error('Erro inesperado ao deletar documento:', error)
      return { data: null, error }
    }
  },

  // Upload de arquivo para o Storage
  uploadFile: async (file: File, bucket: string = 'documents'): Promise<SupabaseResponse<string>> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${fileName}`

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file)

      if (error) {
        console.error('Erro ao fazer upload:', error)
        return { data: null, error }
      }

      // Obter URL pública do arquivo
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      return { data: publicUrl, error: null }
    } catch (error) {
      console.error('Erro inesperado no upload:', error)
      return { data: null, error }
    }
  },

  // ==================== AGENDAMENTOS ====================

  // Buscar todos os agendamentos
  getAppointments: async (): Promise<SupabaseResponse<Appointment[]>> => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('data_consulta', { ascending: true })

      if (error) {
        console.error('Erro ao buscar agendamentos:', error)
        return { data: null, error }
      }

      return { data: data || [], error: null }
    } catch (error) {
      console.error('Erro inesperado ao buscar agendamentos:', error)
      return { data: null, error }
    }
  },

  // Buscar agendamentos por paciente
  getAppointmentsByPatient: async (patientId: string): Promise<SupabaseResponse<Appointment[]>> => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('paciente_id', patientId)
        .order('data_consulta', { ascending: false })

      if (error) {
        console.error('Erro ao buscar agendamentos do paciente:', error)
        return { data: null, error }
      }

      return { data: data || [], error: null }
    } catch (error) {
      console.error('Erro inesperado ao buscar agendamentos do paciente:', error)
      return { data: null, error }
    }
  },

  // Criar novo agendamento
  createAppointment: async (appointmentData: Omit<Appointment, 'id' | 'created_at'>): Promise<SupabaseResponse<Appointment>> => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar agendamento:', error)
        return { data: null, error }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Erro inesperado ao criar agendamento:', error)
      return { data: null, error }
    }
  },

  // Atualizar agendamento
  updateAppointment: async (id: string, updates: Partial<Appointment>): Promise<SupabaseResponse<Appointment>> => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar agendamento:', error)
        return { data: null, error }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Erro inesperado ao atualizar agendamento:', error)
      return { data: null, error }
    }
  },

  // Deletar agendamento
  deleteAppointment: async (id: string): Promise<SupabaseResponse<boolean>> => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Erro ao deletar agendamento:', error)
        return { data: null, error }
      }

      return { data: true, error: null }
    } catch (error) {
      console.error('Erro inesperado ao deletar agendamento:', error)
      return { data: null, error }
    }
  }
}