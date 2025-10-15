import type { TBlockchainServiceKey, TNetwork } from './blockchain'
import type { IAccountState } from './store'

export type TWalletConnectHelperSessionInformation<T extends TBlockchainServiceKey = TBlockchainServiceKey> = {
  address: string
  blockchain: T
  network: TNetwork
  methods: string[]
}

export type TWalletConnectHelperProposalInformation<T extends TBlockchainServiceKey = TBlockchainServiceKey> = {
  chain: string
  methods: string[]
  blockchain: T
  network: TNetwork
  proposalBlockchain: string
}

export type TAccountHelperPredicateParams = {
  address: string
  blockchain: TBlockchainServiceKey
}

export type TAccountHelperGetServiceAccountParams = {
  account: IAccountState
  key: string
}
