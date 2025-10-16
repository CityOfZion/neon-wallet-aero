import type { CaseReducer, PayloadAction } from '@reduxjs/toolkit'
import cloneDeep from 'lodash/cloneDeep'

import type { TBlockchainServiceKey, TNetwork } from '@shared/types/blockchain'
import type { TLanguage, TSelectedNetworks } from '@shared/types/store'

import type { ISettingsReducer } from './index'

const setSelectedNetworkByBlockchain: CaseReducer<ISettingsReducer, PayloadAction<TSelectedNetworks>> = (
  state,
  action
) => {
  state.data.selectedNetworkByBlockchain = action.payload
}

const setSelectedNetwork = <T extends TBlockchainServiceKey>(
  state: ISettingsReducer,
  action: PayloadAction<{ blockchain: T; network: TNetwork }>
) => {
  const { blockchain, network } = action.payload

  const cloneSelectedNetworkByBlockchain = cloneDeep(state.data.selectedNetworkByBlockchain)
  cloneSelectedNetworkByBlockchain[blockchain] = network as any

  state.data.selectedNetworkByBlockchain = cloneSelectedNetworkByBlockchain
}

const setSelectedNetworkUrl: CaseReducer<
  ISettingsReducer,
  PayloadAction<{ blockchain: TBlockchainServiceKey; url: string; isAutomatic?: boolean }>
> = (state, action) => {
  const { blockchain, url, isAutomatic } = action.payload

  const cloneSelectedNetworkByBlockchain = cloneDeep(state.data.selectedNetworkByBlockchain)
  cloneSelectedNetworkByBlockchain[blockchain].url = url
  cloneSelectedNetworkByBlockchain[blockchain].isAutomatic = isAutomatic

  state.data.selectedNetworkByBlockchain = cloneSelectedNetworkByBlockchain
}

const setLanguage: CaseReducer<ISettingsReducer, PayloadAction<TLanguage>> = (state, action) => {
  state.data.language = action.payload
}

export const settingsSliceReducers = {
  setSelectedNetwork,
  setLanguage,
  setSelectedNetworkUrl,
  setSelectedNetworkByBlockchain,
}
