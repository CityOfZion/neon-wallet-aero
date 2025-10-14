import {
  TAdapterMethodParam,
  TSession,
  TSessionProposal,
  WalletConnectTypes,
} from '@cityofzion/wallet-connect-sdk-wallet-react'
import { RootStore } from '@renderer/store/RootStore'
import { NETWORK_OPTIONS_BY_BLOCKCHAIN } from '@shared/constants/networks'
import { TBlockchainServiceKey, TNetwork } from '@shared/types/blockchain'
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

  static supportedChainIds = (Object.keys(this.supportedBlockchains) as TBlockchainServiceKey[]).reduce(
    (acc, key) => {
      const networks = NETWORK_OPTIONS_BY_BLOCKCHAIN[key].all

      const customChainId = this.customChainId[key]

      const chainIds = networks.map(({ id }) => id)
      if (customChainId) chainIds.push(customChainId)

      acc[key] = chainIds.map(id => `${this.supportedBlockchains[key]}:${id}`)

      return acc
    },
    {} as Partial<Record<TBlockchainServiceKey, string[]>>
  )

  static getAccountInformationFromSession(session: TSession): TWalletConnectHelperSessionInformation {
    const namespaces = Object.values(session.namespaces)[0]
    if (!namespaces) throw new Error('Namespaces not found')

    const accounts = namespaces.accounts
    if (!accounts) throw new Error('Accounts not found')

    const account = accounts[0]
    const methods = namespaces.methods
    const [sessionBlockchain, sessionNetwork, sessionAddress] = account.split(':')

    const chainId = `${sessionBlockchain}:${sessionNetwork}`

    let blockchain: TBlockchainServiceKey | undefined
    let network: TNetwork<TBlockchainServiceKey> | undefined

    for (const supportedChainIds of Object.entries(this.supportedChainIds)) {
      const [key, chainIds] = supportedChainIds

      if (chainIds.includes(chainId)) {
        const splitChainId = chainId.split(':')
        blockchain = key as TBlockchainServiceKey

        const networkId = splitChainId[1]
        network = NETWORK_OPTIONS_BY_BLOCKCHAIN[blockchain].all.find(({ id }) => id === networkId)
        break
      }
    }

    if (!blockchain || !network) throw new Error('Chain not supported')

    return {
      address: sessionAddress,
      blockchain,
      network,
      methods,
    }
  }

  static getInformationFromProposal(
    proposal: TSessionProposal,
    account: IAccountState
  ): TWalletConnectHelperProposalInformation[] {
    let namespaces: WalletConnectTypes.ProposalTypes.BaseRequiredNamespace[]
    const requiredNamespaces = Object.values(proposal.params.requiredNamespaces)

    if (requiredNamespaces.length !== 0) {
      namespaces = requiredNamespaces
    } else {
      namespaces = Object.values(proposal.params.optionalNamespaces)
    }

    const blockchainSupportedChains = this.supportedChainIds[account.blockchain]

    if (!blockchainSupportedChains) return []

    const proposalInformation: TWalletConnectHelperProposalInformation[] = []

    for (const namespace of namespaces) {
      try {
        const namespaceChains = namespace.chains
        if (!namespaceChains) continue

        for (const chain of namespaceChains) {
          if (!blockchainSupportedChains.includes(chain)) continue

          const splitChainId = chain.split(':')
          const networkId = splitChainId[1]
          const blockchain = account.blockchain
          const network = NETWORK_OPTIONS_BY_BLOCKCHAIN[blockchain].all.find(({ id }) => id === networkId)

          if (!network) continue

          proposalInformation.push({
            blockchain,
            network,
            chain,
            methods: namespace?.methods ?? [],
            proposalBlockchain: splitChainId[0],
          })
        }
      } catch {
        /* empty */
      }
    }

    return proposalInformation
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
