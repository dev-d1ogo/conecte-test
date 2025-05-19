import { UserRole } from '@/core/enums/UserRole'
import { z } from 'zod'

export const RegisterUserSchema = z.object({
    name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    role: z.nativeEnum(UserRole, {
        errorMap: () => ({ message: 'Role inválida. Use DOCTOR ou PATIENT' })
    })
})

export type RegisterUserDTO = z.infer<typeof RegisterUserSchema>
