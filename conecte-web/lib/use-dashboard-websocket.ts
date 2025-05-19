// src/lib/use-dashboard-websocket.ts
"use client"

import { useEffect } from "react"
import { io, Socket } from "socket.io-client"
import type { Appointment } from "./types"

interface WebSocketOptions {
  onAppointmentCreated: (appointment: Appointment) => void
}

let socket: Socket | null = null

export function useDashboardWebSocket({ onAppointmentCreated }: WebSocketOptions) {
  useEffect(() => {
    // Conectar ao WebSocket do backend
    socket = io("http://localhost:3000") // ajuste se necessário

    socket.on("connect", () => {
      console.log("✅ WebSocket conectado:", socket?.id)
    })

    socket.on("disconnect", () => {
      console.log("❌ WebSocket desconectado")
    })

    // Ouve o evento de agendamento criado
    socket.on("scheduling:created", (appointment: Appointment) => {
      console.log("🆕 Novo agendamento via socket:", appointment)
      onAppointmentCreated(appointment)
    })

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [onAppointmentCreated])
}
