import { Patient, Procedure, Document, Appointment } from '../types'

// Mock data para pacientes
export const mockPatients: Patient[] = [
  {
    id: '1',
    nome_completo: 'João Silva Santos',
    cpf: '12345678901',
    email: 'joao.silva@email.com',
    telefone: '11987654321',
    endereco: 'Rua das Flores, 123 - São Paulo, SP',
    data_nascimento: '1985-03-15',
    status: 'em_tratamento',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    nome_completo: 'Maria Oliveira Costa',
    cpf: '98765432109',
    email: 'maria.oliveira@email.com',
    telefone: '11876543210',
    endereco: 'Av. Paulista, 456 - São Paulo, SP',
    data_nascimento: '1990-07-22',
    status: 'em_tratamento',
    created_at: '2024-01-16T14:30:00Z',
    updated_at: '2024-01-16T14:30:00Z'
  },
  {
    id: '3',
    nome_completo: 'Pedro Henrique Lima',
    cpf: '45678912345',
    email: 'pedro.lima@email.com',
    telefone: '11765432109',
    endereco: 'Rua Augusta, 789 - São Paulo, SP',
    data_nascimento: '1978-12-03',
    status: 'pendente',
    created_at: '2024-01-17T09:15:00Z',
    updated_at: '2024-01-17T09:15:00Z'
  }
]

// Mock data para procedimentos
export const mockProcedures: Procedure[] = [
  {
    id: '1',
    paciente_id: '1',
    dente_numero: 11,
    procedimento: 'Restauração',
    data_procedimento: '2024-01-20',
    observacoes: 'Restauração em resina composta',
    created_at: '2024-01-20T10:00:00Z'
  },
  {
    id: '2',
    paciente_id: '1',
    dente_numero: 21,
    procedimento: 'Limpeza',
    data_procedimento: '2024-01-15',
    observacoes: 'Profilaxia e aplicação de flúor',
    created_at: '2024-01-15T14:00:00Z'
  },
  {
    id: '3',
    paciente_id: '2',
    dente_numero: 16,
    procedimento: 'Extração',
    data_procedimento: '2024-01-18',
    observacoes: 'Extração simples - dente com cárie extensa',
    created_at: '2024-01-18T11:30:00Z'
  }
]

// Mock data para agendamentos
export const mockAppointments: Appointment[] = [
  {
    id: '1',
    paciente_id: '1',
    data_consulta: '2024-01-25',
    hora_consulta: '09:00',
    observacoes: 'Consulta de rotina',
    status: 'agendada',
    created_at: '2024-01-20T10:00:00Z'
  },
  {
    id: '2',
    paciente_id: '2',
    data_consulta: '2024-01-25',
    hora_consulta: '14:30',
    observacoes: 'Avaliação pós-extração',
    status: 'agendada',
    created_at: '2024-01-20T11:00:00Z'
  },
  {
    id: '3',
    paciente_id: '3',
    data_consulta: '2024-01-24',
    hora_consulta: '16:00',
    observacoes: 'Primeira consulta',
    status: 'concluida',
    created_at: '2024-01-19T15:00:00Z'
  }
]

// Mock data para documentos
export const mockDocuments: Document[] = [
  {
    id: '1',
    paciente_id: '1',
    nome_arquivo: 'radiografia_panoramica.jpg',
    tipo_arquivo: 'image/jpeg',
    tipo_documento: 'Radiografia',
    descricao: 'Radiografia Panorâmica',
    url_arquivo: '#',
    tamanho_arquivo: 1024000,
    data_upload: '2024-01-15',
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    paciente_id: '1',
    nome_arquivo: 'termo_consentimento.pdf',
    tipo_arquivo: 'application/pdf',
    tipo_documento: 'Documento',
    descricao: 'Termo de Consentimento',
    url_arquivo: '#',
    tamanho_arquivo: 512000,
    data_upload: '2024-01-15',
    created_at: '2024-01-15T10:05:00Z'
  },
  {
    id: '3',
    paciente_id: '2',
    nome_arquivo: 'exame_clinico.pdf',
    tipo_arquivo: 'application/pdf',
    tipo_documento: 'Exame',
    descricao: 'Exame Clínico',
    url_arquivo: '#',
    tamanho_arquivo: 256000,
    data_upload: '2024-01-16',
    created_at: '2024-01-16T15:00:00Z'
  }
]

