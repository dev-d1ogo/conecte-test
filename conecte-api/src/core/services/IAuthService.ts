import { User } from "@/core/entities/User"
import { UserJwt } from "@/core/models/UserJwt"



export abstract class IAuthService {
    abstract hashPassword(password: string): string
    abstract verifyPassword(password: string, hashedPassword: string): boolean
    abstract generateToken(user: User, expire?: string): Promise<string>
    abstract verifyToken(token: string): Promise<UserJwt | null>
}
