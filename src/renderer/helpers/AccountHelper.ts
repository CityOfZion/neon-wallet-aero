import orderBy from 'lodash/orderBy'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import type { TAccountHelperPredicateParams } from '@shared/types/helpers'
import type { TAccount } from '@shared/types/store'

import { BlockchainServiceHelper } from './BlockchainServiceHelper'

export class AccountHelper {
  static predicate({ address, blockchain }: TAccountHelperPredicateParams) {
    return (account: TAccountHelperPredicateParams) => address === account.address && blockchain === account.blockchain
  }

  static predicateNot({ address, blockchain }: TAccountHelperPredicateParams) {
    return (account: TAccountHelperPredicateParams) => address !== account.address || blockchain !== account.blockchain
  }

  static getNextOrderOrMissing(accounts: TAccount[], blockchain: TBlockchainServiceKey) {
    const orders = accounts.filter(account => account.blockchain === blockchain).map(({ order }) => order)

    if (orders.length === 0) return 0

    const maxOrder = Math.max(...orders)

    for (let index = 0; index <= maxOrder; index++) if (!orders.includes(index)) return index

    return maxOrder + 1
  }

  static buildAccountKey({ address, blockchain }: TAccountHelperPredicateParams) {
    return `${address}-${blockchain}`
  }

  static orderAccounts<T extends TAccount = TAccount>(accounts: T[]) {
    return orderBy(
      [...accounts],
      [({ blockchain }) => BlockchainServiceHelper.blockchainNames.indexOf(blockchain), 'order'],
      ['asc', 'asc']
    )
  }
}
