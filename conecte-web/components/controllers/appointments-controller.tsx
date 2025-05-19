"use client"

import { useSession } from "next-auth/react"
import { useReducer, useEffect } from "react"
import { AppointmentsView } from "@/components/views/appointments-view"
import { useDashboardWebSocket } from "@/lib/use-dashboard-websocket"
import type { Appointment } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
import { appointmentService } from "@/lib/api-service"

// Definição dos tipos para o estado e ações
type AppointmentsState = {
  appointments: Appointment[]
  isLoading: boolean
  error: string | null
}

type AppointmentsAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Appointment[] }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "ADD_APPOINTMENT"; payload: Appointment }
  | { type: "CANCEL_APPOINTMENT"; payload: string }

// Estado inicial
const initialState: AppointmentsState = {
  appointments: [],
  isLoading: false,
  error: null,
}

// Reducer para gerenciar o estado
function appointmentsReducer(state: AppointmentsState, action: AppointmentsAction): AppointmentsState {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true, error: null }
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        appointments: action.payload,
      }
    case "FETCH_ERROR":
      return { ...state, isLoading: false, error: action.payload }
    case "ADD_APPOINTMENT":
      return {
        ...state,
        appointments: [...state.appointments, action.payload],
      }
    case "CANCEL_APPOINTMENT":
      return {
        ...state,
        appointments: state.appointments.filter((appointment) => appointment.id !== action.payload),
      }
    default:
      return state
  }
}

export function AppointmentsController() {
  const { user, isLoading, logout } = useAuth()

  const [state, dispatch] = useReducer(appointmentsReducer, initialState)

  // Simulação de conexão WebSocket
  useDashboardWebSocket({
    onAppointmentCreated: (appointment) => {
      dispatch({ type: "ADD_APPOINTMENT", payload: appointment })
    },
  })

  // Efeito para carregar dados iniciais
  useEffect(() => {
    const fetchAppointments = async () => {
      dispatch({ type: "FETCH_START" })

      try {
        const response = await appointmentService.getUserAppointments()


        if (response.error) {
          dispatch({ type: "FETCH_ERROR", payload: response.error })
          return
        }


        dispatch({
          type: "FETCH_SUCCESS",
          payload: response.schedulings || [],
        })
      } catch (error) {
        dispatch({
          type: "FETCH_ERROR",
          payload: "Erro ao carregar agendamentos",
        })
      }
    }

    fetchAppointments()
  }, [])

  // Função para cancelar um agendamento
  const cancelAppointment = async (appointmentId: string) => {
    try {
      const response = await appointmentService.cancelAppointment(appointmentId)

      if (response.error) {
        console.error("Erro ao cancelar agendamento:", response.error)
        return false
      }

      dispatch({ type: "CANCEL_APPOINTMENT", payload: appointmentId })
      return true
    } catch (error) {
      console.error("Erro inesperado ao cancelar agendamento:", error)
      return false
    }
  }


  return (
    <AppointmentsView
      user={user}
      appointments={state.appointments}
      isLoading={state.isLoading}
      error={state.error}
      onCancelAppointment={cancelAppointment}
    />
  )
}
