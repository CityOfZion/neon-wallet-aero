import type { TBlockchainServiceKey } from '@shared/types/blockchain'

import { BlockchainServiceHelper } from './BlockchainServiceHelper'

export class TokenHelper {
  static isNativeToken(tokenHash: string, blockchain: TBlockchainServiceKey): boolean {
    const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]

    return service.nativeTokens.some(token => service.tokenService.predicateByHash(tokenHash, token))
  }
}
