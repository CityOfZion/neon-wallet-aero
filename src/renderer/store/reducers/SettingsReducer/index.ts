import { createSlice } from '@reduxjs/toolkit'
import { reduxPersistStorage } from '@renderer/libs/reduxPersist'
import { AVAILABLE_CURRENCIES } from '@shared/constants/currency'
import { DEFAULT_LANGUAGE } from '@shared/constants/language'
import { DEFAULT_NETWORK_BY_BLOCKCHAIN } from '@shared/constants/networks'
import { TLanguage } from '@shared/types/language'
import { TCurrency, TSelectedNetworks } from '@shared/types/store'
import { PersistConfig, PURGE } from 'redux-persist'

import { settingsSliceReducers } from './reducers'

export interface ISettingsReducer {
  data: {
    currency: TCurrency
    language: TLanguage
    selectedNetworkByBlockchain: TSelectedNetworks
  }
}

const settingsReducerInitialState: ISettingsReducer = {
  data: {
    currency: AVAILABLE_CURRENCIES[0],
    language: DEFAULT_LANGUAGE,
    selectedNetworkByBlockchain: DEFAULT_NETWORK_BY_BLOCKCHAIN,
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
