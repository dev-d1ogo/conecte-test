// src/application/dto/cancel-scheduling.dto.ts
import { z } from 'zod'

export const CancelSchedulingSchema = z.object({
    id: z.string().uuid()
})

export type CancelSchedulingDTO = z.infer<typeof CancelSchedulingSchema>
