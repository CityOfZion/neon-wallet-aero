import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import type { TExchange } from '@shared/types/query'

import { BlockchainServiceHelper } from './BlockchainServiceHelper'

export class ExchangeHelper {
  static getExchangeConvertedPrice(
    hash: string,
    blockchain: TBlockchainServiceKey,
    multiExchange?: {
      [x: string]: Map<string, TExchange | undefined>
    }
  ): number {
    if (!multiExchange) return 0

    const blockchainExchange = multiExchange[blockchain]
    if (!blockchainExchange) return 0

    const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]

    const exchange = blockchainExchange.get(service.tokenService.normalizeHash(hash))

    return exchange?.convertedPrice ?? 0
  }
}
