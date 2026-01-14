import type { TBSAccount } from '@cityofzion/blockchain-service'
import type { BSAggregator } from '@cityofzion/bs-multichain'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'

import { AppError } from './ErrorHelper'
import { I18nextHelper } from './I18nextHelper'

const { t } = I18nextHelper.get()

export class BlockchainServiceHelper {
  static bsAggregator: BSAggregator<TBlockchainServiceKey>
  static blockchainNames: TBlockchainServiceKey[]

  static async #getHardwareWalletTransport(account: TBSAccount<TBlockchainServiceKey>) {
    try {
      // Dynamically import to avoid circular dependency
      const { HardwareWalletHelper } = await import('./HardwareWalletHelper')
      return await HardwareWalletHelper.ensureConnection(account)
    } catch (error) {
      throw new AppError(t('hardwareWallet.errors.hardwareWalletIsNotConnectOrUnlocked'), error)
    }
  }

  static doesBlockchainSupported(blockchain: string): blockchain is TBlockchainServiceKey {
    return Object.prototype.hasOwnProperty.call(this.bsAggregator.blockchainServicesByName, blockchain)
  }

  static async setup() {
    if (this.bsAggregator) return

    const [{ BSAggregator }, { BSNeo3 }, { BSNeoLegacy }, { BSNeoX }, { BSEthereum }] = await Promise.all([
      import('@cityofzion/bs-multichain'),
      import('@cityofzion/bs-neo3'),
      import('@cityofzion/bs-neo-legacy'),
      import('@cityofzion/bs-neox'),
      import('@cityofzion/bs-ethereum'),
    ])

    const services = await Promise.all([
      Promise.resolve(new BSNeo3('neo3', undefined, this.#getHardwareWalletTransport.bind(this))),
      Promise.resolve(new BSNeoLegacy('neoLegacy', undefined, this.#getHardwareWalletTransport.bind(this))),
      Promise.resolve(new BSNeoX('neox', undefined, this.#getHardwareWalletTransport.bind(this))),
      Promise.resolve(new BSEthereum('ethereum', 'ethereum', undefined, this.#getHardwareWalletTransport.bind(this))),
      Promise.resolve(new BSEthereum('polygon', 'polygon', undefined, this.#getHardwareWalletTransport.bind(this))),
      Promise.resolve(new BSEthereum('base', 'base', undefined, this.#getHardwareWalletTransport.bind(this))),
      Promise.resolve(new BSEthereum('arbitrum', 'arbitrum', undefined, this.#getHardwareWalletTransport.bind(this))),
    ])

    this.bsAggregator = new BSAggregator(services)
    this.blockchainNames = services.map(service => service.name) as TBlockchainServiceKey[]
  }
}
