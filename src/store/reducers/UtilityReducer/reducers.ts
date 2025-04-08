import { CaseReducer, PayloadAction } from '@reduxjs/toolkit'

import { TBlockchainServiceKey } from '@/types/blockchain'

import { IUtilityReducer } from '.'

const setEncryptedLoginControl: CaseReducer<IUtilityReducer, PayloadAction<string | undefined>> = (state, action) => {
  state.data.encryptedLoginControl = action.payload
}

const setHasPassword: CaseReducer<IUtilityReducer, PayloadAction<boolean>> = (state, action) => {
  state.data.hasPassword = action.payload
}

// Last Indexes By Wallet Reducers
const saveLastIndexByWallet: CaseReducer<
  IUtilityReducer,
  PayloadAction<{
    index: number
    firstAccountAddress: string
    blockchain: TBlockchainServiceKey
  }>
> = (state, action) => {
  const { firstAccountAddress, index, blockchain } = action.payload
  state.data.lastIndexesByWallet[blockchain] = {
    ...state.data.lastIndexesByWallet[blockchain],
    [firstAccountAddress]: index,
  }
}

export const utilitySliceReducers = { saveLastIndexByWallet, setEncryptedLoginControl, setHasPassword }
