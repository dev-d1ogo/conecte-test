"use client"

import { useState } from "react"
import type { User } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useTheme } from "next-themes"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Moon, Sun, Monitor } from "lucide-react"

interface SettingsViewProps {
  user: User | undefined
  isLoading: boolean
  error: string | null
  success: string | null
  onUpdateSettings: (notificationsEnabled: boolean, theme: string) => Promise<boolean>
}

export function SettingsView({ user, isLoading, error, success, onUpdateSettings }: SettingsViewProps) {
  const { theme, setTheme } = useTheme()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [selectedTheme, setSelectedTheme] = useState(theme || "system")

  const handleSaveSettings = async () => {
    const success = await onUpdateSettings(notificationsEnabled, selectedTheme)
    if (success) {
      setTheme(selectedTheme)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-lg">Carregando configurações...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">Personalize sua experiência na plataforma.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Aparência</CardTitle>
            <CardDescription>Personalize a aparência da plataforma.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Tema</Label>
              <RadioGroup value={selectedTheme} onValueChange={setSelectedTheme} className="grid grid-cols-3 gap-4">
                <div>
                  <RadioGroupItem value="light" id="theme-light" className="peer sr-only" aria-label="Light" />
                  <Label
                    htmlFor="theme-light"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Sun className="mb-3 h-6 w-6" />
                    Claro
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="dark" id="theme-dark" className="peer sr-only" aria-label="Dark" />
                  <Label
                    htmlFor="theme-dark"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Moon className="mb-3 h-6 w-6" />
                    Escuro
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="system" id="theme-system" className="peer sr-only" aria-label="System" />
                  <Label
                    htmlFor="theme-system"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Monitor className="mb-3 h-6 w-6" />
                    Sistema
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Configure como deseja receber notificações.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Notificações no navegador</Label>
                <p className="text-sm text-muted-foreground">Receba notificações sobre novos agendamentos.</p>
              </div>
              <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Notificações por e-mail</Label>
                <p className="text-sm text-muted-foreground">Receba e-mails sobre novos agendamentos e lembretes.</p>
              </div>
              <Switch id="email-notifications" defaultChecked />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              {success && <p className="text-sm text-green-600 dark:text-green-400">{success}</p>}
            </div>
            <Button onClick={handleSaveSettings} disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
