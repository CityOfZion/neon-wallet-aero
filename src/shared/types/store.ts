import type { TBSServiceName } from '@cityofzion/bs-multichain'

import type { TNetwork } from './blockchain'
import type { Optional } from './generics'

export type TAvailableLanguages = 'English' | 'Deutsch' | 'Português (BR)' | '简体中文' | '繁體中文'

export type TLanguage = {
  value: string
  label: TAvailableLanguages
}

export type TContactEncryptedAddress = {
  encryptedAddress: string
  blockchain: TBSServiceName
}

export type TContactAddress = {
  address: string
  blockchain: TBSServiceName
}

export type TContact<A = TContactAddress> = {
  id: string
  name: string
  addresses: A[]
}

type TNotificationNavigateAction = {
  type: 'navigate'
  payload:
    | {
        to: 'account-transactions'
        address: string
        blockchain: TBSServiceName
      }
    | {
        to: 'account-tokens'
        address: string
        blockchain: TBSServiceName
      }
    | {
        to: 'hide-fraudulent-token'
        address: string
        blockchain: TBSServiceName
        tokenHash: string
      }
    | {
        to: 'neo3-vote'
        address: string
        blockchain: TBSServiceName
      }
    | {
        to: 'backup-wallet'
      }
    | {
        to: 'bneo-shutdown'
        address: string
        blockchain: TBSServiceName
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
  date: string
  body?: string
  read: boolean
  priority: TNotificationPriority
  provider: 'system'
  action?: TNotificationAction
  related?: {
    blockchain: TBSServiceName
    address?: string
  }
}

export type TSaveNotification = Optional<TNotification, 'id' | 'date' | 'provider' | 'read' | 'priority'>

export type TAccountType = 'standard' | 'watch' | 'hardware'

export type TWalletType = 'standard' | 'hardware'

export type TAccount<N extends TBSServiceName = TBSServiceName> = N extends TBSServiceName
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

export type TAccountWithWallet<N extends TBSServiceName = TBSServiceName> = TAccount<N> & {
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
  [K in TBSServiceName]: TNetwork
}

export type TCustomNetworks = {
  [K in TBSServiceName]: TNetwork[]
}

export type TLastIndexesByWallet = Partial<Record<TBSServiceName, Record<string, number>>>

export type THiddenTokenByBlockchain = Partial<Record<TBSServiceName, string[]>>

export type TImportAccountsSelectionType = 'mnemonic' | 'key' | 'address'

export type TApplicationDataByLoginType = {
  [K in TLoginSessionType]: {
    wallets: TWallet[]
    notifications: TNotification[]
    shouldConfirmAction: boolean
  }
}
