"use client"

import { useState } from "react"
import type { User, TimeSlot } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Plus, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Loading from "@/app/auth/error/loading"

interface SlotsViewProps {
  user: User | undefined
  timeSlots: TimeSlot[]
  isLoading: boolean
  error: string | null
  modalError: string | null
  onCreateTimeSlot: (dateTime: string) => Promise<boolean>
  onCancelCreation: () => void
  onDeleteTimeSlot: (slotId: string) => Promise<boolean>
}

export function SlotsView({ user, timeSlots, isLoading, error, onCreateTimeSlot, onDeleteTimeSlot, modalError, onCancelCreation }: SlotsViewProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filtra os horários por status (reservados/disponíveis)
  const bookedSlots = timeSlots.filter((slot) => slot.isBooked)
  const availableSlots = timeSlots.filter((slot) => !slot.isBooked)

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
    setIsSubmitting(true)
    try {
      const success = await onCreateTimeSlot(data.dateTime)
      if (success) {
        setIsCreateDialogOpen(false)
        timeSlotForm.reset()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteTimeSlot = async () => {
    if (!selectedSlotId) return

    setIsSubmitting(true)
    try {
      const success = await onDeleteTimeSlot(selectedSlotId)
      if (success) {
        setIsDeleteDialogOpen(false)
        setSelectedSlotId(null)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Carregando horários...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-destructive">
          <p className="text-lg">Erro ao carregar horários: {error}</p>
          <Button className="mt-4" variant="outline">
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  // Verifica se o usuário é médico
  if (user?.role !== "DOCTOR") {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus Horários</h1>
          <p className="text-muted-foreground">Gerencie seus horários disponíveis para consultas.</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Horário
        </Button>
      </div>

      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="available">Disponíveis ({availableSlots.length})</TabsTrigger>
          <TabsTrigger value="booked">Reservados ({bookedSlots.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="available" className="mt-4">
          {availableSlots.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availableSlots.map((slot) => (
                <Card key={slot.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">Horário Disponível</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(slot.dateTime).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm mt-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(slot.dateTime).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setSelectedSlotId(slot.id)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Remover
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Nenhum horário disponível</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Você não possui horários disponíveis para agendamento.
              </p>
              <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Criar Horário
              </Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="booked" className="mt-4">
          {bookedSlots.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bookedSlots.map((slot) => (
                <Card key={slot.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">Horário Reservado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(slot.dateTime).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm mt-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(slot.dateTime).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="mt-2 bg-primary/20 text-primary text-xs px-2 py-1 rounded inline-block">
                      Agendado
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Nenhum horário reservado</h3>
              <p className="mt-2 text-sm text-muted-foreground">Você não possui horários reservados por pacientes.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog para criar horário */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Criar Novo Horário</DialogTitle>
            <DialogDescription>Adicione um novo horário disponível para consultas.</DialogDescription>
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

              <p className="text-red-600">{modalError}</p>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false)
                    onCancelCreation()
                  }}

                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Criando..." : "Criar Horário"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog para confirmar exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remover Horário</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover este horário? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => {

              setIsDeleteDialogOpen(false)
            }} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteTimeSlot} disabled={isSubmitting}>
              {isSubmitting ? "Removendo..." : "Remover Horário"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
