"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string>("Ocorreu um erro durante a autenticação")

  useEffect(() => {
    const error = searchParams.get("error")
    console.log("Auth error page loaded with error:", error)

    if (error) {
      switch (error) {
        case "invalid_credentials":
          setErrorMessage("Email ou senha incorretos. Por favor, tente novamente.")
          break
        case "auth_required":
          setErrorMessage("Você precisa estar logado para acessar esta página.")
          break
        case "access_denied":
          setErrorMessage("Acesso negado. Você não tem permissão para acessar esta página.")
          break
        case "server_error":
          setErrorMessage("Erro no servidor. Por favor, tente novamente mais tarde.")
          break
        default:
          setErrorMessage(`Ocorreu um erro durante a autenticação (${error}). Por favor, tente novamente.`)
          break
      }
    }
  }, [searchParams])

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <CardTitle>Erro de Autenticação</CardTitle>
          </div>
          <CardDescription>Não foi possível completar o processo de autenticação</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{errorMessage}</p>
          <p className="text-sm text-muted-foreground">
            Se o problema persistir, entre em contato com o suporte técnico.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/">Voltar para Home</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/login">Tentar Novamente</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
