import { createSlice } from '@reduxjs/toolkit'
import { PersistConfig } from 'redux-persist'

import { AVAILABLE_CURRENCIES } from '@/constants/currency'
import { DEFAULT_NETWORK_BY_BLOCKCHAIN, DEFAULT_NETWORK_PROFILE } from '@/constants/networks'
import { reduxPersistStorage } from '@/libs/reduxPersist'
import { ISettingsState } from '@/types/store'

import { settingsSliceReducers } from './reducers'

export interface ISettingsReducer {
  data: ISettingsState
}

const settingsReducerInitialState: ISettingsReducer = {
  data: {
    currency: AVAILABLE_CURRENCIES[0],
    selectedNetworkByBlockchain: DEFAULT_NETWORK_BY_BLOCKCHAIN,
    networkProfiles: [DEFAULT_NETWORK_PROFILE],
    selectedNetworkProfile: DEFAULT_NETWORK_PROFILE,
  },
}

export const settingsReducerConfig: PersistConfig<ISettingsReducer> = {
  key: 'settingsReducer',
  storage: reduxPersistStorage,
}

const settingsSlice = createSlice({
  name: settingsReducerConfig.key,
  initialState: settingsReducerInitialState,
  reducers: settingsSliceReducers,
})

export const settingsReducerActions = settingsSlice.actions
export const settingsReducer = settingsSlice.reducer
