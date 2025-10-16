import { CaseReducer, PayloadAction } from '@reduxjs/toolkit'
import { TContactEncryptedAddress, TContactState } from '@shared/types/store'
import { cloneDeep } from 'lodash'

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
  const contactId = action.payload

  state.data = state.data.filter(contact => contact.id !== contactId)
}

export const contactSliceReducers = {
  saveContact,
  deleteContact,
}
