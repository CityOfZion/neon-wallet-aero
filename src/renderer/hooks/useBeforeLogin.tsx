import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { BackgroundHelper } from '@renderer/helpers/BackgroundHelper'
import { TabsHelper } from '@renderer/helpers/TabsHelper'
import { bsAggregator } from '@renderer/libs/blockchainService'
import { authReducerActions } from '@renderer/store/reducers/AuthReducer'
import { settingsReducerActions } from '@renderer/store/reducers/SettingsReducer'
import { TBackgroundGetLoginSessionMessage, TBackgroundGetLoginSessionResponse } from '@shared/types/background-events'
import i18next from 'i18next'

import { useLoginSessionSelector } from './useAuthSelector'
import { useMountUnsafe } from './useMountUnsafe'
import { useAllNodes } from './useNodes'
import { useAppDispatch } from './useRedux'
import { useLanguageSelector, useSelectedNetworkByBlockchainSelector } from './useSettingsSelector'

const useGetLoginSessionFromWorker = () => {
  const dispatch = useAppDispatch()
  const { loginSessionRef } = useLoginSessionSelector()

  useLayoutEffect(() => {
    if (loginSessionRef.current) return

    const get = async () => {
      const response = await BackgroundHelper.send<
        TBackgroundGetLoginSessionMessage,
        TBackgroundGetLoginSessionResponse
      >({
        type: 'get-login-session',
      })

      dispatch(authReducerActions.setLoginSession(response.loginSession))
    }

    get()
  }, [dispatch, loginSessionRef])
}

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
  const { loginSession } = useLoginSessionSelector()
  const { pathname } = useLocation()

  useEffect(() => {
    // If the user is logging in or logged in, we don't want to reset the temporary application data
    if (loginSession || pathname === '/splash' || pathname === '/' || TabsHelper.isInTab(window.location.href)) return

    dispatch(authReducerActions.resetTemporaryApplicationData())
  }, [loginSession, dispatch, pathname])
}

const useLanguageChange = () => {
  const { language } = useLanguageSelector()

  useLayoutEffect(() => {
    i18next.changeLanguage(language.value)
  }, [language])
}

export const useBeforeLogin = () => {
  useGetLoginSessionFromWorker()
  useNetworkChange()
  useLanguageChange()
  useRemoveTemporaryApplicationData()
}
