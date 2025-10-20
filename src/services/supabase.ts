import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase usando variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas. Verifique VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY')
}

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