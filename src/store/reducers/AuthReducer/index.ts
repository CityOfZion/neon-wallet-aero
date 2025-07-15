import { createSlice } from '@reduxjs/toolkit'
import { PersistConfig, PURGE } from 'redux-persist'

import { reduxPersistStorage } from '@/libs/reduxPersist'
import { IWalletState, TLoginSession, TLoginSessionType } from '@/types/store'

import { authSliceReducers } from './reducers'

type TApplicationDataByLoginType = {
  [K in TLoginSessionType]: {
    wallets: IWalletState[]
  }
}

export interface IAuthReducer {
  inMemoryData: {
    loginSession: TLoginSession | undefined
  }
  data: {
    applicationDataByLoginType: TApplicationDataByLoginType
  }
}

const authReducerInitialState: IAuthReducer = {
  inMemoryData: {
    loginSession: undefined,
  },
  data: {
    applicationDataByLoginType: {
      password: { wallets: [] },
      key: { wallets: [] },
    },
  },
}

export const authReducerConfig: PersistConfig<IAuthReducer> = {
  key: 'authReducer',
  storage: reduxPersistStorage,
  blacklist: ['inMemoryData'],
}

const authSlice = createSlice({
  name: authReducerConfig.key,
  initialState: authReducerInitialState,
  reducers: authSliceReducers,
  extraReducers: builder => {
    builder.addCase(PURGE, () => authReducerInitialState)
  },
})

export const authReducerActions = authSlice.actions
export const authReducer = authSlice.reducer
