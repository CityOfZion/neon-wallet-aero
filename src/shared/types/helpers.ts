import type { TBSToken } from '@cityofzion/blockchain-service'
import type { JSX, ReactNode } from 'react'
import type { ToastT } from 'sonner'

import type { TBlockchainServiceKey } from './blockchain'
import type { TUseTransactionsTransaction } from './hooks'
import type { IAccountState, TCurrency, TLanguage, TLastIndexesByWallet } from './store'

export type TAccountHelperPredicateParams = {
  address: string
  blockchain: TBlockchainServiceKey
}

export type TAccountHelperGetServiceAccountParams = {
  account: IAccountState
  key: string
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
  bip44Path?: string
}

export type THardwareWalletHelperConnectionType = 'usb' | 'bluetooth'

export type TClickupHelperCreateSupportTicketParams = {
  name: string
  email: string
  description: string
}

export type TBuyAndSellTokensHelperGetSellUrlParams = {
  account?: IAccountState
  currency: TCurrency
}

export type TBuyAndSellTokensHelperInitBuyParams = {
  account?: IAccountState
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

export type TExportTransactionsHelperCalculateDateSelectionMaxOneYearParams = {
  dateFrom: Date
  dateTo: Date
}

export type TExportTransactionsHelperCalculateDateToSelectionMaxOneYearResponse = {
  dateTo: Date
  dateFrom?: Date
}

export type TExportTransactionsHelperCalculateDateFromSelectionMaxOneYearResponse = {
  dateFrom: Date
  dateTo?: Date
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

export type TTransactionHelperBuildPendingTransactionParams = {
  txId: string
  fromAccount: IAccountState
  type?: Exclude<TUseTransactionsTransaction['type'], 'bridgeNeo3NeoX'>
  events?: { toAccount?: IAccountState; toAddress?: string; token: TBSToken; amount: string; method?: string }[]
}

export type TLoggerHelperOptions = {
  where: string
  operation?: string
}
