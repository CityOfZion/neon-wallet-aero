import { bsAggregator } from '@renderer/libs/blockchainService'
import { TBlockchainServiceKey, TNetwork } from '@shared/types/blockchain'
import { TNode } from '@shared/types/query'
import { useQueries, useQuery } from '@tanstack/react-query'

import { useSelectedNetworkByBlockchainSelector, useSelectedNetworkSelector } from './useSettingsSelector'

function buildNodesQueryKey(blockchain: TBlockchainServiceKey, network?: TNetwork<TBlockchainServiceKey>) {
  const key: any[] = ['nodes', blockchain]

  if (network) {
    key.push(network)
  }

  return key
}

export const useNodes = (blockchain: TBlockchainServiceKey) => {
  const { network } = useSelectedNetworkSelector(blockchain)

  return useQuery({
    queryKey: buildNodesQueryKey(blockchain, network),
    queryFn: fetchNodes.bind(null, blockchain, network),
    staleTime: 0,
  })
}

const fetchNodes = async (blockchain: TBlockchainServiceKey, selectedNetwork: TNetwork<TBlockchainServiceKey>) => {
  const service = bsAggregator.blockchainServicesByName[blockchain]
  const nodes = (await service.blockchainDataService.getRpcList()) as TNode[]

  if (!nodes.find(({ url }) => url === selectedNetwork.url)) nodes.unshift({ url: selectedNetwork.url })

  return {
    nodes,
    blockchain,
  }
}

export const useAllNodes = () => {
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()

  return useQueries({
    queries: Object.entries(selectedNetworkByBlockchain).map(([blockchain, network]) => {
      return {
        queryKey: buildNodesQueryKey(blockchain as TBlockchainServiceKey, network),
        queryFn: fetchNodes.bind(null, blockchain as TBlockchainServiceKey, network),
        staleTime: 0,
      }
    }),
    combine: results => {
      const isLoading = results.some(result => result.isLoading)

      let data: Record<TBlockchainServiceKey, TNode[]> | undefined

      if (!isLoading) {
        data = results.reduce(
          (nodesByBlockchain, result) => {
            if (result.data) {
              const { nodes, blockchain } = result.data
              nodesByBlockchain[blockchain] = nodes
            }

            return nodesByBlockchain
          },
          {} as Record<TBlockchainServiceKey, TNode[]>
        )
      }

      return {
        isLoading,
        data,
      }
    },
  })
}
