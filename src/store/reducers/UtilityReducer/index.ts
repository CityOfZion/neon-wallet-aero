import { createSlice } from '@reduxjs/toolkit'
import { PersistConfig } from 'redux-persist'

import { reduxPersistStorage } from '@/libs/reduxPersist'
import { THiddenTokenByBlockchain, TLastIndexesByWallet, TPendingTransaction } from '@/types/store'

import { utilitySliceReducers } from './reducers'

export interface IUtilityReducer {
  inMemoryData: {
    pendingTransactions: TPendingTransaction[]
  }
  data: {
    lastIndexesByWallet: TLastIndexesByWallet
    hiddenTokensByBlockchain: THiddenTokenByBlockchain
  }
}

const utilityReducerInitialState: IUtilityReducer = {
  inMemoryData: {
    pendingTransactions: [],
  },
  data: {
    lastIndexesByWallet: {},
    hiddenTokensByBlockchain: {},
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
})

export const utilityReducerActions = utilitySlice.actions
export const utilityReducer = utilitySlice.reducer
