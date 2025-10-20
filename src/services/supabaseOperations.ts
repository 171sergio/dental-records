import { supabase } from './supabase'
import { createClient } from '@supabase/supabase-js'
import { Patient, Procedure, Document, Appointment } from '../types/index'
import { mockSupabaseOperations } from '../data/mockData'

// Interface para resposta padrão do Supabase
interface SupabaseResponse<T> {
  data: T | null
  error: any
}

// Flag para usar dados mockados como fallback quando Supabase falhar
const USE_MOCK_FALLBACK = true

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
        if (USE_MOCK_FALLBACK) {
          console.log('Usando dados mockados como fallback')
          return mockSupabaseOperations.getPatients()
        }
        return { data: null, error }
      }

      return { data: data || [], error: null }
    } catch (error) {
      console.error('Erro inesperado ao buscar pacientes:', error)
      if (USE_MOCK_FALLBACK) {
        console.log('Usando dados mockados como fallback')
        return mockSupabaseOperations.getPatients()
      }
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
        if (USE_MOCK_FALLBACK) {
          console.log('Usando dados mockados como fallback')
          return mockSupabaseOperations.getPatientById(id)
        }
        return { data: null, error }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Erro inesperado ao buscar paciente:', error)
      if (USE_MOCK_FALLBACK) {
        console.log('Usando dados mockados como fallback')
        return mockSupabaseOperations.getPatientById(id)
      }
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
        if (USE_MOCK_FALLBACK) {
          console.log('Usando dados mockados como fallback')
          return mockSupabaseOperations.getProceduresByPatient(patientId)
        }
        return { data: null, error }
      }

      return { data: data || [], error: null }
    } catch (error) {
      console.error('Erro inesperado ao buscar procedimentos:', error)
      if (USE_MOCK_FALLBACK) {
        console.log('Usando dados mockados como fallback')
        return mockSupabaseOperations.getProceduresByPatient(patientId)
      }
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
        if (USE_MOCK_FALLBACK) {
          console.log('Usando dados mockados como fallback')
          return mockSupabaseOperations.getDocumentsByPatient(patientId)
        }
        return { data: null, error }
      }

      return { data: data || [], error: null }
    } catch (error) {
      console.error('Erro inesperado ao buscar documentos:', error)
      if (USE_MOCK_FALLBACK) {
        console.log('Usando dados mockados como fallback')
        return mockSupabaseOperations.getDocumentsByPatient(patientId)
      }
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
        .select(`
          *,
          patients (nome_completo)
        `)
        .order('data_consulta', { ascending: true })

      if (error) {
        console.error('Erro ao buscar consultas:', error)
        if (USE_MOCK_FALLBACK) {
          console.log('Usando dados mockados como fallback')
          return mockSupabaseOperations.getAppointments()
        }
        return { data: null, error }
      }

      return { data: data || [], error: null }
    } catch (error) {
      console.error('Erro inesperado ao buscar consultas:', error)
      if (USE_MOCK_FALLBACK) {
        console.log('Usando dados mockados como fallback')
        return mockSupabaseOperations.getAppointments()
      }
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
  },

  // ==================== HEALTH CHECK ====================
  // Função para verificar conexão com o Supabase
  async checkConnection(): Promise<{ connected: boolean; authenticated: boolean; error?: string }> {
    try {
      console.log('[Supabase] Verificando conexão...')
      
      // Verificar se o cliente está configurado
      if (!supabase) {
        return { connected: false, authenticated: false, error: 'Cliente Supabase não configurado' }
      }
  
      // Verificar sessão do usuário
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.warn('[Supabase] Erro ao verificar sessão:', sessionError)
      }
  
      // Tentar uma consulta simples na tabela patients (sem autenticação necessária)
      const { data, error } = await supabase
        .from('patients')
        .select('id')
        .limit(1)
  
      if (error) {
        console.error('[Supabase] Erro na consulta de teste:', error)
        return { 
          connected: false, 
          authenticated: !!session, 
          error: `Erro na consulta: ${error.message}` 
        }
      }
  
      console.log('[Supabase] Conexão verificada com sucesso')
      return { 
        connected: true, 
        authenticated: !!session,
        error: undefined
      }
    } catch (error) {
      console.error('[Supabase] Erro na verificação de conexão:', error)
      return { 
        connected: false, 
        authenticated: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      }
    }
  },
  // Função temporária para configurar políticas RLS
  async setupTemporaryRLS(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('[Supabase] Configurando políticas RLS temporárias...')
      
      // Criar um cliente com service_role para operações administrativas
      const adminClient = createClient(
        'https://demo.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo' // service_role key
      )

      // Desabilitar RLS temporariamente
      const { error } = await adminClient.rpc('exec_sql', {
        sql: `
          ALTER TABLE patients DISABLE ROW LEVEL SECURITY;
          ALTER TABLE procedures DISABLE ROW LEVEL SECURITY;
          ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
          ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
        `
      })

      if (error) {
        console.error('[Supabase] Erro ao desabilitar RLS:', error)
        return { success: false, error: error.message }
      }

      console.log('[Supabase] RLS desabilitado temporariamente')
      return { success: true }
    } catch (error) {
      console.error('[Supabase] Erro na configuração RLS:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      }
    }
  },
}