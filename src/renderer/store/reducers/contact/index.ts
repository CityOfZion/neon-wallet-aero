import type { CaseReducerActions } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { PersistConfig } from 'redux-persist'
import persistReducer from 'redux-persist/es/persistReducer'
import { localStorage } from 'redux-persist-webextension-storage'

import type { TContactEncryptedAddress, TContactState } from '@shared/types/store'

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
  })

  contactReducerActions = contactSlice.actions

  return persistReducer(contactReducerConfig, contactSlice.reducer)
}
