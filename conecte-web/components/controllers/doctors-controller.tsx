"use client"

import { useReducer, useEffect } from "react"
import { DoctorsView } from "@/components/views/doctors-view"
import { useAuth } from "@/lib/auth-context"
import { doctorService } from "@/lib/api-service"
import type { Doctor, TimeSlot } from "@/lib/types"

// Tipos do estado
type DoctorsState = {
  doctors: Doctor[]
  timeSlots: TimeSlot[]
  selectedDoctorId: string | null
  isLoading: boolean
  error: string | null
}

type DoctorsAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: { doctors: Doctor[]; timeSlots: TimeSlot[] } }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "SELECT_DOCTOR"; payload: string }
  | { type: "BOOK_SLOT"; payload: string }

// Estado inicial
const initialState: DoctorsState = {
  doctors: [],
  timeSlots: [],
  selectedDoctorId: null,
  isLoading: false,
  error: null,
}

// Reducer
function doctorsReducer(state: DoctorsState, action: DoctorsAction): DoctorsState {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true, error: null }
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        doctors: action.payload.doctors,
        timeSlots: action.payload.timeSlots,
      }
    case "FETCH_ERROR":
      return { ...state, isLoading: false, error: action.payload }
    case "SELECT_DOCTOR":
      return { ...state, selectedDoctorId: action.payload }
    case "BOOK_SLOT":
      return {
        ...state,
        timeSlots: state.timeSlots.map(slot =>
          slot.id === action.payload ? { ...slot, isBooked: true } : slot
        ),
      }
    default:
      return state
  }
}

export function DoctorsController() {
  const { user } = useAuth()
  const [state, dispatch] = useReducer(doctorsReducer, initialState)

  // Carrega todos os médicos e horários
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_START" })

      try {
        // 1. Busca os médicos
        const doctorsRes = await doctorService.getAllDoctors()

        const doctors = doctorsRes.doctors ?? []

        // 2. Para cada médico, busca seus horários
        const slotsResponses = await Promise.all(
          doctors.map(async (doctor) => {
            const slotsRes = await doctorService.getDoctorTimeSlots(doctor.id)

            return slotsRes.slots || []
          })
        )

        // 3. Une todos os horários em um único array
        const timeSlots = slotsResponses.flat()

        dispatch({ type: "FETCH_SUCCESS", payload: { doctors, timeSlots } })
      } catch (error) {
        dispatch({ type: "FETCH_ERROR", payload: "Erro ao carregar médicos e horários" })
      }
    }

    fetchData()
  }, [])


  const selectDoctor = (doctorId: string) => {
    dispatch({ type: "SELECT_DOCTOR", payload: doctorId })
  }

  const bookAppointment = async (slotId: string) => {
    try {
      const res = await doctorService.createAppointment(slotId)

      if (res.status === 201 || res.status === 200) {
        dispatch({ type: "BOOK_SLOT", payload: slotId })
        return true
      }

      return false
    } catch (error) {
      console.error("Erro ao agendar consulta:", error)
      return false
    }
  }

  return (
    <DoctorsView
      user={user}
      doctors={state.doctors}
      timeSlots={state.timeSlots}
      selectedDoctorId={state.selectedDoctorId}
      isLoading={state.isLoading}
      error={state.error}
      onSelectDoctor={selectDoctor}
      onBookAppointment={bookAppointment}
    />
  )
}
