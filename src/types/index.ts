// Tipos principais do sistema
export interface User {
  id: string
  email: string
  nome: string
  role: 'dentista' | 'administrador'
  created_at: string
}

export interface Patient {
  id: string
  nome_completo: string
  cpf: string
  email: string
  telefone: string
  endereco: string
  data_nascimento: string
  status: 'ativo' | 'alta' | 'em_tratamento' | 'pendente' | 'inativo'
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
  tipo_documento?: string
  descricao?: string
  url_arquivo: string
  tamanho_arquivo?: number
  data_upload: string
  created_at: string
}

export interface Appointment {
  id: string
  paciente_id: string
  data_consulta: string
  hora_consulta: string
  observacoes: string
  status: 'agendada' | 'concluida' | 'cancelada'
  google_calendar_event_id?: string
  created_at: string
}

// Tipos para formulários
export interface PatientFormData {
  nome_completo: string
  cpf: string
  email: string
  telefone: string
  endereco: string
  data_nascimento: string
  status: 'ativo' | 'alta' | 'em_tratamento' | 'pendente' | 'inativo'
}

export interface ProcedureFormData {
  dente_numero: number
  procedimento: string
  observacoes: string
  data_procedimento: string
}

export interface AppointmentFormData {
  paciente_id: string
  data_consulta: string
  hora_consulta: string
  observacoes: string
}

// Tipos para autenticação
export interface LoginFormData {
  email: string
  password: string
  name?: string
  confirmPassword?: string
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, nome: string) => Promise<void>
  signOut: () => Promise<void>
}