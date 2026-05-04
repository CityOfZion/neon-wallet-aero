import type { TBSNetwork } from '@cityofzion/blockchain-service'
import type { BSBitcoin } from '@cityofzion/bs-bitcoin'
import type { BSEthereum } from '@cityofzion/bs-ethereum'
import type { BSAggregator, TBSServiceByName } from '@cityofzion/bs-multichain'
import type { BSNeoLegacy } from '@cityofzion/bs-neo-legacy'
import type { BSNeo3 } from '@cityofzion/bs-neo3'
import type { BSNeoX } from '@cityofzion/bs-neox'
import type { BSSolana } from '@cityofzion/bs-solana'
import type { BSStellar } from '@cityofzion/bs-stellar'

import type { TAccount, TAccountType, TWallet, TWalletBackupStatus, TWalletType } from './store'

export type TBlockchainService =
  | BSNeo3
  | BSNeoLegacy
  | BSNeoX
  | BSSolana
  | BSEthereum<'ethereum'>
  | BSEthereum<'polygon'>
  | BSEthereum<'base'>
  | BSEthereum<'arbitrum'>
  | BSStellar
  | BSBitcoin

export type TBlockchainServiceKey = TBlockchainService['name']

export type TBSAggregator = BSAggregator<TBlockchainService[], TBSServiceByName<TBlockchainService[]>>

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

export type TNetwork = { isAutomatic?: boolean } & TBSNetwork

export type TAccountToEdit = {
  account: TAccount
  data: Partial<Omit<TAccount, 'address' | 'encryptedKey' | 'id'>> & { key?: string }
}

export type TWalletToEdit = {
  wallet: TWallet
  data: Partial<Omit<TWallet, 'id' | 'encryptedMnemonic'>> & { mnemonic?: string }
}
