import { TAdapterMethodParam, TSession, TSessionProposal } from '@cityofzion/wallet-connect-sdk-wallet-react'
import { bsAggregator } from '@renderer/libs/blockchainService'
import { RootStore } from '@renderer/store/RootStore'
import { TBlockchainServiceKey } from '@shared/types/blockchain'
import { TWalletConnectHelperProposalInformation, TWalletConnectHelperSessionInformation } from '@shared/types/helpers'
import { IAccountState } from '@shared/types/store'

import { AccountHelper } from './AccountHelper'
import { EncryptionHelper } from './EncryptionHelper'

export abstract class WalletConnectHelper {
  static customChainId: Partial<Record<TBlockchainServiceKey, string>> = {
    neo3: 'private',
  }

  static supportedBlockchains: Partial<Record<TBlockchainServiceKey, string>> = {
    neo3: 'neo3',
    ethereum: 'eip155',
    neox: 'eip155',
    polygon: 'eip155',
    base: 'eip155',
    arbitrum: 'eip155',
  }

  static get supportedChainIds() {
    return (Object.keys(this.supportedBlockchains) as TBlockchainServiceKey[]).reduce(
      (acc, key) => {
        const service = bsAggregator.blockchainServicesByName[key]

        acc[key] = service.availableNetworks.map(({ id }) => `${this.supportedBlockchains[key]}:${id}`)

        return acc
      },
      {} as Partial<Record<TBlockchainServiceKey, string[]>>
    )
  }

  static getAccountInformationFromSession(_session: TSession): TWalletConnectHelperSessionInformation {
    // TODO: It will be removed in the wallet connect implementation
    throw new Error('Not implemented')
  }

  static getInformationFromProposal(
    _proposal: TSessionProposal,
    _account: IAccountState
  ): TWalletConnectHelperProposalInformation[] {
    // TODO: It will be removed in the wallet connect implementation
    throw new Error('Not implemented')
  }

  static isValidURI(uri: string) {
    return /^wc:.+@\d.*$/g.test(uri)
  }

  static async getAccount({ session }: TAdapterMethodParam) {
    const {
      auth: {
        inMemoryData: { loginSession },
        data,
      },
    } = RootStore.store.getState()

    if (!loginSession) throw new Error('Login session not found')

    const info = WalletConnectHelper.getAccountInformationFromSession(session)

    let account: IAccountState | undefined

    const applicationData = data.applicationDataByLoginType[loginSession.type]

    for (const wallet of applicationData.wallets) {
      account = wallet.accounts.find(AccountHelper.predicate(info))
      if (account) break
    }

    if (!account || !account.encryptedKey) throw new Error('Account not found')

    const key = await EncryptionHelper.decrypt(account.encryptedKey, loginSession.encryptedPassword)
    if (!key) throw new Error('Key not found')

    return { account, key }
  }

  static async getAccountString(args: TAdapterMethodParam): Promise<string> {
    const { key } = await this.getAccount(args)

    return key
  }

  static async getRPCUrl({ session }: TAdapterMethodParam): Promise<string> {
    const {
      settings: {
        data: { selectedNetworkByBlockchain },
      },
    } = RootStore.store.getState()

    const { blockchain } = WalletConnectHelper.getAccountInformationFromSession(session)

    return selectedNetworkByBlockchain[blockchain].url
  }
}
