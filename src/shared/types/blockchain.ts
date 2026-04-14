import type { TBSNetwork } from '@cityofzion/blockchain-service'

import type { TAccount, TAccountType, TWallet, TWalletBackupStatus, TWalletType } from './store'

export type TBlockchainServiceKey =
  | 'neo3'
  | 'neoLegacy'
  | 'ethereum'
  | 'neox'
  | 'polygon'
  | 'base'
  | 'arbitrum'
  | 'solana'

export type TAccountToImport = {
  address: string
  blockchain: TBlockchainServiceKey
  wallet: TWallet
  type: TAccountType
  key?: string
  name?: string
  order?: number
}

export type TAccountsToImport = Omit<TAccountToImport, 'wallet'>[]

export type TCreateWalletAndAccountParam = TWalletToCreate & {
  accounts: TAccountsToImport
}

export type TImportAccountsParam = {
  wallet: TWallet
  accounts: TAccountsToImport
}

export type TAccountToCreate = {
  id?: string
  wallet: TWallet
  name: string
  blockchain: TBlockchainServiceKey
}

export type TWalletToCreate = {
  name: string
  mnemonic?: string
  id?: string
  type?: TWalletType
  backupStatus?: TWalletBackupStatus
}

export type TNetwork = {
  isAutomatic?: boolean
} & TBSNetwork

export type TAccountToEdit = {
  account: TAccount
  data: Partial<Omit<TAccount, 'address' | 'encryptedKey' | 'id'>> & { key?: string }
}

export type TWalletToEdit = {
  wallet: TWallet
  data: Partial<Omit<TWallet, 'id' | 'encryptedMnemonic'>> & { mnemonic?: string }
}
