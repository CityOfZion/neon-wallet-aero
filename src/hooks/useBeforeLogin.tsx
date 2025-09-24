import { useEffect, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import i18next from 'i18next'

import { PageHelper } from '@/helpers/PageHelper'
import { WorkerHelper } from '@/helpers/WorkerHelper'
import { bsAggregator } from '@/libs/blockchainService'
import { authReducerActions } from '@/store/reducers/AuthReducer'
import { settingsReducerActions } from '@/store/reducers/SettingsReducer'
import { TBlockchainServiceKey } from '@/types/blockchain'
import { TWorkerGetLoginSessionMessage, TWorkerGetLoginSessionResponse } from '@/types/worker-events'

import { useLoginSessionSelector } from './useAuthSelector'
import { useAppDispatch } from './useRedux'
import {
  useLanguageSelector,
  useSelectedNetworkByBlockchainSelector,
  useSelectedNetworkProfileSelector,
} from './useSettingsSelector'

const useGetLoginSessionFromWorker = () => {
  const dispatch = useAppDispatch()
  const { loginSessionRef } = useLoginSessionSelector()

  useLayoutEffect(() => {
    if (loginSessionRef.current) return

    const get = async () => {
      const response = await WorkerHelper.send<TWorkerGetLoginSessionMessage, TWorkerGetLoginSessionResponse>({
        type: 'get-login-session',
      })

      if (response !== undefined) dispatch(authReducerActions.setLoginSession(response.loginSession))
    }

    get()
  }, [dispatch, loginSessionRef])
}

const useNetworkChange = () => {
  const { selectedNetworkProfile } = useSelectedNetworkProfileSelector()
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()
  const dispatch = useAppDispatch()

  useLayoutEffect(() => {
    Object.values(bsAggregator.blockchainServicesByName).forEach(service => {
      const network = selectedNetworkByBlockchain[service.name]

      service.setNetwork(network)
    })
  }, [selectedNetworkByBlockchain])

  useLayoutEffect(() => {
    Object.entries(selectedNetworkProfile.networkByBlockchain).forEach(([blockchain, network]) => {
      dispatch(settingsReducerActions.setSelectNetwork({ blockchain: blockchain as TBlockchainServiceKey, network }))
    })
  }, [dispatch, selectedNetworkProfile.networkByBlockchain])
}

const useRemoveTemporaryApplicationData = () => {
  const dispatch = useAppDispatch()
  const { loginSession } = useLoginSessionSelector()
  const { pathname } = useLocation()

  useEffect(() => {
    // If the user is logging in or logged in, we don't want to reset the temporary application data
    if (loginSession || pathname === '/splash' || pathname === '/' || PageHelper.isAtInternalPage(window.location.href))
      return

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
