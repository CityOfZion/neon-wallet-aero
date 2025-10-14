import { z } from 'zod'

const envSchema = z.object({
  DEV: z.boolean(),
  VITE_UNLIMIT_MERCHANT_ID: z.string().optional(),
  VITE_UNLIMIT_BUY_TOKENS_IFRAME_URL: z.string().optional(),
  VITE_UNLIMIT_SELL_TOKENS_IFRAME_URL: z.string().optional(),
})

export const EnvHelper = envSchema.parse(import.meta.env)
