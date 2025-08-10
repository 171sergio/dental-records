import { useForm, UseFormReturn } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// Schema de validação para pacientes
export const patientSchema = yup.object({
  name: yup
    .string()
    .required('Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: yup
    .string()
    .email('Email deve ter um formato válido')
    .required('Email é obrigatório'),
  phone: yup
    .string()
    .required('Telefone é obrigatório')
    .matches(/^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/, 'Telefone deve ter um formato válido'),
  cpf: yup
    .string()
    .required('CPF é obrigatório')
    .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve ter o formato XXX.XXX.XXX-XX'),
  birthDate: yup
    .string()
    .required('Data de nascimento é obrigatória')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Data deve ter o formato YYYY-MM-DD'),
  address: yup
    .string()
    .required('Endereço é obrigatório')
    .min(10, 'Endereço deve ter pelo menos 10 caracteres'),
  emergencyContact: yup
    .string()
    .required('Contato de emergência é obrigatório')
    .min(2, 'Contato de emergência deve ter pelo menos 2 caracteres'),
  emergencyPhone: yup
    .string()
    .required('Telefone de emergência é obrigatório')
    .matches(/^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/, 'Telefone deve ter um formato válido'),
  medicalHistory: yup
    .string()
    .max(1000, 'Histórico médico deve ter no máximo 1000 caracteres'),
  allergies: yup
    .string()
    .max(500, 'Alergias devem ter no máximo 500 caracteres'),
  medications: yup
    .string()
    .max(500, 'Medicamentos devem ter no máximo 500 caracteres'),
  status: yup
    .string()
    .oneOf(['ativo', 'em_tratamento', 'pendente', 'alta', 'inativo'], 'Status inválido')
    .default('ativo')
})

// Schema de validação para agendamentos
export const appointmentSchema = yup.object({
  patientId: yup
    .string()
    .required('Paciente é obrigatório'),
  date: yup
    .string()
    .required('Data é obrigatória')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Data deve ter o formato YYYY-MM-DD'),
  time: yup
    .string()
    .required('Horário é obrigatório')
    .matches(/^\d{2}:\d{2}$/, 'Horário deve ter o formato HH:MM'),
  type: yup
    .string()
    .required('Tipo de consulta é obrigatório')
    .oneOf(['consulta', 'limpeza', 'procedimento', 'emergencia'], 'Tipo de consulta inválido'),
  observations: yup
    .string()
    .max(500, 'Observações devem ter no máximo 500 caracteres')
})

// Schema de validação para procedimentos
export const procedureSchema = yup.object({
  patientId: yup
    .string()
    .required('Paciente é obrigatório'),
  type: yup
    .string()
    .required('Tipo de procedimento é obrigatório')
    .min(2, 'Tipo deve ter pelo menos 2 caracteres'),
  description: yup
    .string()
    .required('Descrição é obrigatória')
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres'),
  date: yup
    .string()
    .required('Data é obrigatória')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Data deve ter o formato YYYY-MM-DD'),
  cost: yup
    .number()
    .required('Custo é obrigatório')
    .min(0, 'Custo deve ser maior ou igual a zero')
    .max(10000, 'Custo deve ser menor que R$ 10.000'),
  notes: yup
    .string()
    .max(500, 'Notas devem ter no máximo 500 caracteres')
})

// Schema de validação para documentos
export const documentSchema = yup.object({
  patientId: yup
    .string()
    .required('Paciente é obrigatório'),
  type: yup
    .string()
    .required('Tipo de documento é obrigatório')
    .oneOf(['raio-x', 'foto', 'exame', 'receita', 'atestado', 'outros'], 'Tipo de documento inválido'),
  description: yup
    .string()
    .required('Descrição é obrigatória')
    .min(5, 'Descrição deve ter pelo menos 5 caracteres')
    .max(200, 'Descrição deve ter no máximo 200 caracteres'),
  date: yup
    .string()
    .required('Data é obrigatória')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Data deve ter o formato YYYY-MM-DD')
})

// Hook personalizado para formulários com validação
export function useFormValidation<T extends Record<string, any>>(
  schema: yup.ObjectSchema<T>,
  defaultValues?: Partial<T>
): UseFormReturn<T> {
  return useForm<T>({
    resolver: yupResolver(schema),
    defaultValues: defaultValues as any,
    mode: 'onChange'
  })
}

// Tipos para os formulários
export type PatientFormData = yup.InferType<typeof patientSchema>
export type AppointmentFormData = yup.InferType<typeof appointmentSchema>
export type ProcedureFormData = yup.InferType<typeof procedureSchema>
export type DocumentFormData = yup.InferType<typeof documentSchema>