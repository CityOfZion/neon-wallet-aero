import { createSlice } from '@reduxjs/toolkit'
import { PersistConfig, PURGE } from 'redux-persist'
import storage from 'redux-persist/es/storage'

import { TContactEncryptedAddress, TContactState } from '@/types/store'

import { contactSliceReducers } from './reducer'

export interface IContactReducer {
  data: TContactState<TContactEncryptedAddress>[]
}

const contactReducerInitialState = {
  data: [],
} as IContactReducer

export const contactReducerConfig: PersistConfig<IContactReducer> = {
  key: 'contactReducer',
  storage,
}

const contactSlice = createSlice({
  name: contactReducerConfig.key,
  initialState: contactReducerInitialState,
  reducers: contactSliceReducers,
  extraReducers: builder => {
    builder.addCase(PURGE, () => contactReducerInitialState)
  },
})

export const contactReducerActions = contactSlice.actions
export const contactReducer = contactSlice.reducer
