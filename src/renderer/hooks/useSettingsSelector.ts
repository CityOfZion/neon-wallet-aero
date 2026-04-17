import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import type { TSelectedNetworks } from '@shared/types/store'

import { useAppSelector } from './useRedux'

export const useSelectedNetworkByBlockchainSelector = () => {
  const { value, ref } = useAppSelector(state => state.settings.data.selectedNetworkByBlockchain)

  return {
    selectedNetworkByBlockchain: value,
    selectedNetworkByBlockchainRef: ref,
  }
}

export const useSelectedNetworkSelector = <T extends TBlockchainServiceKey>(blockchain: T) => {
  const { value, ref } = useAppSelector(
    state => state.settings.data.selectedNetworkByBlockchain[blockchain] as TSelectedNetworks[T]
  )

  return {
    network: value,
    networkRef: ref,
  }
}

export const useCurrencySelector = () => {
  const { value, ref } = useAppSelector(state => state.settings.data.currency)

  return {
    currency: value,
    currencyRef: ref,
  }
}

export const useLanguageSelector = () => {
  const { value, ref } = useAppSelector(state => state.settings.data.language)

  return {
    language: value,
    languageRef: ref,
  }
}

export const useSelectedWalletSelector = () => {
  const { value, ref } = useAppSelector(state => state.settings.data.selectedWallet)

  return {
    selectedWallet: value,
    selectedWalletRef: ref,
  }
}

export const useSelectedAccountSelector = () => {
  const { value, ref } = useAppSelector(state => state.settings.data.selectedAccount)

  return {
    selectedAccount: value,
    selectedAccountRef: ref,
  }
}

export const useShowNewsModalSelector = () => {
  const { ref, value } = useAppSelector(state => state.settings.data.showNewsModal)

  return { showNewsModal: value, showNewsModalRef: ref }
}
