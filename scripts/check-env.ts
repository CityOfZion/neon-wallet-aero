import { config } from 'dotenv'

import { EnvHelper } from '../src/renderer/helpers/EnvHelper'

config()

const result = EnvHelper.schema.safeParse(process.env)

if (!result.success) {
  console.error('❌ Environment variable validation failed:')
  console.error(result.error.format())
  process.exit(1)
} else {
  console.log('✅ Environment variables are valid.')
}
