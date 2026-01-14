import type { TBlockchainServiceKey } from './blockchain'
import type { IAccountState, TLanguage, TLastIndexesByWallet } from './store'

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
