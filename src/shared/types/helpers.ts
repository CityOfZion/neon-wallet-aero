import type { Event } from '@sentry/react'
import type { JSX, ReactNode } from 'react'
import type { ToastT } from 'sonner'

import type { TBlockchainServiceKey } from './blockchain'
import type { TAccount, TCurrency, TLanguage, TLastIndexesByWallet } from './store'

export type TAccountHelperPredicateParams = {
  address: string
  blockchain: TBlockchainServiceKey
}

export type THardwareWalletHelperConnectParams = {
  lastIndexesByWallet: TLastIndexesByWallet
  type: THardwareWalletHelperConnectionType
}

export type THardwareWalletHelperGetAccountParams = {
  index: number
  blockchain: TBlockchainServiceKey
}

export type THardwareWalletHelperEnsureConnectionParams = {
  blockchain: TBlockchainServiceKey
  address: string
  bipPath?: string
}

export type THardwareWalletHelperConnectionType = 'usb' | 'bluetooth'

export type TClickupHelperCreateSupportTicketParams = {
  name: string
  email: string
  description: string
}

export type TBuyAndSellTokensHelperGetSellUrlParams = {
  account?: TAccount
  currency: TCurrency
}

export type TBuyAndSellTokensHelperInitBuyParams = {
  account?: TAccount
  currency: TCurrency
  id: string
}

export type TCurrencyHelperFormatOptions = {
  currency: TCurrency
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  showZero?: boolean
  approximateSymbol?: boolean
}

export type TDateHelperFormatLocalizedOptions = {
  format: string
  language: TLanguage
}

export type TDateHelperCalculateDateSelectionMaxOneYearParams = {
  dateFrom: Date
  dateTo: Date
}

export type TDateHelperCalculateDateFromSelectionMaxOneYearResponse = {
  dateFrom: Date
  dateTo?: Date
}

export type TDateHelperCalculateDateToSelectionMaxOneYearResponse = {
  dateTo: Date
  dateFrom?: Date
}

export type TFileHelperPickOptions = {
  accept?: string
}

export type TFileHelperPickResult = {
  name: string
  content: string
  size: number
}

export type TStringHelperRemoveSpecialCharacterOptions = {
  allowSpaces?: boolean
  allowDots?: boolean
  allowCommas?: boolean
  trimText?: boolean
}

export type TToastHelperToastProps = {
  message: ReactNode
  className?: string
  sonnerId: string | number
  icon?: JSX.Element
  closeable?: boolean
}

export type TToastHelperToastOptions = Omit<ToastT, 'id'> & {
  message: ReactNode
  id?: string | number
}

export type TLoggerHelperOptions = {
  where: string
  operation?: string
}

export type TSentryHelperOptions = TLoggerHelperOptions & {
  level: Event['level']
}
