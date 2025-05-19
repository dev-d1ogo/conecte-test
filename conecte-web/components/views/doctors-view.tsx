"use client"

import { useState } from "react"
import type { User, Doctor, TimeSlot } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Search, UserIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DoctorsViewProps {
  user: User | undefined
  doctors: Doctor[]
  timeSlots: TimeSlot[]
  selectedDoctorId: string | null
  isLoading: boolean
  error: string | null
  onSelectDoctor: (doctorId: string) => void
  onBookAppointment: (slotId: string) => Promise<boolean>
}

export function DoctorsView({
  user,
  doctors,
  timeSlots,
  selectedDoctorId,
  isLoading,
  error,
  onSelectDoctor,
  onBookAppointment,
}: DoctorsViewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
  const [isBooking, setIsBooking] = useState(false)

  const isDoctor = user?.role === "DOCTOR"

  // Filtra médicos com base na pesquisa
  const filteredDoctors = doctors.filter((doctor) => doctor.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Filtra horários disponíveis para o médico selecionado
  const availableSlots = timeSlots.filter((slot) => slot.doctorId === selectedDoctorId && !slot.isBooked)

  const handleBookAppointment = async () => {
    if (!selectedSlot) return

    setIsBooking(true)
    try {
      const success = await onBookAppointment(selectedSlot.id)
      if (success) {
        setIsBookingDialogOpen(false)
        setSelectedSlot(null)
      }
    } finally {
      setIsBooking(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Carregando médicos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-destructive">
          <p className="text-lg">Erro ao carregar médicos: {error}</p>
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
        <h1 className="text-3xl font-bold tracking-tight">Médicos</h1>
        <p className="text-muted-foreground">
          {isDoctor
            ? "Visualize outros médicos disponíveis na plataforma."
            : "Encontre médicos disponíveis e agende sua consulta."}
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar médicos por nome..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {selectedDoctorId ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              Horários Disponíveis - {doctors.find((d) => d.id === selectedDoctorId)?.name}
            </h2>
            <Button variant="outline" onClick={() => onSelectDoctor("")}>
              Voltar para Lista de Médicos
            </Button>
          </div>

          {availableSlots.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availableSlots.map((slot) => (
                <Card key={slot.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Horário Disponível</CardTitle>
                    <CardDescription>{formatDate(slot.dateTime)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(slot.dateTime).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(slot.dateTime).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {!isDoctor && (
                      <Button
                        className="w-full"
                        onClick={() => {
                          setSelectedSlot(slot)
                          setIsBookingDialogOpen(true)
                        }}
                      >
                        Agendar Consulta
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Nenhum horário disponível</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Este médico não possui horários disponíveis no momento.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{doctor.name}</CardTitle>
                  <CardDescription>Médico</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{doctor.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {timeSlots.filter((slot) => slot.doctorId === doctor.id && !slot.isBooked).length} horários
                      disponíveis
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={isDoctor ? "outline" : "default"}
                    onClick={() => onSelectDoctor(doctor.id)}
                  >
                    {isDoctor ? "Ver Horários" : "Agendar Consulta"}
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12 border rounded-lg bg-muted/20">
              <Search className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Nenhum médico encontrado</h3>
              <p className="mt-2 text-sm text-muted-foreground">Não encontramos médicos com o termo "{searchTerm}".</p>
            </div>
          )}
        </div>
      )}

      {/* Dialog de confirmação de agendamento */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Agendamento</DialogTitle>
            <DialogDescription>
              Você está prestes a agendar uma consulta com {doctors.find((d) => d.id === selectedDoctorId)?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedSlot && (
              <>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Data e Hora</h4>
                  <p className="text-base">{formatDate(selectedSlot.dateTime)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Médico</h4>
                  <p className="text-base">{doctors.find((d) => d.id === selectedSlot.doctorId)?.name}</p>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)} disabled={isBooking}>
              Cancelar
            </Button>
            <Button onClick={handleBookAppointment} disabled={isBooking}>
              {isBooking ? "Agendando..." : "Confirmar Agendamento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
