import { UserRole } from "@/core/enums/UserRole"

export interface UserJwt {
    id: string
    email: string
    role: UserRole
    name: string
}

declare module 'express' {
    interface Request {
        user?: UserJwt
    }
}
