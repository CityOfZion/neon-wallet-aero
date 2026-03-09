import * as Sentry from '@sentry/react'
import type { RootOptions } from 'react-dom/client'

import type { TSentryHelperOptions } from '@shared/types/helpers'

import { EnvHelper } from './EnvHelper'

export class SentryHelper {
  static readonly options: RootOptions = {
    onUncaughtError: Sentry.reactErrorHandler(),
    onCaughtError: Sentry.reactErrorHandler(),
    onRecoverableError: Sentry.reactErrorHandler(),
  }

  static capture(error: unknown, options: TSentryHelperOptions) {
    if (!import.meta.env.PROD) return

    Sentry.captureException(error, {
      level: options?.level,
      tags: { where: options?.where, operation: options?.operation },
    })
  }

  static setup() {
    if (!import.meta.env.PROD) return

    Sentry.init({
      dsn: EnvHelper.VITE_SENTRY_DSN,
      sendDefaultPii: false,
    })
  }
}
