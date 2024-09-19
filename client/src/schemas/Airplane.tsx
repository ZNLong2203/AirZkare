import { z } from 'zod'

export const AirplaneSchema = z.object({
    airplane_id: z.string(),
    name: z.string(),
    model: z.string(),
    total_business: z.number().positive(),
    total_economy: z.number().positive()
})

export type Airplane = z.infer<typeof AirplaneSchema>