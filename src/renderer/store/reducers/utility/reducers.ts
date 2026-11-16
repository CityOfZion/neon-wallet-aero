import type { TBSServiceName } from '@cityofzion/bs-multichain'
import type { CaseReducer, PayloadAction } from '@reduxjs/toolkit'
import cloneDeep from 'lodash/cloneDeep'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'

import type { TUseTransactionsTransaction } from '@shared/types/hooks'

import type { TUtilityReducer } from './index'

type THiddenTokenParams = {
  tokenHash: string
  blockchain: TBSServiceName
}

// Pending Transaction Reducers
const addPendingTransaction: CaseReducer<TUtilityReducer, PayloadAction<TUseTransactionsTransaction>> = (
  state,
  action
) => {
  state.memoryData.pendingTransactions = [...state.memoryData.pendingTransactions, action.payload]
}

const removePendingTransaction: CaseReducer<TUtilityReducer, PayloadAction<string>> = (state, action) => {
  state.memoryData.pendingTransactions = state.memoryData.pendingTransactions.filter(
    transaction => transaction.txId !== action.payload
  )
}

const setEncryptedLoginControl: CaseReducer<TUtilityReducer, PayloadAction<string | undefined>> = (state, action) => {
  state.data.encryptedLoginControl = action.payload
}

// Last Indexes By Wallet Reducers
const saveLastIndexByWallet: CaseReducer<
  TUtilityReducer,
  PayloadAction<{
    index: number
    firstAccountAddress: string
    blockchain: TBSServiceName
  }>
> = (state, action) => {
  const { firstAccountAddress, index, blockchain } = action.payload
  state.data.lastIndexesByWallet[blockchain] = {
    ...state.data.lastIndexesByWallet[blockchain],
    [firstAccountAddress]: index,
  }
}

// Hidden Tokens Reducers
const toggleHiddenToken: CaseReducer<TUtilityReducer, PayloadAction<THiddenTokenParams>> = (state, action) => {
  const { tokenHash, blockchain } = action.payload
  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]

  if (service.tokenService.isNativeToken(tokenHash)) throw new Error("Native token can't be hidden")

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
  toggleHiddenToken,
}
