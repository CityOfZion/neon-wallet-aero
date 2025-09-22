import { useEffect, useLayoutEffect, useRef } from 'react'
import i18next from 'i18next'

import { bsAggregator } from '@/libs/blockchainService'
import { authReducerActions } from '@/store/reducers/AuthReducer'
import { settingsReducerActions } from '@/store/reducers/SettingsReducer'

import { useCurrentLoginSessionSelector } from './useAuthSelector'
import { useMountUnsafe } from './useMountUnsafe'
import { useAllNodes } from './useNodes'
import { useAppDispatch } from './useRedux'
import { useLanguageSelector, useSelectedNetworkByBlockchainSelector } from './useSettingsSelector'

const useNetworkChange = () => {
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
        console.error('Error testing network:', error)
      }

      const newNode = allNodes[service.name].find(node => node.latency !== undefined && node.height !== undefined)

      if (!newNode) return

      dispatch(settingsReducerActions.setSelectedNetworkUrl({ blockchain: service.name, url: newNode.url }))
    })

    await Promise.allSettled(promises)
  })
}

const useRemoveTemporaryApplicationData = () => {
  const dispatch = useAppDispatch()
  const { currentLoginSession } = useCurrentLoginSessionSelector()

  useEffect(() => {
    // If the user is logged in, we don't want to reset the temporary application data
    if (currentLoginSession) return

    dispatch(authReducerActions.resetTemporaryApplicationData())
  }, [currentLoginSession, dispatch])
}

const useLanguageChange = () => {
  const { language } = useLanguageSelector()

  useLayoutEffect(() => {
    i18next.changeLanguage(language.value)
  }, [language])
}

export const useBeforeLogin = () => {
  useNetworkChange()
  useLanguageChange()
  useRemoveTemporaryApplicationData()
}
