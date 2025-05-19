import { z } from 'zod'

export const DoctorParamSchema = z.object({
    id: z.string().uuid()
})

export type DoctorParamDTO = z.infer<typeof DoctorParamSchema>
