import { Appointment, Doctor, TimeSlot, UserRole } from "@/lib/types"
import { decodeJwt } from "jose"
import { User } from "next-auth"


const API_BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000"
// Tipos de resposta da API
interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
}

// Função genérica para fazer requisições à API
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`

    const token = getAccessTokenFromCookie()

    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }

    const defaultOptions: RequestInit = {
      headers: defaultHeaders,
      credentials: "include",
    }

    const response = await fetch(url, { ...defaultOptions, ...options })
    const status = response.status

    let data
    try {
      data = await response.json()
    } catch {
      data = { message: await response.text() }
    }

    if (!response.ok) {
      return { error: data.message || "Ocorreu um erro na requisição", status }
    }

    return { data: data as T, status }
  } catch (error) {
    console.error("API request failed:", error)
    return {
      error: error instanceof Error ? error.message : "Falha na conexão com o servidor",
      status: 0,
    }
  }
}


// Serviço de autenticação
export const authService = {
  // Login
  async login(email: string, password: string) {
    console.log("Caiu aqui")

    const response = await fetchApi<{ user: any; accessToken: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })

    console.log(response)
    if (response.data?.accessToken) {
      // Armazena token no cookie por 1 dia
      document.cookie = `accessToken=${response.data.accessToken}; path=/; max-age=86400`
    }

    return response
  },
  // Registro
  async register(name: string, email: string, password: string, role: string) {
    const response = await fetchApi<{ user: any; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
    })

    console.log(response)
    return { ...response, user: response.data }
  },

  // Logout
  async logout() {
    // Remove cookie
    document.cookie = "accessToken=; path=/; max-age=0"

    return fetchApi("/auth/logout", {
      method: "POST",
    })
  },

  // Verificar sessão atual
  async getSession() {
    // Pega o cookie
    const match = document.cookie.match(/(?:^|; )accessToken=([^;]*)/)
    const token = match ? decodeURIComponent(match[1]) : null

    if (!token) {
      return {
        error: "Usuário não autenticado",
        status: 401,
      }
    }

    try {
      const decoded = decodeJwt(token)

      const { sub: id } = decoded

      if (!id) {
        return {
          error: "Token inválido",
          status: 400,
        }
      }
      const user = {
        id: id,
        email: decoded.email as string,
        role: decoded.role as UserRole,
        name: decoded.name as string
      }

      return {
        data: { user },
        status: 200,
      }
    } catch (err) {
      console.error("Erro ao decodificar token:", err)
      return {
        error: "Token inválido",
        status: 400,
      }
    }
  }

}

// Serviço de usuários
export const userService = {
  // Obter perfil do usuário
  async getProfile() {
    return fetchApi<{ user: any }>("/users/profile")
  },

  // Atualizar perfil
  async updateProfile(data: any) {
    return fetchApi("/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },
}

// Serviço de médicos
export const doctorService = {
  async getAllDoctors(filters?: { nome?: string; order?: "asc" | "desc" }) {
    const query = new URLSearchParams()
    if (filters?.nome) query.append("nome", filters.nome)
    if (filters?.order) query.append("order", filters.order)

    const response = await fetchApi<{ doctors: any[] }>(`/medicos?${query.toString()}`)
    return { ...response, doctors: response.data as unknown as Doctor[] }
  },

  // DELETE /medicos/horarios/:id
  async deleteDoctorTimeSlot(slotId: string) {
    return fetchApi<{ message: string }>(`/medicos/horarios/${slotId}`, {
      method: "DELETE",
    })
  },

  async getDoctorTimeSlots(id: string) {

    const response = await fetchApi<{ timeSlots: any[] }>(`/medicos/${id}/horarios`)

    return { ...response, slots: response.data as unknown as TimeSlot[] }
  },

  async createDoctorTimeSlot(id: string, dateTime: string) {
    const response = await fetchApi(`/medicos/${id}/horarios`, {
      method: "POST",
      body: JSON.stringify({ dateTime }),
    })

    console.log(response)

    return { ...response, slot: response.data as unknown as TimeSlot }
  },

  async createAppointment(slotId: string) {
    return fetchApi("/agendamentos", {
      method: "POST",
      body: JSON.stringify({ slotId }),
    })
  },

}

function getAccessTokenFromCookie(): string | null {
  const match = document.cookie.match(/(?:^|; )accessToken=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}

// Serviço de agendamentos
export const appointmentService = {
  // Listar agendamentos do usuário
  async getUserAppointments() {
    const response = await fetchApi<{ appointments: any[] }>("/agendamentos")
    return { ...response, schedulings: response.data as unknown as Appointment[] }
  },

  // Criar um novo agendamento
  async createAppointment(slotId: string) {
    return fetchApi<{ appointment: any }>("/agendamentos", {
      method: "POST",
      body: JSON.stringify({ slotId }),
    })
  },

  // Cancelar um agendamento
  async cancelAppointment(id: string) {
    return fetchApi<{ message: string }>(`/agendamentos/${id}`, {
      method: "DELETE",
    })
  }
}

// Serviço de horários (para médicos)
export const timeSlotService = {
  // Listar horários do médico
  async getDoctorTimeSlots() {
    return fetchApi<{ timeSlots: any[] }>("/time-slots")

  },

  // Criar um novo horário
  async createTimeSlot(dateTime: string) {
    return fetchApi<{ timeSlot: any }>("/time-slots", {
      method: "POST",
      body: JSON.stringify({ dateTime }),
    })
  },

  // Excluir um horário
  async deleteTimeSlot(id: string) {
    return fetchApi<{ success: boolean }>(`/time-slots/${id}`, {
      method: "DELETE",
    })
  },
}

export default {
  auth: authService,
  user: userService,
  doctor: doctorService,
  appointment: appointmentService,
  timeSlot: timeSlotService,
}
