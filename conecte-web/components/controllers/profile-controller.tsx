"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { ProfileView } from "@/components/views/profile-view"
import { useAuth } from "@/lib/auth-context"

export function ProfileController() {
  const { user, isLoading: isLoadingAuth, logout } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Função para atualizar perfil
  const updateProfile = async (name: string) => {
    setIsLoading(true)
    setError(null)
    try {
      // Aqui seria a chamada real para a API
      // PUT /users/{id} ou similar

      // Simulando um delay de rede
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulação de sucesso
      return true
    } catch (error) {
      setError("Erro ao atualizar perfil")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return <ProfileView user={user} isLoading={isLoading} error={error} onUpdateProfile={updateProfile} />
}
