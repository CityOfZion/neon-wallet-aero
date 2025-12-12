import type { TBlockchainServiceKey } from './blockchain'
import type { IAccountState, TLastIndexesByWallet } from './store'

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