// Funções para simular operações do Supabase
export const mockSupabaseOperations = {
  // Buscar todos os pacientes
  getPatients: async (): Promise<{ data: Patient[], error: null }> => {
    await new Promise(resolve => setTimeout(resolve, 500)) // Simula delay da rede
    return { data: mockPatients, error: null }
  },

  // Buscar paciente por ID
  getPatientById: async (id: string): Promise<{ data: Patient | null, error: null }> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const patient = mockPatients.find(p => p.id === id) || null
    return { data: patient, error: null }
  },

  // Buscar procedimentos por paciente
  getProceduresByPatient: async (patientId: string): Promise<{ data: Procedure[], error: null }> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const procedures = mockProcedures.filter(p => p.paciente_id === patientId)
    return { data: procedures, error: null }
  },

  // Buscar documentos por paciente
  getDocumentsByPatient: async (patientId: string): Promise<{ data: Document[], error: null }> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const documents = mockDocuments.filter(d => d.paciente_id === patientId)
    return { data: documents, error: null }
  },

  // Criar novo paciente
  createPatient: async (patientData: Omit<Patient, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Patient, error: null }> => {
    await new Promise(resolve => setTimeout(resolve, 800))
    const newPatient: Patient = {
      ...patientData,
      id: (mockPatients.length + 1).toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    mockPatients.push(newPatient)
    return { data: newPatient, error: null }
  },

  // Atualizar paciente
  updatePatient: async (id: string, updates: Partial<Patient>): Promise<{ data: Patient, error: null }> => {
    await new Promise(resolve => setTimeout(resolve, 600))
    const patientIndex = mockPatients.findIndex(p => p.id === id)
    if (patientIndex !== -1) {
      mockPatients[patientIndex] = { ...mockPatients[patientIndex], ...updates }
      return { data: mockPatients[patientIndex], error: null }
    }
    throw new Error('Paciente não encontrado')
  },

  // Criar novo procedimento
  createProcedure: async (procedureData: Omit<Procedure, 'id' | 'created_at'>): Promise<{ data: Procedure, error: null }> => {
    await new Promise(resolve => setTimeout(resolve, 600))
    const newProcedure: Procedure = {
      ...procedureData,
      id: (mockProcedures.length + 1).toString(),
      created_at: new Date().toISOString()
    }
    mockProcedures.push(newProcedure)
    return { data: newProcedure, error: null }
  },

  // Criar novo documento
  createDocument: async (documentData: Omit<Document, 'id' | 'created_at'>): Promise<{ data: Document, error: null }> => {
    await new Promise(resolve => setTimeout(resolve, 600))
    const newDocument: Document = {
      ...documentData,
      id: (mockDocuments.length + 1).toString(),
      created_at: new Date().toISOString()
    }
    mockDocuments.push(newDocument)
    return { data: newDocument, error: null }
  },

  // Buscar todos os agendamentos
  getAppointments: async (): Promise<{ data: Appointment[], error: null }> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return { data: mockAppointments, error: null }
  },

  // Criar novo agendamento
  createAppointment: async (appointmentData: Omit<Appointment, 'id' | 'created_at'>): Promise<{ data: Appointment, error: null }> => {
    await new Promise(resolve => setTimeout(resolve, 600))
    const newAppointment: Appointment = {
      ...appointmentData,
      id: (mockAppointments.length + 1).toString(),
      created_at: new Date().toISOString()
    }
    mockAppointments.push(newAppointment)
    return { data: newAppointment, error: null }
  },

  // Atualizar agendamento
  updateAppointment: async (id: string, updates: Partial<Appointment>): Promise<{ data: Appointment, error: null }> => {
    await new Promise(resolve => setTimeout(resolve, 600))
    const appointmentIndex = mockAppointments.findIndex(a => a.id === id)
    if (appointmentIndex !== -1) {
      mockAppointments[appointmentIndex] = { ...mockAppointments[appointmentIndex], ...updates }
      return { data: mockAppointments[appointmentIndex], error: null }
    }
    throw new Error('Agendamento não encontrado')
  }
}