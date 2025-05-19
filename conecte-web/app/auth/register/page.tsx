'use client'

import { Suspense } from "react"
import { AuthForm } from "@/components/views/auth-form"

export default function RegisterPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Crie sua conta</h1>
          <p className="text-sm text-muted-foreground">
            Preencha os dados abaixo para se cadastrar
          </p>
        </div>
        <Suspense fallback={<div>Carregando formulário...</div>}>
          <AuthForm mode="register" />
        </Suspense>
      </div>
    </div>
  )
}
