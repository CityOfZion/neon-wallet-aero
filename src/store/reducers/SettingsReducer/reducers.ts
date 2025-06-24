import { CaseReducer, PayloadAction } from '@reduxjs/toolkit'
import cloneDeep from 'lodash/cloneDeep'

import { TBlockchainServiceKey, TNetwork } from '@/types/blockchain'
import { TLanguage } from '@/types/language'

import { ISettingsReducer } from './index'

const setSelectNetwork = <T extends TBlockchainServiceKey>(
  state: ISettingsReducer,
  action: PayloadAction<{ blockchain: T; network: TNetwork<T> }>
) => {
  const { blockchain, network } = action.payload

  const cloneSelectedNetworkByBlockchain = cloneDeep(state.data.selectedNetworkByBlockchain)
  cloneSelectedNetworkByBlockchain[blockchain] = network as any

  state.data.selectedNetworkByBlockchain = cloneSelectedNetworkByBlockchain
}

const setLanguage: CaseReducer<ISettingsReducer, PayloadAction<TLanguage>> = (state, action) => {
  state.data.language = action.payload
}

export const settingsSliceReducers = {
  setSelectNetwork,
  setLanguage,
}
