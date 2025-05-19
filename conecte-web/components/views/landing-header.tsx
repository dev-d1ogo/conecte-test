"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">Conecte Saúde</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="#features"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Recursos
          </Link>
          <Link href="#about" className="text-sm font-medium transition-colors hover:text-primary">
            Sobre
          </Link>
          <div className="flex items-center gap-4">
            <ModeToggle />
            {!user ? (
              <>
                <Link href="/auth/login">
                  <Button variant="outline">Entrar</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Cadastrar</Button>
                </Link>
              </>
            ) : (
              <>
                {" "}
                <Link href="/dashboard">
                  <Button className="w-[150px]">Meu Painel</Button>
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Navigation Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden container py-4 bg-background">
          <nav className="flex flex-col space-y-4">
            <Link
              href="#features"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Recursos
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre
            </Link>
            <div className="flex flex-col space-y-2 pt-2">
              {!user ? (
                <>
                  <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Entrar
                    </Button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Cadastrar</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Painel</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
