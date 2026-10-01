import type { TSwapToken } from '@cityofzion/blockchain-service'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'

import { BlockchainServiceHelper } from './BlockchainServiceHelper'

export class TokenHelper {
  static getKey(tokenHash: string, blockchain: TBlockchainServiceKey): string {
    const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]
    const normalizedTokenHash = service.tokenService.normalizeHash(tokenHash)

    return `${normalizedTokenHash}-${blockchain}`
  }

  static isNonNativeStellarToken(token: TSwapToken<TBlockchainServiceKey>): token is TSwapToken<'stellar'> {
    const stellarService = BlockchainServiceHelper.bsAggregator.blockchainServicesByName.stellar

    return token.blockchain === 'stellar' && !!token.hash && !stellarService.tokenService.isNativeToken(token.hash)
  }
}
