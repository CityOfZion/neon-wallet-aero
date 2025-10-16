import type { CaseReducer, PayloadAction } from '@reduxjs/toolkit'
import { cloneDeep } from 'lodash'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import type { TTransactionsTransfer } from '@shared/types/hooks'
import type { TMigrationNeo3, TMigrationsNeo3, TSwapRecord } from '@shared/types/store'

import type { IUtilityReducer } from '.'

// Pending Transaction Reducers
const addPendingTransaction: CaseReducer<IUtilityReducer, PayloadAction<TTransactionsTransfer>> = (state, action) => {
  state.inMemoryData.pendingTransactions = [...state.inMemoryData.pendingTransactions, action.payload]
}

const removePendingTransaction: CaseReducer<IUtilityReducer, PayloadAction<string>> = (state, action) => {
  state.inMemoryData.pendingTransactions = state.inMemoryData.pendingTransactions.filter(
    transaction => transaction.hash !== action.payload
  )
}

const setEncryptedLoginControl: CaseReducer<IUtilityReducer, PayloadAction<string | undefined>> = (state, action) => {
  state.data.encryptedLoginControl = action.payload
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

const saveMigrationNeo3: CaseReducer<IUtilityReducer, PayloadAction<TMigrationNeo3>> = (state, action) => {
  const migrationNeo3 = cloneDeep(action.payload)

  state.data.migrationsNeo3[migrationNeo3.hash] = migrationNeo3
}

export const utilitySliceReducers = {
  addPendingTransaction,
  removePendingTransaction,
  saveLastIndexByWallet,
  setEncryptedLoginControl,
  saveMigrationNeo3,
  mergeMigrationsNeo3,
  persistSwapRecord,
}
