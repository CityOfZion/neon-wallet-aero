import { CaseReducerActions, createSlice } from '@reduxjs/toolkit'
import { TContactEncryptedAddress, TContactState } from '@shared/types/store'
import { PersistConfig, PURGE } from 'redux-persist'
import persistReducer from 'redux-persist/es/persistReducer'
import { localStorage } from 'redux-persist-webextension-storage'

import { contactSliceReducers } from './reducer'

export interface IContactReducer {
  data: TContactState<TContactEncryptedAddress>[]
}

export let contactReducerActions: CaseReducerActions<typeof contactSliceReducers, string>

export function getContactReducer() {
  const contactReducerInitialState = {
    data: [],
  } as IContactReducer

  const contactReducerConfig: PersistConfig<IContactReducer> = {
    key: 'contactReducer',
    storage: localStorage,
  }

  const contactSlice = createSlice({
    name: contactReducerConfig.key,
    initialState: contactReducerInitialState,
    reducers: contactSliceReducers,
    extraReducers: builder => {
      builder.addCase(PURGE, () => contactReducerInitialState)
    },
  })

  contactReducerActions = contactSlice.actions

  const persistedAccountReducer = persistReducer(contactReducerConfig, contactSlice.reducer)

  return persistedAccountReducer
}
