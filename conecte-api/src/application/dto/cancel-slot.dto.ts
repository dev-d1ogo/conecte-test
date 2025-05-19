// cancel-available-slot.dto.ts
import { z } from 'zod'

export const CancelAvailableSlotParamsSchema = z.object({
    slotId: z.string().uuid()
})

export type CancelAvailableSlotParamsDTO = z.infer<typeof CancelAvailableSlotParamsSchema>
