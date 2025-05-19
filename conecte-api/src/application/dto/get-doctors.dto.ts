import { z } from 'zod'

export const GetDoctorsSchema = z.object({
    name: z.string().optional(),
    order: z.enum(['asc', 'desc']).optional()
})

export type GetDoctorsDTO = z.infer<typeof GetDoctorsSchema>
