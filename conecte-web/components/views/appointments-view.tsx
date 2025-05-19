"use client"

import { useState } from "react"
import type { User, Appointment } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, UserIcon, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AppointmentsViewProps {
  user: User | undefined
  appointments: Appointment[]
  isLoading: boolean
  error: string | null
  onCancelAppointment: (appointmentId: string) => Promise<boolean>
}

export function AppointmentsView({ user, appointments, isLoading, error, onCancelAppointment }: AppointmentsViewProps) {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  const isDoctor = user?.role === "DOCTOR"

  // Filtra os agendamentos por status (passados/futuros)
  const now = new Date()
  const pastAppointments = appointments.filter((app) => new Date(app.dateTime) < now)
  const upcomingAppointments = appointments.filter((app) => new Date(app.dateTime) >= now)

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return

    setIsCancelling(true)
    try {
      const success = await onCancelAppointment(selectedAppointment.id)
      if (success) {
        setIsCancelDialogOpen(false)
        setSelectedAppointment(null)
      }
    } finally {
      setIsCancelling(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Carregando agendamentos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-destructive">
          <p className="text-lg">Erro ao carregar agendamentos: {error}</p>
          <Button className="mt-4" variant="outline">
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agendamentos</h1>
        <p className="text-muted-foreground">
          {isDoctor
            ? "Gerencie suas consultas agendadas com pacientes."
            : "Visualize e gerencie suas consultas médicas."}
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Próximas Consultas</TabsTrigger>
          <TabsTrigger value="past">Consultas Passadas</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-4">
          {upcomingAppointments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  isDoctor={isDoctor}
                  onViewDetails={() => setSelectedAppointment(appointment)}
                  onCancel={() => {
                    setSelectedAppointment(appointment)
                    setIsCancelDialogOpen(true)
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Nenhuma consulta agendada</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {isDoctor
                  ? "Você não tem consultas agendadas com pacientes."
                  : "Você não tem consultas agendadas com médicos."}
              </p>
              {!isDoctor && (
                <Button className="mt-4" variant="outline">
                  Agendar Consulta
                </Button>
              )}
            </div>
          )}
        </TabsContent>
        <TabsContent value="past" className="mt-4">
          {pastAppointments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  isDoctor={isDoctor}
                  isPast
                  onViewDetails={() => setSelectedAppointment(appointment)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Nenhuma consulta passada</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {isDoctor ? "Você não realizou consultas com pacientes." : "Você não realizou consultas com médicos."}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog de detalhes do agendamento */}
      {selectedAppointment && (
        <Dialog open={!!selectedAppointment && !isCancelDialogOpen} onOpenChange={() => setSelectedAppointment(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Detalhes da Consulta</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Data e Hora</h4>
                  <p className="text-base">{formatDate(selectedAppointment.dateTime)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                  <p className="text-base">{new Date(selectedAppointment.dateTime) < now ? "Realizada" : "Agendada"}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">{isDoctor ? "Paciente" : "Médico"}</h4>
                <p className="text-base">
                  {isDoctor ? selectedAppointment.patient.name : selectedAppointment.doctor.name}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">E-mail para contato</h4>
                <p className="text-base">
                  {isDoctor ? selectedAppointment.patient.email : selectedAppointment.doctor.email}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedAppointment(null)}>
                Fechar
              </Button>
              {new Date(selectedAppointment.dateTime) >= now && !isDoctor && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsCancelDialogOpen(true)
                  }}
                >
                  Cancelar Consulta
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog de confirmação de cancelamento */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancelar Consulta</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar esta consulta? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)} disabled={isCancelling}>
              Voltar
            </Button>
            <Button variant="destructive" onClick={handleCancelAppointment} disabled={isCancelling}>
              {isCancelling ? "Cancelando..." : "Confirmar Cancelamento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface AppointmentCardProps {
  appointment: Appointment
  isDoctor: boolean
  isPast?: boolean
  onViewDetails: () => void
  onCancel?: () => void
}

function AppointmentCard({ appointment, isDoctor, isPast, onViewDetails, onCancel }: AppointmentCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          {isDoctor ? `Paciente: ${appointment.patient.name}` : `Dr(a). ${appointment.doctor.name}`}
        </CardTitle>
        <CardDescription>{formatDate(appointment.dateTime)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>
            {new Date(appointment.dateTime).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm mt-1">
          <UserIcon className="h-4 w-4 text-muted-foreground" />
          <span>{isDoctor ? appointment.patient.name : appointment.doctor.name}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={onViewDetails}>
          Ver Detalhes
        </Button>
        {!isPast && onCancel && (
          <Button variant="ghost" size="sm" className="text-destructive" onClick={onCancel}>
            <X className="h-4 w-4 mr-1" /> Cancelar
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
