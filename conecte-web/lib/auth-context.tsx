"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authService } from "./api-service";
import type { User } from "./types";

interface AuthContextType {
	user: User | undefined;
	isLoading: boolean;
	error: string | null;
	login: (email: string, password: string) => Promise<boolean>;
	register: (name: string, email: string, password: string, role: string) => Promise<boolean>;
	logout: () => Promise<void>;
	clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	// Verificar sessão ao carregar
	useEffect(() => {
		const checkSession = async () => {
			try {
				setIsLoading(true);
				const response = await authService.getSession();

				if (response.data?.user) {
					setUser(response.data.user);
				}
			} catch (err) {
				console.error("Erro ao verificar sessão:", err);
			} finally {
				setIsLoading(false);
			}
		};

		checkSession();
	}, []);

	// Função de login
	const login = async (email: string, password: string) => {
		setError(null);
		setIsLoading(true);

		try {
			const response = await authService.login(email, password);

			if (response.error) {
				setError(response.error);
				return false;
			}

			if (response.data?.user) {
				setUser(response.data.user);
				return true;
			}

			return false;
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erro ao fazer login";
			setError(message);
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	// Função de registro
	const register = async (name: string, email: string, password: string, role: string) => {
		setError(null);
		setIsLoading(true);

		try {
			const response = await authService.register(name, email, password, role);

			if (response.error) {
				console.log("Foi no erro");
				setError(response.error);
				return false;
			}

			router.push(`/auth/login?email=${encodeURIComponent(email)}`);

			return true;
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erro ao registrar";
			setError(message);
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	// Função de logout
	const logout = async () => {
		try {
			await authService.logout();
			setUser(undefined);
			router.push("/");
			router.refresh();
		} catch (err) {
			console.error("Erro ao fazer logout:", err);
		}
	};

	function clearError() {
		setError(null);
	}
	return (
		<AuthContext.Provider value={{ user, isLoading, error, login, register, logout, clearError }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth deve ser usado dentro de um AuthProvider");
	}
	return context;
}
