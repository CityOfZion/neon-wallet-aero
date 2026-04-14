import { hasWalletConnect } from '@cityofzion/blockchain-service'
import { WalletKitHelper } from '@cityofzion/bs-multichain'
import { useQuery } from '@tanstack/react-query'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { ReactQueryHelper } from '@renderer/helpers/ReactQueryHelper'

import { rendererApi } from '@shared/message-api/renderer'
import type { TAccount } from '@shared/types/store'

export const buildWalletConnectSessionKey = (account?: TAccount) => {
  const key = ['wallet-connect', 'sessions']

  if (account) {
    key.push(account.id)
  }

  return key
}

export const invalidateWalletConnectSessions = (account?: TAccount) => {
  return ReactQueryHelper.client.invalidateQueries({
    queryKey: buildWalletConnectSessionKey(account),
  })
}

const fetchSessions = async (account: TAccount) => {
  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[account.blockchain]
  if (!hasWalletConnect(service)) return []

  const sessions = await rendererApi.send('wallet-connect:get-sessions')

  return WalletKitHelper.filterSessions(Object.values(sessions), {
    addresses: [account.address],
    chains: [service.walletConnectService.chain],
  })
}

export const useWalletConnectSessionsByAccount = (account: TAccount) => {
  return useQuery({
    queryKey: buildWalletConnectSessionKey(account),
    queryFn: fetchSessions.bind(null, account),
    staleTime: 0,
  })
}
