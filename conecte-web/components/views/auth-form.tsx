"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";

// Esquemas de validação
const loginSchema = z.object({
	email: z.string().email("E-mail inválido"),
	password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

const registerSchema = z.object({
	name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
	email: z.string().email("E-mail inválido"),
	password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
	role: z.enum(["PATIENT", "DOCTOR"] as const),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

interface AuthFormProps {
	mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { login, register, error: authError, isLoading, clearError } = useAuth();
	const [error, setError] = useState<string | null>(null);

	// Check for error in URL (e.g., when redirected from protected page)
	useEffect(() => {
		const errorParam = searchParams.get("error");
		if (errorParam) {
			if (errorParam === "auth_required") {
				setError("Você precisa estar logado para acessar esta página.");
			} else {
				setError(`Erro de autenticação: ${errorParam}`);
			}
		}

		const emailParam = searchParams.get("email");
		if (emailParam) {
			loginForm.setValue("email", emailParam);
		}

		// Set error from auth context if available
		if (authError) {
			setError(authError);
		}
	}, [searchParams, authError]);

	// Configuração do formulário baseado no modo
	const loginForm = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	useEffect(() => {
		setError(null);
		clearError?.();
	}, [mode]);

	const registerForm = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			role: "PATIENT",
		},
	});

	// Handlers de submissão
	async function onLoginSubmit(data: LoginFormValues) {
		setError(null);
		const success = await login(data.email, data.password);

		if (success) {
			router.push("/dashboard");
			router.refresh();
		}
	}

	async function onRegisterSubmit(data: RegisterFormValues) {
		setError(null);
		const success = await register(data.name, data.email, data.password, data.role);
	}

	if (mode === "login") {
		return (
			<Form {...loginForm}>
				<form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					<FormField
						control={loginForm.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>E-mail</FormLabel>
								<FormControl>
									<Input placeholder="seu@email.com" type="email" disabled={isLoading} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={loginForm.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Senha</FormLabel>
								<FormControl>
									<Input placeholder="******" type="password" disabled={isLoading} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? "Entrando..." : "Entrar"}
					</Button>
					<div className="text-center text-sm">
						Não tem uma conta?{" "}
						<Link href="/auth/register" className="font-medium text-primary hover:underline">
							Cadastre-se
						</Link>
					</div>
				</form>
			</Form>
		);
	}

	return (
		<Form {...registerForm}>
			<form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
				{error && (
					<Alert variant="destructive">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}
				<FormField
					control={registerForm.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nome</FormLabel>
							<FormControl>
								<Input placeholder="Seu nome completo" disabled={isLoading} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={registerForm.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>E-mail</FormLabel>
							<FormControl>
								<Input placeholder="seu@email.com" type="email" disabled={isLoading} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={registerForm.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Senha</FormLabel>
							<FormControl>
								<Input placeholder="******" type="password" disabled={isLoading} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={registerForm.control}
					name="role"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tipo de Usuário</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}
								disabled={isLoading}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Selecione o tipo de usuário" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="PATIENT">Paciente</SelectItem>
									<SelectItem value="DOCTOR">Médico</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" className="w-full" disabled={isLoading}>
					{isLoading ? "Cadastrando..." : "Cadastrar"}
				</Button>
				<div className="text-center text-sm">
					Já tem uma conta?{" "}
					<Link href="/auth/login" className="font-medium text-primary hover:underline">
						Faça login
					</Link>
				</div>
			</form>
		</Form>
	);
}
