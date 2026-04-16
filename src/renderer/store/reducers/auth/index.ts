import type { CaseReducerActions } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { PersistConfig } from 'redux-persist'
import { persistReducer } from 'redux-persist'
import { localStorage } from 'redux-persist-webextension-storage'

import type { TLoginSession, TLoginSessionType, TNotification, TWallet } from '@shared/types/store'

import { authSliceReducers } from './reducers'

type TApplicationDataByLoginType = {
  [K in TLoginSessionType]: {
    wallets: TWallet[]
    notifications: TNotification[]
  }
}

export type TAuthReducer = {
  memoryData: {
    loginSession: TLoginSession | undefined
  }
  data: {
    applicationDataByLoginType: TApplicationDataByLoginType
  }
}

export let authReducerActions: CaseReducerActions<typeof authSliceReducers, string>

export function getAuthReducer() {
  const authReducerInitialState: TAuthReducer = {
    memoryData: {
      loginSession: undefined,
    },
    data: {
      applicationDataByLoginType: {
        password: { wallets: [], notifications: [] },
        key: { wallets: [], notifications: [] },
        hardware: { wallets: [], notifications: [] },
      },
    },
  }

  const authReducerConfig: PersistConfig<TAuthReducer> = {
    key: 'authReducer',
    storage: localStorage,
    blacklist: ['memoryData'],
  }

  const authSlice = createSlice({
    name: authReducerConfig.key,
    initialState: authReducerInitialState,
    reducers: authSliceReducers,
  })

  authReducerActions = authSlice.actions

  return persistReducer(authReducerConfig, authSlice.reducer)
}
