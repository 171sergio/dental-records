import { google } from 'googleapis'

// Configuração do Google Calendar API
const SCOPES = ['https://www.googleapis.com/auth/calendar']
const CREDENTIALS_PATH = 'credentials.json'
const TOKEN_PATH = 'token.json'

interface CalendarEvent {
  id?: string
  summary: string
  description?: string
  start: {
    dateTime: string
    timeZone: string
  }
  end: {
    dateTime: string
    timeZone: string
  }
  attendees?: Array<{
    email: string
    displayName?: string
  }>
}

class GoogleCalendarService {
  private auth: any = null
  private calendar: any = null

  async initialize() {
    try {
      // Para desenvolvimento, usaremos uma configuração simplificada
      // Em produção, você deve configurar OAuth2 adequadamente
      const credentials = {
        client_id: process.env.VITE_GOOGLE_CLIENT_ID,
        client_secret: process.env.VITE_GOOGLE_CLIENT_SECRET,
        redirect_uris: ['http://localhost:5174']
      }

      if (!credentials.client_id || !credentials.client_secret) {
        console.warn('Credenciais do Google Calendar não configuradas')
        return false
      }

      const { client_secret, client_id, redirect_uris } = credentials
      const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])

      this.auth = oAuth2Client
      this.calendar = google.calendar({ version: 'v3', auth: oAuth2Client })
      
      return true
    } catch (error) {
      console.error('Erro ao inicializar Google Calendar:', error)
      return false
    }
  }

  async createEvent(event: CalendarEvent): Promise<string | null> {
    try {
      if (!this.calendar) {
        console.warn('Google Calendar não inicializado')
        return null
      }

      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        resource: event
      })

      return response.data.id
    } catch (error) {
      console.error('Erro ao criar evento no Google Calendar:', error)
      return null
    }
  }

  async updateEvent(eventId: string, event: Partial<CalendarEvent>): Promise<boolean> {
    try {
      if (!this.calendar) {
        console.warn('Google Calendar não inicializado')
        return false
      }

      await this.calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        resource: event
      })

      return true
    } catch (error) {
      console.error('Erro ao atualizar evento no Google Calendar:', error)
      return false
    }
  }

  async deleteEvent(eventId: string): Promise<boolean> {
    try {
      if (!this.calendar) {
        console.warn('Google Calendar não inicializado')
        return false
      }

      await this.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId
      })

      return true
    } catch (error) {
      console.error('Erro ao deletar evento no Google Calendar:', error)
      return false
    }
  }

  async listEvents(timeMin?: string, timeMax?: string): Promise<CalendarEvent[]> {
    try {
      if (!this.calendar) {
        console.warn('Google Calendar não inicializado')
        return []
      }

      const response = await this.calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin || new Date().toISOString(),
        timeMax: timeMax,
        maxResults: 50,
        singleEvents: true,
        orderBy: 'startTime'
      })

      return response.data.items || []
    } catch (error) {
      console.error('Erro ao listar eventos do Google Calendar:', error)
      return []
    }
  }

  // Método para autenticação (simplificado para desenvolvimento)
  getAuthUrl(): string {
    if (!this.auth) {
      return ''
    }

    return this.auth.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    })
  }

  async setCredentials(code: string): Promise<boolean> {
    try {
      if (!this.auth) {
        return false
      }

      const { tokens } = await this.auth.getToken(code)
      this.auth.setCredentials(tokens)
      
      return true
    } catch (error) {
      console.error('Erro ao definir credenciais:', error)
      return false
    }
  }
}

// Instância singleton
export const googleCalendarService = new GoogleCalendarService()

// Função utilitária para converter agendamento para evento do Google Calendar
export const appointmentToCalendarEvent = (
  appointment: any,
  patient: any
): CalendarEvent => {
  const startDateTime = new Date(`${appointment.data_consulta}T${appointment.hora_consulta}`)
  const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000) // 1 hora de duração

  return {
    summary: `Consulta - ${patient.nome_completo}`,
    description: `Consulta odontológica\nPaciente: ${patient.nome_completo}\nObservações: ${appointment.observacoes || 'Nenhuma'}`,
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: 'America/Sao_Paulo'
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: 'America/Sao_Paulo'
    },
    attendees: patient.email ? [{
      email: patient.email,
      displayName: patient.nome_completo
    }] : []
  }
}

export default googleCalendarService