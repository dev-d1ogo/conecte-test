"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Calendar, Users, Clock, User, Settings } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user, isLoading: isLoadingAuth, logout } = useAuth()

  const isDoctor = user?.role === "DOCTOR"

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Agendamentos",
      icon: Calendar,
      href: "/dashboard/appointments",
      active: pathname === "/dashboard/appointments",
    },
    {
      label: "Médicos",
      icon: Users,
      href: "/dashboard/doctors",
      active: pathname === "/dashboard/doctors",
      show: !isDoctor
      // Mostrar para todos, mas com funcionalidades diferentes
    },
    {
      label: "Horários",
      icon: Clock,
      href: "/dashboard/slots",
      active: pathname === "/dashboard/slots",
      // Apenas para médicos
      show: isDoctor,
    },
    {
      label: "Perfil",
      icon: User,
      href: "/dashboard/profile",
      active: pathname === "/dashboard/profile",
    },
    {
      label: "Configurações",
      icon: Settings,
      href: "/dashboard/settings",
      active: pathname === "/dashboard/settings",
    },
  ]

  return (
    <div className="hidden md:flex h-full w-64 flex-col border-r bg-background">
      <div className="flex flex-col space-y-2 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Menu</h2>
          <div className="space-y-1">
            {routes.map((route) => {
              // Se a rota tem uma condição show e ela é falsa, não renderiza
              if (route.hasOwnProperty("show") && !route.show) {
                return null
              }

              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
                    route.active ? "bg-primary/10 text-primary" : "text-muted-foreground",
                  )}
                >
                  <route.icon className="h-4 w-4" />
                  {route.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
