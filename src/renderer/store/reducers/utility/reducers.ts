import type { CaseReducer, PayloadAction } from '@reduxjs/toolkit'
import { cloneDeep } from 'lodash'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { TokenHelper } from '@renderer/helpers/TokenHelper'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import type { TUseTransactionsTransaction } from '@shared/types/hooks'
import type { TSwapRecord } from '@shared/types/store'

import type { IUtilityReducer } from './index'

type THiddenTokenParams = {
  tokenHash: string
  blockchain: TBlockchainServiceKey
}

// Pending Transaction Reducers
const addPendingTransaction: CaseReducer<IUtilityReducer, PayloadAction<TUseTransactionsTransaction>> = (
  state,
  action
) => {
  state.inMemoryData.pendingTransactions = [...state.inMemoryData.pendingTransactions, action.payload]
}

const removePendingTransaction: CaseReducer<IUtilityReducer, PayloadAction<string>> = (state, action) => {
  state.inMemoryData.pendingTransactions = state.inMemoryData.pendingTransactions.filter(
    transaction => transaction.txId !== action.payload
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

// Hidden Tokens Reducers
const toggleHiddenToken: CaseReducer<IUtilityReducer, PayloadAction<THiddenTokenParams>> = (state, action) => {
  const { tokenHash, blockchain } = action.payload

  if (TokenHelper.isNativeToken(tokenHash, blockchain)) throw new Error("Native token can't be hidden")

  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]
  const normalizedTokenHash = service.tokenService.normalizeHash(tokenHash)
  const hiddenTokens = cloneDeep(state.data.hiddenTokensByBlockchain[blockchain] || [])

  const index = hiddenTokens.findIndex(tokenHash =>
    service.tokenService.predicateByHash(normalizedTokenHash, tokenHash)
  )

  if (index < 0) {
    hiddenTokens.push(normalizedTokenHash)
  } else {
    hiddenTokens.splice(index, 1)
  }

  state.data.hiddenTokensByBlockchain = {
    ...state.data.hiddenTokensByBlockchain,
    [blockchain]: hiddenTokens,
  }
}

export const utilitySliceReducers = {
  addPendingTransaction,
  removePendingTransaction,
  saveLastIndexByWallet,
  setEncryptedLoginControl,
  persistSwapRecord,
  toggleHiddenToken,
}
