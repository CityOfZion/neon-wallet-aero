import { hasWalletConnect } from '@cityofzion/blockchain-service'
import { WalletKitHelper } from '@cityofzion/bs-multichain'
import { useQuery } from '@tanstack/react-query'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { ReactQueryHelper } from '@renderer/helpers/ReactQueryHelper'

import { rendererApi } from '@shared/message-api/renderer'
import type { IAccountState } from '@shared/types/store'

export const buildWalletConnectSessionKey = (account?: IAccountState) => {
  const key = ['wallet-connect', 'sessions']

  if (account) {
    key.push(account.id)
  }

  return key
}

export const invalidateWalletConnectSessions = (account?: IAccountState) => {
  return ReactQueryHelper.client.invalidateQueries({
    queryKey: buildWalletConnectSessionKey(account),
  })
}

const fetchSessions = async (account: IAccountState) => {
  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[account.blockchain]
  if (!hasWalletConnect(service)) return []

  const sessions = await rendererApi.send('wallet-connect:get-sessions')

  return WalletKitHelper.filterSessions(Object.values(sessions), {
    addresses: [account.address],
    chains: [service.walletConnectService.chain],
  })
}

export const useWalletConnectSessionsByAccount = (account: IAccountState) => {
  return useQuery({
    queryKey: buildWalletConnectSessionKey(account),
    queryFn: fetchSessions.bind(null, account),
    staleTime: 0,
  })
}
