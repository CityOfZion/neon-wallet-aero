import { createSlice } from '@reduxjs/toolkit'
import { reduxPersistStorage } from '@renderer/libs/reduxPersist'
import { IWalletState, TLoginSession, TLoginSessionType, TNotification } from '@shared/types/store'
import { PersistConfig, PURGE } from 'redux-persist'

import { authSliceReducers } from './reducers'

type TApplicationDataByLoginType = {
  [K in TLoginSessionType]: {
    wallets: IWalletState[]
    notifications: TNotification[]
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
      password: { wallets: [], notifications: [] },
      key: { wallets: [], notifications: [] },
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
