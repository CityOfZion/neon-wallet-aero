import { CaseReducerActions, createSlice } from '@reduxjs/toolkit'
import { bsAggregator } from '@renderer/libs/blockchainService'
import { AVAILABLE_CURRENCIES } from '@shared/constants/currency'
import { DEFAULT_LANGUAGE } from '@shared/constants/language'
import { TLanguage } from '@shared/types/language'
import { TCurrency, TSelectedNetworks } from '@shared/types/store'
import { PersistConfig, persistReducer, PURGE } from 'redux-persist'
import { localStorage } from 'redux-persist-webextension-storage'

import { settingsSliceReducers } from './reducers'

export let settingsReducerActions: CaseReducerActions<typeof settingsSliceReducers, string>

export interface ISettingsReducer {
  data: {
    currency: TCurrency
    language: TLanguage
    selectedNetworkByBlockchain: TSelectedNetworks
  }
}

export function getSettingsReducer() {
  const settingsReducerInitialState: ISettingsReducer = {
    data: {
      currency: AVAILABLE_CURRENCIES[0],
      language: DEFAULT_LANGUAGE,
      selectedNetworkByBlockchain: {
        neo3: bsAggregator.blockchainServicesByName.neo3.defaultNetwork,
        neoLegacy: bsAggregator.blockchainServicesByName.neoLegacy.defaultNetwork,
        ethereum: bsAggregator.blockchainServicesByName.ethereum.defaultNetwork,
        neox: bsAggregator.blockchainServicesByName.neox.defaultNetwork,
        polygon: bsAggregator.blockchainServicesByName.polygon.defaultNetwork,
        base: bsAggregator.blockchainServicesByName.base.defaultNetwork,
        arbitrum: bsAggregator.blockchainServicesByName.arbitrum.defaultNetwork,
      },
    },
  }

  const settingsReducerConfig: PersistConfig<ISettingsReducer> = {
    key: 'settingsReducer',
    storage: localStorage,
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

  settingsReducerActions = settingsSlice.actions

  const persistedAuthReducer = persistReducer(settingsReducerConfig, settingsSlice.reducer)

  return persistedAuthReducer
}
