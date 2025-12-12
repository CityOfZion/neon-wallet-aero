import type { TBSAccount } from '@cityofzion/blockchain-service'
import type { BSAggregator as BSAggregatorType } from '@cityofzion/bs-multichain'

import { AppError } from '@renderer/helpers/ErrorHelper'
import { HardwareWalletHelper } from '@renderer/helpers/HardwareWalletHelper'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'

import { getI18next } from './i18next'

export let bsAggregator: BSAggregatorType<TBlockchainServiceKey>
export let blockchainNames: TBlockchainServiceKey[]

const { t } = getI18next()

async function getHardwareWalletTransport(account: TBSAccount<TBlockchainServiceKey>) {
  try {
    return await HardwareWalletHelper.ensureConnection(account)
  } catch (error) {
    throw new AppError(t('hardwareWallet.errors.hardwareWalletIsNotConnectOrUnlocked'), error)
  }
}

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
    Promise.resolve(new BSNeo3('neo3', undefined, getHardwareWalletTransport)),
    Promise.resolve(new BSNeoLegacy('neoLegacy', undefined, getHardwareWalletTransport)),
    Promise.resolve(new BSNeoX('neox', undefined, getHardwareWalletTransport)),
    Promise.resolve(new BSEthereum('ethereum', 'ethereum', undefined, getHardwareWalletTransport)),
    Promise.resolve(new BSEthereum('polygon', 'polygon', undefined, getHardwareWalletTransport)),
    Promise.resolve(new BSEthereum('base', 'base', undefined, getHardwareWalletTransport)),
    Promise.resolve(new BSEthereum('arbitrum', 'arbitrum', undefined, getHardwareWalletTransport)),
  ])

  bsAggregator = new BSAggregator(services)
  blockchainNames = Object.values(services).map(service => service.name)
}

export function doesBlockchainSupported(blockchain: string): blockchain is TBlockchainServiceKey {
  return blockchainNames.includes(blockchain as TBlockchainServiceKey)
}
