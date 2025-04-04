import { z } from 'zod'

const envSchema = z.object({
  DEV: z.boolean(),
})

export const EnvHelper = envSchema.parse(import.meta.env)
