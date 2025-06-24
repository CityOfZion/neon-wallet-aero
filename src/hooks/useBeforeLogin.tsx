import { useLayoutEffect } from 'react'
import i18next from 'i18next'

import { bsAggregator } from '@/libs/blockchainService'
import { settingsReducerActions } from '@/store/reducers/SettingsReducer'
import { TBlockchainServiceKey } from '@/types/blockchain'

import { useAppDispatch } from './useRedux'
import {
  useLanguageSelector,
  useSelectedNetworkByBlockchainSelector,
  useSelectedNetworkProfileSelector,
} from './useSettingsSelector'

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

const useLanguageChange = () => {
  const { language } = useLanguageSelector()

  useLayoutEffect(() => {
    i18next.changeLanguage(language.value)
  }, [language])
}

export const useBeforeLogin = () => {
  useNetworkChange()
  useLanguageChange()
}
