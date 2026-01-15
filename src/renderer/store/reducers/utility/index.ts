import type { CaseReducerActions } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { PersistConfig } from 'redux-persist'
import persistReducer from 'redux-persist/es/persistReducer'
import { localStorage } from 'redux-persist-webextension-storage'

import type { TTransactionsTransfer } from '@shared/types/hooks'
import type { THiddenTokenByBlockchain, TLastIndexesByWallet, TSwapRecord } from '@shared/types/store'

import { utilitySliceReducers } from './reducers'

export interface IUtilityReducer {
  inMemoryData: {
    pendingTransactions: TTransactionsTransfer[]
  }
  data: {
    encryptedLoginControl?: string
    swapRecords: TSwapRecord[]
    lastIndexesByWallet: TLastIndexesByWallet
    hiddenTokensByBlockchain: THiddenTokenByBlockchain
  }
}

export let utilityReducerActions: CaseReducerActions<typeof utilitySliceReducers, string>

export function getUtilityReducer() {
  const utilityReducerInitialState: IUtilityReducer = {
    inMemoryData: {
      pendingTransactions: [],
    },
    data: {
      encryptedLoginControl: undefined,
      swapRecords: [],
      lastIndexesByWallet: {},
      hiddenTokensByBlockchain: {},
    },
  }

  const utilityReducerConfig: PersistConfig<IUtilityReducer> = {
    key: 'utilityReducer',
    storage: localStorage,
    blacklist: ['inMemoryData'],
  }

  const utilitySlice = createSlice({
    name: 'utilityReducer',
    initialState: utilityReducerInitialState,
    reducers: utilitySliceReducers,
  })

  utilityReducerActions = utilitySlice.actions

  return persistReducer(utilityReducerConfig, utilitySlice.reducer)
}
