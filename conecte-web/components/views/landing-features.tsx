import { Calendar, Clock, Bell, Users } from "lucide-react"

export function LandingFeatures() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-ice dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">Recursos</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Tudo que você precisa para gerenciar consultas
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Nossa plataforma oferece ferramentas poderosas para médicos e pacientes, tornando o agendamento de
              consultas simples e eficiente.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
            <Calendar className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold text-center">Agendamento Fácil</h3>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
              Agende consultas com poucos cliques, escolhendo o médico e horário ideal.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
            <Clock className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold text-center">Horários Flexíveis</h3>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
              Médicos podem configurar sua disponibilidade de acordo com sua rotina.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
            <Bell className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold text-center">Atualizações em Tempo Real</h3>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
              Receba notificações instantâneas sobre novos agendamentos e alterações.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
            <Users className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold text-center">Para Todos</h3>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
              Interface adaptada para as necessidades de médicos e pacientes.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
