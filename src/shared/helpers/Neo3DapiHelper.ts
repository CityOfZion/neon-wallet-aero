import { rpc, wallet } from '@cityofzion/neon-core'
import { type Account, DapiNetwork } from '@cityofzion/neon-dapi'

import { ReduxHelper } from '@renderer/helpers/ReduxHelper'

import { AppError } from '@shared/helpers/ErrorHelper'
import type { TNetwork } from '@shared/types/blockchain'
import type { TAccount } from '@shared/types/store'

import { DapiHelper } from './DapiHelper'
import { EncryptionHelper } from './EncryptionHelper'
import { I18nextHelper } from './I18nextHelper'

const { t } = I18nextHelper.get()

export class Neo3DapiHelper {
  static readonly #dapiNetworkByNetworkType: Record<string, DapiNetwork> = {
    mainnet: DapiNetwork.MAINNET,
    testnet: DapiNetwork.TESTNET,
  }

  static async getConnectedDapiAccounts(origin: string): Promise<Account[]> {
    const connectedDapps = await DapiHelper.getConnectedDapps()
    const connectedDapp = connectedDapps[origin]
    if (!connectedDapp) return []

    const account = new wallet.Account(connectedDapp.address)

    return [
      {
        address: account.address,
        hash: account.scriptHash,
        contract: account.contract as Account['contract'],
        extra: null,
        label: account.label,
      },
    ]
  }

  static async getNeonJsAccount(account: TAccount<'neo3'>) {
    const {
      auth: {
        memoryData: { loginSession },
      },
    } = ReduxHelper.store.getState()

    if (!loginSession) {
      throw new AppError(t('common:errors.noLoginSession'))
    }

    const key = await EncryptionHelper.decrypt(account.encryptedKey, loginSession.encryptedPassword)

    return new wallet.Account(key)
  }

  static getDapiNetwork(networkId: TNetwork['type']) {
    const dapiNetwork = this.#dapiNetworkByNetworkType[networkId]
    if (!dapiNetwork) {
      throw new AppError(t('common:errors.unexpectedError'))
    }

    return dapiNetwork
  }

  static async getNeonJsRpcClient(url: string) {
    return new rpc.RPCClient(url)
  }
}
