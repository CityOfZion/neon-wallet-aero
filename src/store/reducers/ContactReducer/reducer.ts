import { CaseReducer, PayloadAction } from '@reduxjs/toolkit'
import { cloneDeep } from 'lodash'

import { TContactEncryptedAddress, TContactState } from '@/types/store'

import { IContactReducer } from '.'

const saveContact: CaseReducer<IContactReducer, PayloadAction<TContactState<TContactEncryptedAddress>>> = (
  state,
  action
) => {
  const encryptedContact: TContactState<TContactEncryptedAddress> = cloneDeep(action.payload)
  const index = state.data.findIndex(contact => contact.id === encryptedContact.id)

  if (index < 0) {
    state.data = [...state.data, encryptedContact]
    return
  }

  state.data[index] = encryptedContact
}

const deleteContact: CaseReducer<IContactReducer, PayloadAction<string>> = (state, action) => {
  const idContact = action.payload
  state.data = state.data.filter(contact => contact.id !== idContact)
}

export const contactSliceReducers = {
  saveContact,
  deleteContact,
}
