import type { CaseReducer, PayloadAction } from '@reduxjs/toolkit'
import cloneDeep from 'lodash/cloneDeep'

import type { TBlockchainServiceKey, TNetwork } from '@shared/types/blockchain'
import type { TAccount, TCurrency, TLanguage, TSelectedNetworks, TWallet } from '@shared/types/store'

import type { TSettingsReducer } from './index'

const setSelectedNetworkByBlockchain: CaseReducer<TSettingsReducer, PayloadAction<TSelectedNetworks>> = (
  state,
  action
) => {
  state.data.selectedNetworkByBlockchain = action.payload
}

const setSelectedNetwork = <T extends TBlockchainServiceKey>(
  state: TSettingsReducer,
  action: PayloadAction<{ blockchain: T; network: TNetwork }>
) => {
  const { blockchain, network } = action.payload

  const cloneSelectedNetworkByBlockchain = cloneDeep(state.data.selectedNetworkByBlockchain)
  cloneSelectedNetworkByBlockchain[blockchain] = network as any

  state.data.selectedNetworkByBlockchain = cloneSelectedNetworkByBlockchain
}

const setSelectedNetworkUrl: CaseReducer<
  TSettingsReducer,
  PayloadAction<{ blockchain: TBlockchainServiceKey; url: string; isAutomatic?: boolean }>
> = (state, action) => {
  const { blockchain, url, isAutomatic } = action.payload

  const cloneSelectedNetworkByBlockchain = cloneDeep(state.data.selectedNetworkByBlockchain)
  cloneSelectedNetworkByBlockchain[blockchain].url = url
  cloneSelectedNetworkByBlockchain[blockchain].isAutomatic = isAutomatic

  state.data.selectedNetworkByBlockchain = cloneSelectedNetworkByBlockchain
}

const setLanguage: CaseReducer<TSettingsReducer, PayloadAction<TLanguage>> = (state, action) => {
  state.data.language = action.payload
}

const setCurrency: CaseReducer<TSettingsReducer, PayloadAction<TCurrency>> = (state, action) => {
  state.data.currency = action.payload
}

const setSelectedWallet: CaseReducer<TSettingsReducer, PayloadAction<TWallet | undefined>> = (state, action) => {
  state.data.selectedWallet = action.payload
}

const setSelectedAccount: CaseReducer<TSettingsReducer, PayloadAction<TAccount | undefined>> = (state, action) => {
  state.data.selectedAccount = action.payload
}

export const settingsSliceReducers = {
  setLanguage,
  setCurrency,
  setSelectedNetwork,
  setSelectedNetworkUrl,
  setSelectedNetworkByBlockchain,
  setSelectedWallet,
  setSelectedAccount,
}
