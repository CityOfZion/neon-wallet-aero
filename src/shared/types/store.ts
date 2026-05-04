import type { TSwapServiceStatusResponse, TSwapToken } from '@cityofzion/blockchain-service'

import type { TBlockchainServiceKey, TNetwork } from './blockchain'
import type { Optional } from './generics'

export type TAvailableLanguages = 'English' | 'Deutsch' | 'Português (BR)' | '简体中文' | '繁體中文'

export type TLanguage = {
  value: string
  label: TAvailableLanguages
}

export type TContactEncryptedAddress = {
  encryptedAddress: string
  blockchain: TBlockchainServiceKey
}

export type TContactAddress = {
  address: string
  blockchain: TBlockchainServiceKey
}

export type TContact<A = TContactAddress> = {
  id: string
  name: string
  addresses: A[]
}

export type TSwapRecord = {
  account: TAccount
  txFrom?: string
  txTo?: string
  swapProvider: 'simpleswap'
  swapId?: string
  swapStatus: TSwapServiceStatusResponse['status']
  tokenFrom: TSwapToken<TBlockchainServiceKey>
  tokenTo: TSwapToken<TBlockchainServiceKey>
  amountFrom: string
  amountTo: string
  addressTo: string
  extraIdTo?: string
  fee?: string
  log?: string
}

type TNotificationNavigateAction = {
  type: 'navigate'
  payload:
    | {
        to: 'account-transactions'
        address: string
        blockchain: TBlockchainServiceKey
      }
    | {
        to: 'account-tokens'
        address: string
        blockchain: TBlockchainServiceKey
      }
    | {
        to: 'hide-fraudulent-token'
        address: string
        blockchain: TBlockchainServiceKey
        tokenHash: string
      }
    | {
        to: 'neo3-vote'
        address: string
        blockchain: TBlockchainServiceKey
      }
    | {
        to: 'backup-wallet'
      }
}

export type TNotificationAction = TNotificationNavigateAction

export type TNotificationPriority = 'low' | 'medium' | 'high'

export type TNotification = {
  id: string
  title: string
  titleValue?: string
  previewBody: string
  previewBodyValue?: string
  date: number
  body?: string
  read: boolean
  priority: TNotificationPriority
  provider: 'system'
  action?: TNotificationAction
  related?: {
    blockchain: TBlockchainServiceKey
    address?: string
  }
}

export type TSaveNotification = Optional<TNotification, 'id' | 'date' | 'provider' | 'read' | 'priority'>

export type TAccountType = 'standard' | 'watch' | 'hardware'

export type TWalletType = 'standard' | 'hardware'

export type TAccount<N extends TBlockchainServiceKey = TBlockchainServiceKey> = N extends TBlockchainServiceKey
  ? {
      id: string
      address: string
      type: TAccountType
      idWallet: string
      name: string
      blockchain: N
      encryptedKey?: string
      order: number
    }
  : never

export type TWalletBackupStatus = 'successful' | 'unsuccessful'

export type TWallet = {
  id: string
  name: string
  type: TWalletType
  encryptedMnemonic?: string
  accounts: TAccount[]
  backupStatus: TWalletBackupStatus
}

export type TAccountWithWallet<N extends TBlockchainServiceKey = TBlockchainServiceKey> = TAccount<N> & {
  wallet: TWallet
}

export type TLoginSessionType = 'password' | 'key' | 'hardware'

export type TLoginSession = {
  type: TLoginSessionType
  encryptedPassword: string
}

export type TAvailableCurrency = 'USD' | 'BRL' | 'EUR' | 'GBP' | 'CNY'

export type TCurrency = {
  symbol: string
  label: TAvailableCurrency
}

export type TSelectedNetworks = {
  [K in TBlockchainServiceKey]: TNetwork
}

export type TLastIndexesByWallet = Partial<Record<TBlockchainServiceKey, Record<string, number>>>

export type THiddenTokenByBlockchain = Partial<Record<TBlockchainServiceKey, string[]>>

export type TImportAccountsSelectionType = 'mnemonic' | 'key' | 'address'
