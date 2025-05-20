import { AuthForm } from "@/components/views/auth-form";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: "Login | Conecte",
	description: "Faça login na plataforma Conecte",
};

export default function LoginPage() {
	return (
		<div className="container flex h-screen w-screen flex-col items-center justify-center">
			<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
				<div className="flex flex-col space-y-2 text-center">
					<h1 className="text-2xl font-semibold tracking-tight">Bem-vindo de volta</h1>
					<p className="text-sm text-muted-foreground">
						Entre com seu e-mail e senha para acessar sua conta
					</p>
				</div>
				<Suspense fallback={<div>Carregando formulário...</div>}>
					<AuthForm key={"login"} mode="login" />
				</Suspense>
			</div>
		</div>
	);
}
