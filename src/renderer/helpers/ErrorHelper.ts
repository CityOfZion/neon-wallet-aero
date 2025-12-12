import { BSError } from '@cityofzion/blockchain-service'

import { getI18next } from '@renderer/libs/i18next'
const { t, ...i18next } = getI18next()

export class AppError extends Error {
  rootMessage?: string

  constructor(message: string, rootError?: unknown) {
    super(message)
    this.name = 'AppError'

    if (rootError && rootError instanceof Error && rootError.stack && !(rootError instanceof AppError)) {
      this.stack += `\nCaused by: ${rootError.stack}`
      this.rootMessage = rootError.message
    }
  }

  static wrap(error: unknown, defaultMessage?: string) {
    if (error instanceof AppError) {
      return error
    }

    return new AppError(defaultMessage || t('errors.unexpectedError'), error)
  }
}

export class WalletConnectError extends AppError {
  code: string

  constructor(message: string, code: string, rootError?: unknown) {
    super(message, rootError)
    this.name = 'WalletConnectError'
    this.code = code
  }

  static wrap(error: unknown, defaultMessage?: string) {
    if (error instanceof WalletConnectError) {
      return error
    }

    if (error instanceof AppError) {
      return new WalletConnectError(error.message, 'UNEXPECTED_ERROR')
    }

    if (error instanceof BSError) {
      let message = defaultMessage ?? t('walletConnect.errorsByCode.UNEXPECTED_ERROR')
      let code = 'UNEXPECTED_ERROR'

      if (i18next.exists(`common:walletConnect.errorsByCode.${error.code}`)) {
        message = t(`common:walletConnect.errorsByCode.${error.code}`, '')
        code = error.code
      }

      return new WalletConnectError(message, code, error)
    }

    return new WalletConnectError(
      defaultMessage ?? t('walletConnect.errorsByCode.UNEXPECTED_ERROR'),
      'UNEXPECTED_ERROR',
      error
    )
  }
}
