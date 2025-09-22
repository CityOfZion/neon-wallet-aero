import { TBlockchainServiceKey } from '@/types/blockchain'
import { TSelectedNetworks } from '@/types/store'

import { useAppSelector } from './useRedux'

export const useSelectedNetworkByBlockchainSelector = () => {
  const { ref, value } = useAppSelector(state => state.settings.data.selectedNetworkByBlockchain)
  return {
    selectedNetworkByBlockchain: value,
    selectedNetworkByBlockchainRef: ref,
  }
}

export const useSelectedNetworkSelector = <T extends TBlockchainServiceKey>(blockchain: T) => {
  const { ref, value } = useAppSelector(
    state => state.settings.data.selectedNetworkByBlockchain[blockchain] as TSelectedNetworks[T]
  )
  return {
    network: value,
    networkRef: ref,
  }
}

export const useCurrencySelector = () => {
  const { ref, value } = useAppSelector(state => state.settings.data.currency)
  return {
    currency: value,
    currencyRef: ref,
  }
}

export const useLanguageSelector = () => {
  const { ref, value } = useAppSelector(state => state.settings.data.language)
  return {
    language: value,
    languageRef: ref,
  }
}
