import { TransactionResponse } from '@cityofzion/blockchain-service'

import { TBlockchainServiceKey, TNetwork } from './blockchain'

export type TAccountType = 'standard' | 'watch' | 'hardware'

export type TWalletType = 'standard' | 'hardware'

export type TNftSkin = {
  id: string
  type: 'nft'
  imgUrl: string
}

export type TColorSkin = {
  id: string
  type: 'color'
}

export type TLocalSkin = {
  id: string
  type: 'local'
}

export type TSkin = TColorSkin | TLocalSkin | TNftSkin

export interface IAccountState {
  id: string
  address: string
  type: TAccountType
  idWallet: string
  name: string
  blockchain: TBlockchainServiceKey
  encryptedKey?: string
  order: number
  skin: TSkin
}

export interface IWalletState {
  id: string
  name: string
  type: TWalletType
  encryptedMnemonic?: string
  accounts: IAccountState[]
}

export type TLoginSessionType = 'password'

export type TLoginSession = {
  type: TLoginSessionType
  encryptedPassword: string
}

export type TAvailableCurrency = 'USD' | 'BRL' | 'EUR' | 'GBP' | 'CNY'

export type TCurrency = {
  symbol: string
  label: TAvailableCurrency
}

export type TCustomNetwork = {
  [K in TBlockchainServiceKey]: TNetwork<K>[]
}

export type TSelectedNetworks = {
  [K in TBlockchainServiceKey]: TNetwork<K>
}

export type TNetworkProfile = {
  id: string
  name: string
  networkByBlockchain: TSelectedNetworks
}

export interface ISettingsState {
  currency: TCurrency
  selectedNetworkByBlockchain: TSelectedNetworks
  networkProfiles: TNetworkProfile[]
  selectedNetworkProfile: TNetworkProfile
}

export type TPendingTransaction = TransactionResponse & {
  account: IAccountState
  isClaim?: boolean
}

export type TLastIndexesByWallet = Partial<Record<TBlockchainServiceKey, Record<string, number>>>

export type THiddenTokenByBlockchain = Partial<Record<TBlockchainServiceKey, string[]>>
