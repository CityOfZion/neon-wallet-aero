import { createSlice } from '@reduxjs/toolkit'
import { reduxPersistStorage } from '@renderer/libs/reduxPersist'
import { TContactEncryptedAddress, TContactState } from '@shared/types/store'
import { PersistConfig, PURGE } from 'redux-persist'

import { contactSliceReducers } from './reducer'

export interface IContactReducer {
  data: TContactState<TContactEncryptedAddress>[]
}

const contactReducerInitialState = {
  data: [],
} as IContactReducer

export const contactReducerConfig: PersistConfig<IContactReducer> = {
  key: 'contactReducer',
  storage: reduxPersistStorage,
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
