import type { CaseReducerActions } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { PersistConfig } from 'redux-persist'
import { persistReducer } from 'redux-persist'
import { localStorage } from 'redux-persist-webextension-storage'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { CurrencyHelper } from '@renderer/helpers/CurrencyHelper'
import { LanguageHelper } from '@renderer/helpers/LanguageHelper'

import type { TAccount, TCurrency, TLanguage, TSelectedNetworks, TWallet } from '@shared/types/store'

import { settingsSliceReducers } from './reducers'

export let settingsReducerActions: CaseReducerActions<typeof settingsSliceReducers, string>

export type TSettingsReducer = {
  data: {
    selectedWallet: TWallet | undefined
    selectedAccount: TAccount | undefined
    currency: TCurrency
    language: TLanguage
    selectedNetworkByBlockchain: TSelectedNetworks
  }
}

export function getSettingsReducer() {
  const settingsReducerInitialState: TSettingsReducer = {
    data: {
      selectedWallet: undefined,
      selectedAccount: undefined,
      currency: CurrencyHelper.defaultCurrency,
      language: LanguageHelper.defaultLanguage,
      selectedNetworkByBlockchain: {
        neo3: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neo3.defaultNetwork,
        neoLegacy: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neoLegacy.defaultNetwork,
        ethereum: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.ethereum.defaultNetwork,
        neox: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neox.defaultNetwork,
        polygon: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.polygon.defaultNetwork,
        base: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.base.defaultNetwork,
        arbitrum: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.arbitrum.defaultNetwork,
        solana: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.solana.defaultNetwork,
      },
    },
  }

  const settingsReducerConfig: PersistConfig<TSettingsReducer> = {
    key: 'settingsReducer',
    storage: localStorage,
  }

  const settingsSlice = createSlice({
    name: settingsReducerConfig.key,
    initialState: settingsReducerInitialState,
    reducers: settingsSliceReducers,
  })

  settingsReducerActions = settingsSlice.actions

  return persistReducer(settingsReducerConfig, settingsSlice.reducer)
}
