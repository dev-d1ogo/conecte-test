"use client"

import { useSession } from "next-auth/react"
import { DashboardView } from "@/components/views/dashboard-view"
import { useReducer, useEffect } from "react"
import { useDashboardWebSocket } from "@/lib/use-dashboard-websocket"
import { useAuth } from "@/lib/auth-context"

// Definição dos tipos para o estado e ações
type DashboardState = {
  appointments: any[]
  doctors: any[]
  timeSlots: any[]
  isLoading: boolean
  error: string | null
}

type DashboardAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: { appointments: any[]; doctors: any[]; timeSlots: any[] } }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "ADD_APPOINTMENT"; payload: any }
  | { type: "ADD_TIME_SLOT"; payload: any }

// Estado inicial
const initialState: DashboardState = {
  appointments: [],
  doctors: [],
  timeSlots: [],
  isLoading: false,
  error: null,
}

// Reducer para gerenciar o estado
function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true, error: null }
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        appointments: action.payload.appointments,
        doctors: action.payload.doctors,
        timeSlots: action.payload.timeSlots,
      }
    case "FETCH_ERROR":
      return { ...state, isLoading: false, error: action.payload }
    case "ADD_APPOINTMENT":
      return {
        ...state,
        appointments: [...state.appointments, action.payload],
      }
    case "ADD_TIME_SLOT":
      return {
        ...state,
        timeSlots: [...state.timeSlots, action.payload],
      }
    default:
      return state
  }
}

export function DashboardController() {
  const { user, isLoading, logout } = useAuth()

  const [state, dispatch] = useReducer(dashboardReducer, initialState)

  // Simulação de conexão WebSocket
  useDashboardWebSocket({
    onAppointmentCreated: (appointment) => {
      dispatch({ type: "ADD_APPOINTMENT", payload: appointment })
    },
  })

  // Efeito para carregar dados iniciais
  useEffect(() => {
    const fetchDashboardData = async () => {
      dispatch({ type: "FETCH_START" })
      try {
        // Aqui seriam as chamadas reais para a API
        // Como estamos simulando, vamos criar dados fictícios

        // Simulação de dados
        const mockAppointments = [
          {
            id: "1",
            slotId: "slot1",
            patientId: "2",
            doctorId: "1",
            dateTime: "2025-05-20T10:00:00Z",
            patient: {
              id: "2",
              name: "Maria Souza",
              email: "paciente@exemplo.com",
              role: "PATIENT",
            },
            doctor: {
              id: "1",
              name: "Dr. João Silva",
              email: "medico@exemplo.com",
              role: "DOCTOR",
            },
          },
        ]

        const mockDoctors = [
          {
            id: "1",
            name: "Dr. João Silva",
            email: "medico@exemplo.com",
            role: "DOCTOR",
          },
          {
            id: "3",
            name: "Dra. Ana Oliveira",
            email: "ana@exemplo.com",
            role: "DOCTOR",
          },
        ]

        const mockTimeSlots = [
          {
            id: "slot1",
            doctorId: "1",
            dateTime: "2025-05-20T10:00:00Z",
            isBooked: true,
          },
          {
            id: "slot2",
            doctorId: "1",
            dateTime: "2025-05-20T11:00:00Z",
            isBooked: false,
          },
          {
            id: "slot3",
            doctorId: "3",
            dateTime: "2025-05-21T14:00:00Z",
            isBooked: false,
          },
        ]

        // Simulando um delay de rede
        await new Promise((resolve) => setTimeout(resolve, 500))

        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            appointments: mockAppointments,
            doctors: mockDoctors,
            timeSlots: mockTimeSlots,
          },
        })
      } catch (error) {
        dispatch({
          type: "FETCH_ERROR",
          payload: "Erro ao carregar dados do dashboard",
        })
      }
    }

    fetchDashboardData()
  }, [])

  // Função para criar um novo agendamento
  const createAppointment = async (slotId: string) => {
    try {
      // Aqui seria a chamada real para a API
      // POST /agendamentos com { slotId }

      // Simulação de resposta
      const selectedSlot = state.timeSlots.find((slot) => slot.id === slotId)
      const doctor = state.doctors.find((doc) => doc.id === selectedSlot?.doctorId)

      const newAppointment = {
        id: `app-${Date.now()}`,
        slotId,
        patientId: user?.id || "2", // Usando ID do usuário logado ou fallback
        doctorId: selectedSlot?.doctorId,
        dateTime: selectedSlot?.dateTime,
        patient: {
          id: user?.id || "2",
          name: user?.email || "Maria Souza",
          email: user?.email || "paciente@exemplo.com",
          role: "PATIENT",
        },
        doctor: doctor,
      }

      // Atualiza o estado
      dispatch({ type: "ADD_APPOINTMENT", payload: newAppointment })

      // Marca o slot como reservado
      const updatedTimeSlots = state.timeSlots.map((slot) => (slot.id === slotId ? { ...slot, isBooked: true } : slot))

      dispatch({
        type: "FETCH_SUCCESS",
        payload: {
          appointments: [...state.appointments, newAppointment],
          doctors: state.doctors,
          timeSlots: updatedTimeSlots,
        },
      })

      return newAppointment
    } catch (error) {
      console.error("Erro ao criar agendamento:", error)
      throw error
    }
  }

  // Função para criar um novo horário disponível (apenas para médicos)
  const createTimeSlot = async (dateTime: string) => {
    try {
      if (user?.role !== "DOCTOR") {
        throw new Error("Apenas médicos podem criar horários")
      }

      // Aqui seria a chamada real para a API
      // POST /medicos/{id}/horarios com { dateTime }

      // Simulação de resposta
      const newSlot = {
        id: `slot-${Date.now()}`,
        doctorId: user.id,
        dateTime,
        isBooked: false,
      }

      dispatch({ type: "ADD_TIME_SLOT", payload: newSlot })

      return newSlot
    } catch (error) {
      console.error("Erro ao criar horário:", error)
      throw error
    }
  }

  return (
    <DashboardView
      user={user}
      appointments={state.appointments}
      doctors={state.doctors}
      timeSlots={state.timeSlots}
      isLoading={state.isLoading}
      error={state.error}
      onCreateAppointment={createAppointment}
      onCreateTimeSlot={createTimeSlot}
    />
  )
}
