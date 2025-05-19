"use client"

import { useReducer, useEffect } from "react"
import { useSession } from "next-auth/react"
import { SlotsView } from "@/components/views/slots-view"
import type { TimeSlot } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
import { doctorService, timeSlotService } from "@/lib/api-service"
import { fetchData } from "next-auth/client/_utils"



// Tipos
type SlotsState = {
  timeSlots: TimeSlot[]
  isLoading: boolean
  error: string | null
  modalError: string | null
}

type SlotsAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: TimeSlot[] }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "FETCH_ERROR_MODAL"; payload: string | null }
  | { type: "ADD_SLOT"; payload: TimeSlot }
  | { type: "DELETE_SLOT"; payload: string }

const initialState: SlotsState = {
  timeSlots: [],
  isLoading: false,
  error: null,
  modalError: null
}

function slotsReducer(state: SlotsState, action: SlotsAction): SlotsState {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true, error: null }
    case "FETCH_SUCCESS":
      return { ...state, isLoading: false, timeSlots: action.payload }
    case "FETCH_ERROR":
      return { ...state, isLoading: false, error: action.payload }
    case "FETCH_ERROR_MODAL":
      return { ...state, modalError: action.payload }
    case "ADD_SLOT":
      return { ...state, timeSlots: [...state.timeSlots, action.payload] }
    case "DELETE_SLOT":
      return { ...state, timeSlots: state.timeSlots.filter(slot => slot.id !== action.payload) }
    default:
      return state
  }
}

export function SlotsController() {
  const { user } = useAuth()
  const [state, dispatch] = useReducer(slotsReducer, initialState)


  const fetchTimeSlots = async () => {
    if (!user?.id) return

    dispatch({ type: "FETCH_START" })
    const response = await doctorService.getDoctorTimeSlots(user.id)

    if (response.error) {
      dispatch({ type: "FETCH_ERROR", payload: response.error })
    } else {
      dispatch({ type: "FETCH_SUCCESS", payload: response.slots })
    }
  }

  // Carregar horários
  useEffect(() => {
    fetchTimeSlots()
  }, [user?.id])

  const cancelCreation = () => {
    dispatch({ type: "FETCH_ERROR_MODAL", payload: null })
  }

  // Criar horário
  const createTimeSlot = async (dateTime: string) => {
    if (!user?.id) return false

    const response = await doctorService.createDoctorTimeSlot(user.id, dateTime)

    console.log(response)

    if (response.error || !response.data) {
      console.log(response)

      dispatch({ type: "FETCH_ERROR_MODAL", payload: response.error as string })
      return false
    }

    fetchTimeSlots()
    return true
  }

  // Excluir horário
  // Excluir horário
  const deleteTimeSlot = async (slotId: string) => {
    const response = await doctorService.deleteDoctorTimeSlot(slotId)

    if (response.error) {
      dispatch({ type: "FETCH_ERROR_MODAL", payload: response.error })
      console.error("Erro ao excluir horário:", response.error)
      return false
    }

    dispatch({ type: "DELETE_SLOT", payload: slotId })
    return true
  }


  return (
    <SlotsView
      user={user}
      timeSlots={state.timeSlots}
      isLoading={state.isLoading}
      error={state.error}
      onCreateTimeSlot={createTimeSlot}
      onDeleteTimeSlot={deleteTimeSlot}
      onCancelCreation={cancelCreation}
      modalError={state.modalError}
    />
  )
}

