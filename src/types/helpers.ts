import { TBlockchainServiceKey } from './blockchain'
import { IAccountState } from './store'

export type TAccountHelperPredicateParams = {
  address: string
  blockchain: TBlockchainServiceKey
}

export type TAccountHelperGetServiceAccountParams = {
  account: IAccountState
  key: string
}
