import {
  AbstractWalletConnectEIP155Adapter,
  AbstractWalletConnectNeonAdapter,
  TAdapterMethodParam,
  TInitOptions,
} from '@cityofzion/wallet-connect-sdk-wallet-core'

import { COZ_LINK } from '@/constants/links'
import { WalletConnectHelper } from '@/helpers/WalletConnectHelper'

import { getI18next } from './i18next'

const { t } = getI18next()

class WalletConnectNeonAdapter extends AbstractWalletConnectNeonAdapter {
  async getWalletInfo(param: TAdapterMethodParam): Promise<any> {
    const { account } = await WalletConnectHelper.getAccount(param)
    return {
      isLedger: account.type === 'hardware',
    }
  }

  async getAccountString(params: TAdapterMethodParam): Promise<string> {
    return await WalletConnectHelper.getAccountString(params)
  }

  async getRPCUrl(params: TAdapterMethodParam): Promise<string> {
    return await WalletConnectHelper.getRPCUrl(params)
  }

  async getSigningCallback() {
    // TODO: Implement this function when hardware wallet support is added
    return undefined
  }
}

class WalletConnectEIP155Adapter extends AbstractWalletConnectEIP155Adapter {
  async getAccountString(params: TAdapterMethodParam): Promise<string> {
    return await WalletConnectHelper.getAccountString(params)
  }

  async getRPCUrl(params: TAdapterMethodParam): Promise<string> {
    return await WalletConnectHelper.getRPCUrl(params)
  }

  async getCustomSigner() {
    // TODO: Implement this function when hardware wallet support is added
    return undefined
  }
}

export const walletConnectNeonAdapter = new WalletConnectNeonAdapter()
export const walletConnectEIP155Adapter = new WalletConnectEIP155Adapter()

export const walletConnectOptions: TInitOptions = {
  clientOptions: {
    core: {
      projectId: '31bee1bce685377492bb0b03cbd3a69c',
      relayUrl: 'wss://relay.walletconnect.com',
      logger: import.meta.env.DEV ? 'error' : 'silent',
    },
    metadata: {
      name: t('common:walletConnect.name'),
      description: t('common:walletConnect.description'),
      url: COZ_LINK,
      icons: [
        'https://raw.githubusercontent.com/CityOfZion/visual-identity/develop/_CoZ%20Branding/_Logo/_Logo%20icon/_PNG%20200x178px/CoZ_Icon_DARKBLUE_200x178px.png',
      ],
    },
    signConfig: {
      disableRequestQueue: true,
    },
  },
  blockchains: {
    neo3: {
      methods: [
        'invokeFunction',
        'testInvoke',
        'signMessage',
        'verifyMessage',
        'getWalletInfo',
        'traverseIterator',
        'getNetworkVersion',
        'encrypt',
        'decrypt',
        'decryptFromArray',
        'calculateFee',
        'signTransaction',
        'wipeRequests',
      ],
      autoAcceptMethods: [
        'testInvoke',
        'getWalletInfo',
        'traverseIterator',
        'getNetworkVersion',
        'calculateFee',
        'wipeRequests',
      ],
      adapter: walletConnectNeonAdapter,
    },
    eip155: {
      methods: [
        'personal_sign',
        'eth_sign',
        'eth_signTransaction',
        'eth_signTypedData',
        'eth_signTypedData_v3',
        'eth_signTypedData_v4',
        'eth_sendTransaction',
        'eth_call',
        'eth_requestAccounts',
        'eth_sendRawTransaction',
        'eth_addEthereumChain',
        'eth_switchEthereumChain',
        'wallet_switchEthereumChain',
        'wallet_getPermissions',
        'wallet_requestPermissions',
        'wallet_addEthereumChain',
      ],
      autoAcceptMethods: [
        'eth_requestAccounts',
        'eth_addEthereumChain',
        'eth_switchEthereumChain',
        'wallet_switchEthereumChain',
        'wallet_getPermissions',
        'wallet_requestPermissions',
        'wallet_addEthereumChain',
      ],
      events: ['chainChanged', 'accountsChanged', 'disconnect', 'connect'],
      adapter: walletConnectEIP155Adapter,
    },
  },
}
