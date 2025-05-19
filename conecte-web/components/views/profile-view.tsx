"use client"

import { useState } from "react"
import type { User } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { UserIcon, Mail, Shield } from "lucide-react"

interface ProfileViewProps {
  user: User | undefined
  isLoading: boolean
  error: string | null
  onUpdateProfile: (name: string) => Promise<boolean>
}

const profileSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfileView({ user, isLoading, error, onUpdateProfile }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
    },
  })

  const onSubmit = async (data: ProfileFormValues) => {
    const success = await onUpdateProfile(data.name)
    if (success) {
      setIsEditing(false)
      setUpdateSuccess(true)
      setTimeout(() => setUpdateSuccess(false), 3000)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-lg">Carregando perfil...</p>
        </div>
      </div>
    )
  }

  const userInitials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "U"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
        <p className="text-muted-foreground">Visualize e edite suas informações pessoais.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Seus dados cadastrados na plataforma.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-xl bg-primary text-primary-foreground">{userInitials}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-medium">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.role === "DOCTOR" ? "Médico" : "Paciente"}</p>
              </div>
            </div>

            {isEditing ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Salvando..." : "Salvar"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <Label>Nome</Label>
                  </div>
                  <p>{user.name}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Label>E-mail</Label>
                  </div>
                  <p>{user.email}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <Label>Tipo de Usuário</Label>
                  </div>
                  <p>{user.role === "DOCTOR" ? "Médico" : "Paciente"}</p>
                </div>
                <Button onClick={() => setIsEditing(true)}>Editar Perfil</Button>
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}
            {updateSuccess && (
              <p className="text-sm text-green-600 dark:text-green-400">Perfil atualizado com sucesso!</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Segurança</CardTitle>
            <CardDescription>Gerencie suas configurações de segurança.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Senha</Label>
              <div className="flex items-center gap-2">
                <Input type="password" value="••••••••" disabled className="bg-muted" />
                <Button variant="outline">Alterar</Button>
              </div>
            </div>
            <div className="space-y-1">
              <Label>Autenticação de Dois Fatores</Label>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Proteja sua conta com 2FA.</p>
                <Button variant="outline" disabled>
                  Configurar
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">Última atualização: {new Date().toLocaleDateString()}</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
