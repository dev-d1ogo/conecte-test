import Link from "next/link"

export function LandingFooter() {
  return (
    <footer className="w-full border-t bg-background py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">Conecte</span>
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400">© 2025 Conecte. Todos os direitos reservados.</p>
        </div>
        <div className="flex gap-4">
          <Link href="#" className="text-sm font-medium text-gray-500 hover:text-primary dark:text-gray-400">
            Termos
          </Link>
          <Link href="#" className="text-sm font-medium text-gray-500 hover:text-primary dark:text-gray-400">
            Privacidade
          </Link>
          <Link href="#" className="text-sm font-medium text-gray-500 hover:text-primary dark:text-gray-400">
            Contato
          </Link>
        </div>
      </div>
    </footer>
  )
}
