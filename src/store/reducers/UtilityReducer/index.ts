import { createSlice } from '@reduxjs/toolkit'
import { PersistConfig, PURGE } from 'redux-persist'

import { reduxPersistStorage } from '@/libs/reduxPersist'
import { TUseTransactionsTransfer } from '@/types/hooks'
import { THiddenTokenByBlockchain, TLastIndexesByWallet, TMigrationsNeo3, TSwapRecord } from '@/types/store'

import { utilitySliceReducers } from './reducers'

export interface IUtilityReducer {
  inMemoryData: {
    pendingTransactions: TUseTransactionsTransfer[]
  }
  data: {
    hasPassword: boolean
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
    hasPassword: false,
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
