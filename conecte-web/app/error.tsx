"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error)
  }, [error])

  return (
    <html>
      <body>
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <CardTitle>Erro no Sistema</CardTitle>
              </div>
              <CardDescription>Ocorreu um erro inesperado</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Desculpe, ocorreu um erro inesperado. Nossa equipe técnica foi notificada.</p>
              {process.env.NODE_ENV === "development" && (
                <p className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded">{error.message}</p>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/">Voltar para Home</Link>
              </Button>
              <Button onClick={reset}>Tentar Novamente</Button>
            </CardFooter>
          </Card>
        </div>
      </body>
    </html>
  )
}
