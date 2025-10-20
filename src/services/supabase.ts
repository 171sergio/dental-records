import { createClient } from '@supabase/supabase-js'

// Configuração temporária para deploy - substitua pelas suas credenciais reais
const supabaseUrl = 'https://demo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export interface Patient {
  id: string
  nome_completo: string
  cpf: string
  email: string
  telefone: string
  endereco: string
  data_nascimento: string
  status: 'alta' | 'em_tratamento' | 'ativo' | 'inativo' | 'pendente'
  created_at: string
  updated_at: string
}

export interface Procedure {
  id: string
  paciente_id: string
  dente_numero: number
  procedimento: string
  observacoes: string
  data_procedimento: string
  created_at: string
}

export interface Document {
  id: string
  paciente_id: string
  nome_arquivo: string
  tipo_arquivo: string
  url_arquivo: string
  data_upload: string
}

export interface Appointment {
  id: string
  paciente_id: string
  data_consulta: string
  hora_consulta: string
  observacoes: string
  status: 'agendada' | 'concluida' | 'cancelada'
  created_at: string
}