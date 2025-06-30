import { useAppSelector } from './useRedux'

export const useSelectedNetworkByBlockchainSelector = () => {
  const { ref, value } = useAppSelector(state => state.settings.data.selectedNetworkByBlockchain)
  return {
    selectedNetworkByBlockchain: value,
    selectedNetworkByBlockchainRef: ref,
  }
}

export const useSelectedNetworkProfileSelector = () => {
  const { ref, value } = useAppSelector(state => state.settings.data.selectedNetworkProfile)
  return {
    selectedNetworkProfile: value,
    selectedNetworkProfileRef: ref,
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
