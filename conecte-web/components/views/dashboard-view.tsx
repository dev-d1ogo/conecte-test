"use client"

import { useState } from "react"
import type { User } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, Inbox } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"

interface DashboardViewProps {
  user: User | undefined
  appointments: any[]
  doctors: any[]
  timeSlots: any[]
  isLoading: boolean
  error: string | null
  onCreateAppointment: (slotId: string) => Promise<any>
  onCreateTimeSlot: (dateTime: string) => Promise<any>
}

export function DashboardView({
  user,
  appointments,
  doctors,
  timeSlots,
  isLoading,
  error,
  onCreateAppointment,
  onCreateTimeSlot,
}: DashboardViewProps) {
  const router = useRouter()
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false)
  const [isTimeSlotDialogOpen, setIsTimeSlotDialogOpen] = useState(false)
  const [selectedSlotId, setSelectedSlotId] = useState("")

  const isDoctor = user?.role === "DOCTOR"

  // Form para criar horário
  const timeSlotForm = useForm({
    resolver: zodResolver(
      z.object({
        dateTime: z.string().min(1, "Selecione uma data e hora"),
      }),
    ),
    defaultValues: {
      dateTime: "",
    },
  })

  const handleCreateTimeSlot = async (data: { dateTime: string }) => {
    router.push("/dashboard/slots")
  }

  const handleCreateAppointment = async () => {
    router.push("/dashboard/doctors")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Carregando...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-destructive">
          <p className="text-lg">Erro ao carregar dados: {error}</p>
          <Button className="mt-4" variant="outline">
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground pt-2">
            Bem-vindo, {user?.name}! {isDoctor ? "Gerencie seus horários e consultas." : "Agende suas consultas médicas."}
          </p>
        </div>
        <div className="flex gap-2">
          {isDoctor ? (
            <Button onClick={() => router.push("/dashboard/slots")}>
              <Clock className="mr-2 h-4 w-4" /> Criar Horário
            </Button>
          ) : (
            <Button onClick={() => router.push("/dashboard/doctors")}>
              <Calendar className="mr-2 h-4 w-4" /> Agendar Consulta
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isDoctor ? "Consultas Agendadas" : "Minhas Consultas"}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <span className="text-xs text-muted-foreground/70 bg-muted py-1 rounded-full px-2">
              Disponível em breve
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isDoctor ? "Horários Disponíveis" : "Médicos Disponíveis"}
            </CardTitle>
            {isDoctor ? (
              <Clock className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Users className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <span className="text-xs text-muted-foreground/70 bg-muted py-1 rounded-full px-2">
              Disponível em breve
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isDoctor ? "Taxa de Ocupação" : "Consultas Disponíveis"}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <span className="text-xs text-muted-foreground/70 bg-muted py-1 rounded-full px-2">
              Disponível em breve
            </span>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{isDoctor ? "Minhas Consultas" : "Consultas Agendadas"}</CardTitle>
          </CardHeader>
          <CardContent>

            <div className="mt-4">
              <span className="text-xs text-muted-foreground/70 bg-muted px-2 py-1 rounded-full">
                Disponível em breve
              </span>
            </div>

          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isDoctor ? "Meus Horários Disponíveis" : "Médicos Disponíveis"}</CardTitle>
          </CardHeader>
          <CardContent>

            <div className="mt-4">
              <span className="text-xs text-muted-foreground/70 bg-muted px-2 py-1 rounded-full">
                Disponível em breve
              </span>
            </div>

          </CardContent>
        </Card>
      </div>

      {/* Dialog para criar horário (médicos) */}
      <Dialog open={isTimeSlotDialogOpen} onOpenChange={setIsTimeSlotDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Horário</DialogTitle>
          </DialogHeader>
          <Form {...timeSlotForm}>
            <form onSubmit={timeSlotForm.handleSubmit(handleCreateTimeSlot)} className="space-y-4">
              <FormField
                control={timeSlotForm.control}
                name="dateTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data e Hora</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsTimeSlotDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Criar Horário</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog para agendar consulta (pacientes) */}
      <Dialog open={isAppointmentDialogOpen} onOpenChange={setIsAppointmentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agendar Consulta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Selecione um horário disponível</label>
              <Select onValueChange={setSelectedSlotId} value={selectedSlotId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um horário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="placeholder">Nenhum horário disponível</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAppointmentDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateAppointment}>Agendar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
