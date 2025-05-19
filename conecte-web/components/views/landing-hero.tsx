import { Button } from "@/components/ui/button"
import Link from "next/link"

export function LandingHero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-ice dark:from-gray-900 dark:to-gray-800">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Conecte-se com os melhores médicos
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Agende consultas médicas de forma rápida e eficiente. Conecte é a plataforma que facilita o agendamento
                entre pacientes e médicos.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/auth/register">
                <Button size="lg" className="px-8">
                  Começar agora
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="px-8">
                  Saiba mais
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[350px] w-full md:h-[450px] lg:h-[500px] rounded-lg overflow-hidden bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-blue-950 dark:to-indigo-900 shadow-xl">
              {/* Trusted badge */}
              <div className="absolute top-4 left-4 bg-teal-500/90 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">
                CUIDANDO DE MAIS DE 10.000 PACIENTES
              </div>

              {/* Health app interface */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-[90%] h-[85%] bg-white/90 dark:bg-gray-800/80 rounded-lg backdrop-blur-sm border border-blue-100 dark:border-blue-900 overflow-hidden shadow-lg">
                  {/* App header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-500 to-teal-400 dark:from-blue-600 dark:to-teal-500">
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white"
                      >
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                      </svg>
                      <div className="font-semibold text-white">Conecte Saúde</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white"
                        >
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-blue-400/20 flex items-center justify-center border-2 border-white">
                        <span className="text-xs font-bold text-white">JP</span>
                      </div>
                    </div>
                  </div>

                  {/* App content */}
                  <div className="p-4 pb-8">
                    {/* Welcome section */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Olá, João Pedro</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-300">Como está se sentindo hoje?</p>
                    </div>

                    {/* Health stats */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl border border-blue-100 dark:border-blue-800">
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-xs font-medium text-blue-600 dark:text-blue-300">Batimentos</div>
                          <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-blue-600 dark:text-blue-300"
                            >
                              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                            </svg>
                          </div>
                        </div>
                        <div className="text-xl font-bold text-gray-800 dark:text-white">72 bpm</div>
                        <div className="text-xs text-green-600 dark:text-green-400">Normal</div>
                      </div>

                      <div className="bg-teal-50 dark:bg-teal-900/30 p-3 rounded-xl border border-teal-100 dark:border-teal-800">
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-xs font-medium text-teal-600 dark:text-teal-300">Pressão</div>
                          <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-800 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-teal-600 dark:text-teal-300"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                              <line x1="9" y1="9" x2="9.01" y2="9"></line>
                              <line x1="15" y1="9" x2="15.01" y2="9"></line>
                            </svg>
                          </div>
                        </div>
                        <div className="text-xl font-bold text-gray-800 dark:text-white">120/80</div>
                        <div className="text-xs text-green-600 dark:text-green-400">Ideal</div>
                      </div>

                      <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-xl border border-purple-100 dark:border-purple-800">
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-xs font-medium text-purple-600 dark:text-purple-300">Sono</div>
                          <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-purple-600 dark:text-purple-300"
                            >
                              <path d="M12 21a9 9 0 0 1-9-9H1l3.9-3.9a2 2 0 0 1 2.82 0L11.62 12H3a7 7 0 0 0 7 7v2Z"></path>
                              <path d="M15 21a9 9 0 0 0 9-9h2l-3.9-3.9a2 2 0 0 0-2.82 0L15.38 12H24a7 7 0 0 1-7 7v2Z"></path>
                            </svg>
                          </div>
                        </div>
                        <div className="text-xl font-bold text-gray-800 dark:text-white">7.5h</div>
                        <div className="text-xs text-green-600 dark:text-green-400">Bom</div>
                      </div>
                    </div>

                    {/* Upcoming appointment */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 mb-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-800 dark:text-white">Próxima Consulta</h4>
                        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                          Hoje
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-blue-600 dark:text-blue-300"
                          >
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-gray-800 dark:text-white">Dra. Ana Beatriz</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Cardiologista</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">14:30 - 15:15</div>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg flex-1">
                          Confirmar
                        </button>
                        <button className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg flex-1">
                          Reagendar
                        </button>
                      </div>
                    </div>

                    {/* Health tips */}
                    <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/30 dark:to-teal-900/30 rounded-xl p-4 border border-green-100 dark:border-green-800 mt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-green-600 dark:text-green-400"
                        >
                          <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                          <line x1="6" y1="1" x2="6" y2="4"></line>
                          <line x1="10" y1="1" x2="10" y2="4"></line>
                          <line x1="14" y1="1" x2="14" y2="4"></line>
                        </svg>
                        <h4 className="font-medium text-gray-800 dark:text-white">Dica de Saúde</h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Beba pelo menos 2 litros de água hoje para manter-se hidratado e melhorar sua saúde geral.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute top-[15%] right-[5%] bg-white/90 dark:bg-gray-800/90 p-3 rounded-lg shadow-lg border border-blue-100 dark:border-blue-900">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 dark:bg-green-900/50 p-1.5 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-600 dark:text-green-400"
                      >
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                        <path d="m9 14 2 2 4-4"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Bem-estar</div>
                      <div className="text-sm font-bold text-gray-800 dark:text-white">92%</div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-[20%] right-[10%] bg-white/90 dark:bg-gray-800/90 p-2 rounded-full shadow-lg border border-blue-100 dark:border-blue-900">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-500"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
