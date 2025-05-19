import { z } from 'zod'

export const CreateAvailableSlotSchema = z.object({
    dateTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format'
    })
})

export type CreateAvailableSlotDTO = z.infer<typeof CreateAvailableSlotSchema>
