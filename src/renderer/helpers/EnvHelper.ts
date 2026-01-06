import { z } from 'zod'

const envSchema = z.object({
  DEV: z.boolean(),
  VITE_UNLIMIT_MERCHANT_ID: z.string(),
  VITE_UNLIMIT_BUY_TOKENS_IFRAME_URL: z.url(),
  VITE_UNLIMIT_SELL_TOKENS_IFRAME_URL: z.url(),
  VITE_CLICK_UP_LIST_ID: z.string(),
  VITE_CLICK_UP_ASSIGNEE_ID: z.string(),
  VITE_CLICK_UP_KEY: z.string(),
})

export const EnvHelper = envSchema.parse(import.meta.env)
