import type { BSAggregator as BSAggregatorType } from '@cityofzion/bs-multichain'
import { TBlockchainServiceKey } from '@shared/types/blockchain'

export let bsAggregator: BSAggregatorType<TBlockchainServiceKey>
export let blockchainNames: TBlockchainServiceKey[]

export async function setupBsAggregator() {
  if (bsAggregator) return

  const [{ BSAggregator }, { BSNeo3 }, { BSNeoLegacy }, { BSNeoX }, { BSEthereum }] = await Promise.all([
    import('@cityofzion/bs-multichain'),
    import('@cityofzion/bs-neo3'),
    import('@cityofzion/bs-neo-legacy'),
    import('@cityofzion/bs-neox'),
    import('@cityofzion/bs-ethereum'),
  ])

  const services = await Promise.all([
    Promise.resolve(new BSNeo3('neo3')),
    Promise.resolve(new BSNeoLegacy('neoLegacy')),
    Promise.resolve(new BSNeoX('neox')),
    Promise.resolve(new BSEthereum('ethereum', 'ethereum')),
    Promise.resolve(new BSEthereum('polygon', 'polygon')),
    Promise.resolve(new BSEthereum('base', 'base')),
    Promise.resolve(new BSEthereum('arbitrum', 'arbitrum')),
  ])

  bsAggregator = new BSAggregator(services)
  blockchainNames = Object.values(services).map(service => service.name)
}

export function doesBlockchainSupported(blockchain: string): blockchain is TBlockchainServiceKey {
  return blockchainNames.includes(blockchain as TBlockchainServiceKey)
}
