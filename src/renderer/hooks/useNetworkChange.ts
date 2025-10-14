import { useLayoutEffect, useRef } from 'react'
import { useMountUnsafe } from '@renderer/hooks/useMountUnsafe'
import { useAllNodes } from '@renderer/hooks/useNodes'
import { useAppDispatch } from '@renderer/hooks/useRedux'
import { useSelectedNetworkByBlockchainSelector } from '@renderer/hooks/useSettingsSelector'
import { bsAggregator } from '@renderer/libs/blockchainService'
import { settingsReducerActions } from '@renderer/store/reducers/SettingsReducer'

export const useNetworkChange = () => {
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()
  const allNodesQuery = useAllNodes()
  const dispatch = useAppDispatch()

  const nodesAlreadyChecked = useRef(false)

  useLayoutEffect(() => {
    Object.values(bsAggregator.blockchainServicesByName).forEach(service => {
      const network = selectedNetworkByBlockchain[service.name]

      service.setNetwork(network)
    })
  }, [selectedNetworkByBlockchain])

  useMountUnsafe(async () => {
    const allNodes = allNodesQuery.data

    if (allNodesQuery.isLoading || !allNodes || nodesAlreadyChecked.current) return

    nodesAlreadyChecked.current = true

    const services = Object.values(bsAggregator.blockchainServicesByName)

    const promises = services.map(async service => {
      const currentNetwork = selectedNetworkByBlockchain[service.name]

      try {
        await service.testNetwork(currentNetwork)

        return
      } catch (error) {
        console.error(error)
      }

      const newNode = allNodes[service.name].find(node => node.latency !== undefined && node.height !== undefined)

      if (!newNode) return

      dispatch(settingsReducerActions.setSelectedNetworkUrl({ blockchain: service.name, url: newNode.url }))
    })

    await Promise.allSettled(promises)
  })
}
