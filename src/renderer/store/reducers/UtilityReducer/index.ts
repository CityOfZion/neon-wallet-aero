import { createSlice } from '@reduxjs/toolkit'
import { reduxPersistStorage } from '@renderer/libs/reduxPersist'
import { TTransactionsTransfer } from '@shared/types/hooks'
import { THiddenTokenByBlockchain, TLastIndexesByWallet, TMigrationsNeo3, TSwapRecord } from '@shared/types/store'
import { PersistConfig, PURGE } from 'redux-persist'

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

export const utilityReducerConfig: PersistConfig<IUtilityReducer> = {
  key: 'utilityReducer',
  storage: reduxPersistStorage,
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

export const utilityReducerActions = utilitySlice.actions
export const utilityReducer = utilitySlice.reducer
