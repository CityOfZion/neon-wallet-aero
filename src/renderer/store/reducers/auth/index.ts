import { CaseReducerActions, createSlice } from '@reduxjs/toolkit'
import { IWalletState, TLoginSession, TLoginSessionType, TNotification } from '@shared/types/store'
import { PersistConfig, persistReducer, PURGE } from 'redux-persist'
import { localStorage } from 'redux-persist-webextension-storage'

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
    extraReducers: builder => {
      builder.addCase(PURGE, () => authReducerInitialState)
    },
  })

  authReducerActions = authSlice.actions

  const persistedAuthReducer = persistReducer(authReducerConfig, authSlice.reducer)

  return persistedAuthReducer
}
