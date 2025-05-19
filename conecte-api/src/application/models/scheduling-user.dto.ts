import { z } from 'zod'
import { UserRole } from '@/core/enums/UserRole'

export const SchedulingUserSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    role: z.nativeEnum(UserRole)
})

export type SchedulingUserDTO = z.infer<typeof SchedulingUserSchema>
