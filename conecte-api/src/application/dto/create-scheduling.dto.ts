import { z } from 'zod'

export const CreateSchedulingSchema = z.object({
    slotId: z.string().uuid()
})

export type CreateSchedulingDTO = z.infer<typeof CreateSchedulingSchema>

