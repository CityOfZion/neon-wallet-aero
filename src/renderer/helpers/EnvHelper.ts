/* eslint-disable @typescript-eslint/no-namespace */
import { z } from 'zod'

const envSchema = z.object({
  VITE_UNLIMIT_MERCHANT_ID: z.string().nonempty(),
  VITE_UNLIMIT_BUY_TOKENS_IFRAME_URL: z.url(),
  VITE_UNLIMIT_SELL_TOKENS_IFRAME_URL: z.url(),
  VITE_CLICK_UP_LIST_ID: z.string().nonempty(),
  VITE_CLICK_UP_ASSIGNEE_ID: z.string().nonempty(),
  VITE_CLICK_UP_KEY: z.string().nonempty(),
  VITE_GA_MEASUREMENT_ID: z.string().nonempty(),
  VITE_GA_API_SECRET: z.string().nonempty(),
  VITE_SENTRY_DSN: z.string().nonempty(),
  VITE_CRISP_WEBSITE_ID: z.string().nonempty(),
})

type EnvSchema = z.infer<typeof envSchema>

class EnvHelperClass {
  static schema = envSchema

  static async setup(): Promise<EnvSchema> {
    const result = await this.schema.parseAsync(import.meta.env)
    Object.assign(this, result)
    return result
  }
}

// Cast the class to include all env properties
export const EnvHelper = EnvHelperClass as typeof EnvHelperClass & EnvSchema

export namespace EnvHelper {
  export type Schema = EnvSchema
}
