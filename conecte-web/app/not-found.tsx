import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">404</h1>
        <p className="mt-4 text-lg text-muted-foreground">A página que você está procurando não foi encontrada.</p>
        <Button asChild className="mt-8">
          <Link href="/">Voltar para Home</Link>
        </Button>
      </div>
    </div>
  )
}
