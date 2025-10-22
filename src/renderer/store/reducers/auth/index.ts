import type { CaseReducerActions } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { PersistConfig } from 'redux-persist'
import { persistReducer } from 'redux-persist'
import { localStorage } from 'redux-persist-webextension-storage'

import type { IWalletState, TLoginSession, TLoginSessionType, TNotification } from '@shared/types/store'

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

export let authReducerActions: CaseReducerActions<typeof authSliceReducers, string>

export function getAuthReducer() {
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

  const authReducerConfig: PersistConfig<IAuthReducer> = {
    key: 'authReducer',
    storage: localStorage,
    blacklist: ['inMemoryData'],
  }

  const authSlice = createSlice({
    name: authReducerConfig.key,
    initialState: authReducerInitialState,
    reducers: authSliceReducers,
  })

  authReducerActions = authSlice.actions

  return persistReducer(authReducerConfig, authSlice.reducer)
}
