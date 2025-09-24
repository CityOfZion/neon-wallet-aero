import { createSlice } from '@reduxjs/toolkit'
import { PersistConfig, PURGE } from 'redux-persist'

import { AVAILABLE_CURRENCIES } from '@/constants/currency'
import { DEFAULT_LANGUAGE } from '@/constants/language'
import { DEFAULT_NETWORK_BY_BLOCKCHAIN, DEFAULT_NETWORK_PROFILE } from '@/constants/networks'
import { reduxPersistStorage } from '@/libs/reduxPersist'
import { TLanguage } from '@/types/language'
import { TCurrency, TNetworkProfile, TSelectedNetworks } from '@/types/store'

import { settingsSliceReducers } from './reducers'

export interface ISettingsReducer {
  data: {
    currency: TCurrency
    language: TLanguage
    selectedNetworkByBlockchain: TSelectedNetworks
    networkProfiles: TNetworkProfile[]
    selectedNetworkProfile: TNetworkProfile
  }
}

const settingsReducerInitialState: ISettingsReducer = {
  data: {
    currency: AVAILABLE_CURRENCIES[0],
    language: DEFAULT_LANGUAGE,
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
  extraReducers: builder => {
    builder.addCase(PURGE, state => ({
      ...settingsReducerInitialState,
      data: {
        ...settingsReducerInitialState.data,
        language: state.data.language,
      },
    }))
  },
})

export const settingsReducerActions = settingsSlice.actions
export const settingsReducer = settingsSlice.reducer
