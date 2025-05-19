import type React from "react"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/views/dashboard-header"
import { DashboardSidebar } from "@/components/views/dashboard-sidebar"
import type { Metadata } from "next"
import { cookies } from "next/headers"

export const metadata: Metadata = {
  title: "Dashboard | Conecte",
  description: "Gerencie seus agendamentos médicos",
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Verificar autenticação no servidor


  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
