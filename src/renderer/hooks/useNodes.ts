import { useCallback } from 'react'

import type { TBSNetworkId } from '@cityofzion/blockchain-service'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import type { TBaseOptions, TNode } from '@shared/types/query'

import { useSelectedNetworkByBlockchainSelector, useSelectedNetworkSelector } from './useSettingsSelector'

// TODO: rename to ping networks in the Bitcoin issue
const buildNodesQueryKey = (blockchain: TBlockchainServiceKey, id: TBSNetworkId) => {
  return ['ping-networks', blockchain, id]
}

const pingNodes = async (blockchain: TBlockchainServiceKey): Promise<TNode[]> => {
  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]

  const promises = service.rpcNetworkUrls.map(async url => {
    try {
      return await service.pingNode(url)
    } catch {
      return { height: undefined, latency: undefined, url }
    }
  })

  const data = await Promise.all(promises)

  return data.sort((a, b) => {
    const latencyA = a.latency
    const latencyB = b.latency
    const isLatencyAInvalid = typeof latencyA !== 'number' || isNaN(latencyA)
    const isLatencyBInvalid = typeof latencyB !== 'number' || isNaN(latencyB)

    if (isLatencyAInvalid && isLatencyBInvalid) return 0
    if (isLatencyAInvalid) return 1
    if (isLatencyBInvalid) return -1

    return latencyA - latencyB
  })
}

export const usePingNodes = (blockchain: TBlockchainServiceKey, queryOptions?: TBaseOptions<TNode[]>) => {
  const { network } = useSelectedNetworkSelector(blockchain)

  return useQuery({
    queryKey: buildNodesQueryKey(blockchain, network.id),
    queryFn: pingNodes.bind(null, blockchain),
    ...queryOptions,
  })
}

export const useLazyPingNodes = () => {
  const queryClient = useQueryClient()
  const { selectedNetworkByBlockchainRef } = useSelectedNetworkByBlockchainSelector()

  const getPingNodes = useCallback(
    async (blockchain: TBlockchainServiceKey) => {
      const selectedNetwork = selectedNetworkByBlockchainRef.current[blockchain]

      return await queryClient.ensureQueryData({
        queryKey: buildNodesQueryKey(blockchain, selectedNetwork.id),
        queryFn: pingNodes.bind(null, blockchain),
        staleTime: 0,
      })
    },
    [queryClient, selectedNetworkByBlockchainRef]
  )

  return { getPingNodes }
}
