import { CaseReducer, PayloadAction } from '@reduxjs/toolkit'
import { cloneDeep } from 'lodash'

import { TBlockchainServiceKey } from '@/types/blockchain'
import { TMigrationsNeo3, TSwapRecord } from '@/types/store'

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

// Swap Reducers
const persistSwapRecord: CaseReducer<IUtilityReducer, PayloadAction<TSwapRecord>> = (state, action) => {
  const swapRecord = cloneDeep(action.payload)

  // We don't want to save this long information in the storage
  swapRecord.log = undefined

  const index = state.data.swapRecords.findIndex(
    swap => swap.swapId === swapRecord.swapId && swap.swapProvider === swapRecord.swapProvider
  )

  if (index === -1) {
    state.data.swapRecords = [...state.data.swapRecords, swapRecord]
    return
  }

  state.data.swapRecords[index] = swapRecord
}

// Migration Neo3 Reducers
const mergeMigrationsNeo3: CaseReducer<IUtilityReducer, PayloadAction<TMigrationsNeo3>> = (state, action) => {
  const migrationsNeo3 = cloneDeep(action.payload)
  state.data.migrationsNeo3 = { ...state.data.migrationsNeo3, ...migrationsNeo3 }
}

export const utilitySliceReducers = {
  saveLastIndexByWallet,
  setEncryptedLoginControl,
  setHasPassword,
  mergeMigrationsNeo3,
  persistSwapRecord,
}
