import { BSAggregator } from '@cityofzion/blockchain-service'
import { BSEthereum } from '@cityofzion/bs-ethereum'
import { BSNeoLegacy } from '@cityofzion/bs-neo-legacy'
import { BSNeo3 } from '@cityofzion/bs-neo3'
import { BSNeoX } from '@cityofzion/bs-neox'

import { TBlockchainServiceKey } from '@/types/blockchain'

export const bsAggregator = new BSAggregator<TBlockchainServiceKey>([
  new BSNeo3('neo3'),
  new BSNeoLegacy('neoLegacy'),
  new BSEthereum('ethereum'),
  new BSNeoX('neox'),
  new BSEthereum('polygon'),
  new BSEthereum('base'),
  new BSEthereum('arbitrum'),
])

export const blockchainNames = Object.values(bsAggregator.blockchainServicesByName).map(({ name }) => name)

export const isValidBlockchainKey = (blockchain: string): blockchain is TBlockchainServiceKey =>
  blockchainNames.includes(blockchain as TBlockchainServiceKey)
