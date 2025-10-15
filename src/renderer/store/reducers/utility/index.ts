import { CaseReducerActions, createSlice } from '@reduxjs/toolkit'
import { TTransactionsTransfer } from '@shared/types/hooks'
import { THiddenTokenByBlockchain, TLastIndexesByWallet, TMigrationsNeo3, TSwapRecord } from '@shared/types/store'
import { PersistConfig, PURGE } from 'redux-persist'
import persistReducer from 'redux-persist/es/persistReducer'
import { localStorage } from 'redux-persist-webextension-storage'

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
    migrationsNeo3: TMigrationsNeo3
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
      migrationsNeo3: {},
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
    extraReducers: builder => {
      builder.addCase(PURGE, () => utilityReducerInitialState)
    },
  })

  utilityReducerActions = utilitySlice.actions

  const persistedUtilityReducer = persistReducer(utilityReducerConfig, utilitySlice.reducer)

  return persistedUtilityReducer
}
