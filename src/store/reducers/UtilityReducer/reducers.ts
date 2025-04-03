import { CaseReducer, PayloadAction } from '@reduxjs/toolkit'

import { TBlockchainServiceKey } from '@/types/blockchain'

import { IUtilityReducer } from '.'

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

export const utilitySliceReducers = { saveLastIndexByWallet }
