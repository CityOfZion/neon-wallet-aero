import type { CaseReducerActions } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { PersistConfig } from 'redux-persist'
import { createMigrate, persistReducer } from 'redux-persist'
import { localStorage } from 'redux-persist-webextension-storage'

import type { TLoginSession, TLoginSessionType, TNotification, TWallet } from '@shared/types/store'

import { authMigrations } from './migrations'
import { authSliceReducers } from './reducers'

export type TApplicationDataByLoginType = {
  [K in TLoginSessionType]: {
    wallets: TWallet[]
    notifications: TNotification[]
    shouldConfirmAction: boolean
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
        password: { wallets: [], notifications: [], shouldConfirmAction: true },
        key: { wallets: [], notifications: [], shouldConfirmAction: true },
        hardware: { wallets: [], notifications: [], shouldConfirmAction: false },
      },
    },
  }

  const authReducerConfig: PersistConfig<TAuthReducer> = {
    key: 'authReducer',
    storage: localStorage,
    blacklist: ['memoryData'],
    version: 0,
    migrate: createMigrate(authMigrations),
  }

  const authSlice = createSlice({
    name: authReducerConfig.key,
    initialState: authReducerInitialState,
    reducers: authSliceReducers,
  })

  authReducerActions = authSlice.actions

  return persistReducer(authReducerConfig, authSlice.reducer)
}
