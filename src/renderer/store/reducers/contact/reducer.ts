import type { CaseReducer, PayloadAction } from '@reduxjs/toolkit'
import { cloneDeep } from 'lodash'

import type { TContact, TContactEncryptedAddress } from '@shared/types/store'

import type { TContactReducer } from './index'

const saveContact: CaseReducer<TContactReducer, PayloadAction<TContact<TContactEncryptedAddress>>> = (
  state,
  action
) => {
  const encryptedContact: TContact<TContactEncryptedAddress> = cloneDeep(action.payload)
  const index = state.data.findIndex(contact => contact.id === encryptedContact.id)

  if (index < 0) {
    state.data = [...state.data, encryptedContact]

    return
  }

  state.data[index] = encryptedContact
}

const deleteContact: CaseReducer<TContactReducer, PayloadAction<string>> = (state, action) => {
  const contactId = action.payload

  state.data = state.data.filter(contact => contact.id !== contactId)
}

export const contactSliceReducers = {
  saveContact,
  deleteContact,
}
