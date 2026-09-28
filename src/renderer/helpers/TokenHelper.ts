import type { TBlockchainServiceKey } from '@shared/types/blockchain'

import { BlockchainServiceHelper } from './BlockchainServiceHelper'

export class TokenHelper {
  static getKey(tokenHash: string, blockchain: TBlockchainServiceKey): string {
    const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]
    const normalizedTokenHash = service.tokenService.normalizeHash(tokenHash)

    return `${normalizedTokenHash}-${blockchain}`
  }
}
