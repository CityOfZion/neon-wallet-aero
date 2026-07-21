import { BSKeychainHelper, hasLedger, type TBSAccount } from '@cityofzion/blockchain-service'
import { BSBitcoinConstants } from '@cityofzion/bs-bitcoin'

import { EncryptionHelper } from '@shared/helpers/EncryptionHelper'
import { AppError } from '@shared/helpers/ErrorHelper'
import { I18nextHelper } from '@shared/helpers/I18nextHelper'
import type { TBlockchainServiceKey, TBSAggregator } from '@shared/types/blockchain'
import type { TAccount } from '@shared/types/store'

import { ReduxHelper } from './ReduxHelper'

const { t } = I18nextHelper.get()

export class BlockchainServiceHelper {
  static bsAggregator: TBSAggregator
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

    const [
      { BSAggregator },
      { BSNeo3 },
      { BSNeoLegacy },
      { BSNeoX },
      { BSBitcoin },
      { BSEthereum },
      { BSSolana },
      { BSStellar },
    ] = await Promise.all([
      import('@cityofzion/bs-multichain'),
      import('@cityofzion/bs-neo3'),
      import('@cityofzion/bs-neo-legacy'),
      import('@cityofzion/bs-neox'),
      import('@cityofzion/bs-bitcoin'),
      import('@cityofzion/bs-ethereum'),
      import('@cityofzion/bs-solana'),
      import('@cityofzion/bs-stellar'),
    ])

    const services = await Promise.all([
      Promise.resolve(new BSNeo3(undefined, this.#getHardwareWalletTransport.bind(this))),
      Promise.resolve(new BSNeoLegacy(undefined, this.#getHardwareWalletTransport.bind(this))),
      Promise.resolve(new BSNeoX(undefined, this.#getHardwareWalletTransport.bind(this))),
      Promise.resolve(new BSStellar(undefined, this.#getHardwareWalletTransport.bind(this))),
      Promise.resolve(
        new BSBitcoin(
          import.meta.env.PROD ? undefined : BSBitcoinConstants.TESTNET_NETWORK,
          this.#getHardwareWalletTransport.bind(this)
        )
      ),
      Promise.resolve(new BSSolana(undefined, this.#getHardwareWalletTransport.bind(this))),
      Promise.resolve(new BSEthereum('ethereum', undefined, this.#getHardwareWalletTransport.bind(this))),
      Promise.resolve(new BSEthereum('polygon', undefined, this.#getHardwareWalletTransport.bind(this))),
      Promise.resolve(new BSEthereum('base', undefined, this.#getHardwareWalletTransport.bind(this))),
      Promise.resolve(new BSEthereum('arbitrum', undefined, this.#getHardwareWalletTransport.bind(this))),
    ])

    this.bsAggregator = new BSAggregator(services)
    this.blockchainNames = services.map(service => service.name) as TBlockchainServiceKey[]
  }

  static async getServiceAccount<T extends TBlockchainServiceKey>(account: TAccount<T>): Promise<TBSAccount<T>> {
    if (!account.encryptedKey) {
      throw new AppError(t('common:errors.unexpectedError'))
    }

    const {
      auth: {
        memoryData: { loginSession },
      },
    } = ReduxHelper.store.getState()

    if (!loginSession) {
      throw new AppError(t('common:errors.noLoginSession'))
    }

    const key = await EncryptionHelper.decrypt(account.encryptedKey, loginSession.encryptedPassword)

    const service = this.bsAggregator.blockchainServicesByNameRecord[account.blockchain]

    if (account.type === 'hardware' && hasLedger(service)) {
      const serviceAccount = await service.generateAccountFromPublicKey(key)
      serviceAccount.isHardware = true
      serviceAccount.bipPath = BSKeychainHelper.getBipPath(service.bipDerivationPath, account.order)

      return serviceAccount as TBSAccount<T>
    }

    const serviceAccount = await service.generateAccountFromKey(key)
    return serviceAccount as TBSAccount<T>
  }
}
