import type { CaseReducerActions } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { PersistConfig } from 'redux-persist'
import { persistReducer } from 'redux-persist'
import { localStorage } from 'redux-persist-webextension-storage'

import { bsAggregator } from '@renderer/libs/blockchain-service'
import { AVAILABLE_CURRENCIES } from '@shared/constants/currency'
import { DEFAULT_LANGUAGE } from '@shared/constants/language'
import type { IAccountState, IWalletState, TCurrency, TLanguage, TSelectedNetworks } from '@shared/types/store'

import { settingsSliceReducers } from './reducers'

export let settingsReducerActions: CaseReducerActions<typeof settingsSliceReducers, string>

export interface ISettingsReducer {
  inMemoryData: {
    selectedWallet: IWalletState | undefined
    selectedAccount: IAccountState | undefined
  }
  data: {
    currency: TCurrency
    language: TLanguage
    selectedNetworkByBlockchain: TSelectedNetworks
  }
}

export function getSettingsReducer() {
  const settingsReducerInitialState: ISettingsReducer = {
    inMemoryData: {
      selectedWallet: undefined,
      selectedAccount: undefined,
    },
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
    blacklist: ['inMemoryData'],
  }

  const settingsSlice = createSlice({
    name: settingsReducerConfig.key,
    initialState: settingsReducerInitialState,
    reducers: settingsSliceReducers,
  })

  settingsReducerActions = settingsSlice.actions

  return persistReducer(settingsReducerConfig, settingsSlice.reducer)
}
