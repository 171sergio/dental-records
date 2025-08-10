import { useState, useEffect } from 'react'
import { googleCalendarService, appointmentToCalendarEvent } from '../services/googleCalendar'
import { Appointment, Patient } from '../types'

interface UseGoogleCalendarReturn {
  isInitialized: boolean
  isLoading: boolean
  error: string | null
  createCalendarEvent: (appointment: Appointment, patient: Patient) => Promise<string | null>
  updateCalendarEvent: (eventId: string, appointment: Appointment, patient: Patient) => Promise<boolean>
  deleteCalendarEvent: (eventId: string) => Promise<boolean>
  syncAppointment: (appointment: Appointment, patient: Patient) => Promise<string | null>
  initializeService: () => Promise<boolean>
}

export const useGoogleCalendar = (): UseGoogleCalendarReturn => {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    initializeService()
  }, [])

  const initializeService = async (): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const initialized = await googleCalendarService.initialize()
      setIsInitialized(initialized)
      
      if (!initialized) {
        setError('Google Calendar não pôde ser inicializado. Verifique as credenciais.')
      }
      
      return initialized
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      setIsInitialized(false)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const createCalendarEvent = async (
    appointment: Appointment,
    patient: Patient
  ): Promise<string | null> => {
    if (!isInitialized) {
      setError('Google Calendar não está inicializado')
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const calendarEvent = appointmentToCalendarEvent(appointment, patient)
      const eventId = await googleCalendarService.createEvent(calendarEvent)
      
      if (!eventId) {
        setError('Falha ao criar evento no Google Calendar')
      }
      
      return eventId
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar evento'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const updateCalendarEvent = async (
    eventId: string,
    appointment: Appointment,
    patient: Patient
  ): Promise<boolean> => {
    if (!isInitialized) {
      setError('Google Calendar não está inicializado')
      return false
    }

    setIsLoading(true)
    setError(null)

    try {
      const calendarEvent = appointmentToCalendarEvent(appointment, patient)
      const success = await googleCalendarService.updateEvent(eventId, calendarEvent)
      
      if (!success) {
        setError('Falha ao atualizar evento no Google Calendar')
      }
      
      return success
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar evento'
      setError(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const deleteCalendarEvent = async (eventId: string): Promise<boolean> => {
    if (!isInitialized) {
      setError('Google Calendar não está inicializado')
      return false
    }

    setIsLoading(true)
    setError(null)

    try {
      const success = await googleCalendarService.deleteEvent(eventId)
      
      if (!success) {
        setError('Falha ao deletar evento no Google Calendar')
      }
      
      return success
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar evento'
      setError(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const syncAppointment = async (
    appointment: Appointment,
    patient: Patient
  ): Promise<string | null> => {
    // Esta função cria um evento no Google Calendar e retorna o ID do evento
    // para ser salvo junto com o agendamento no banco de dados
    return await createCalendarEvent(appointment, patient)
  }

  return {
    isInitialized,
    isLoading,
    error,
    createCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
    syncAppointment,
    initializeService
  }
}

export default useGoogleCalendar