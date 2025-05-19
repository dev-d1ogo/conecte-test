"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function AuthErrorBoundary({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Auth error caught:", event.error)
      setError(event.error)
    }

    window.addEventListener("error", handleError)
    return () => window.removeEventListener("error", handleError)
  }, [])

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertDescription>
            Ocorreu um erro na autenticação. Por favor, tente novamente ou entre em contato com o suporte.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return children
}
