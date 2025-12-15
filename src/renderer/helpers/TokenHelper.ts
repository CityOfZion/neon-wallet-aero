import { bsAggregator } from '@renderer/libs/blockchain-service'
import type { TBlockchainServiceKey } from '@shared/types/blockchain'

export class TokenHelper {
  static isNativeToken(tokenHash: string, blockchain: TBlockchainServiceKey): boolean {
    const service = bsAggregator.blockchainServicesByName[blockchain]

    return service.nativeTokens.some(token => service.tokenService.predicateByHash(tokenHash, token))
  }
}
