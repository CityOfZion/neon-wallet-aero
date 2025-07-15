import { CaseReducer, PayloadAction } from '@reduxjs/toolkit'

import { IAccountState, IWalletState, TLoginSession } from '@/types/store'

import { IAuthReducer } from '.'

const setLoginSession: CaseReducer<IAuthReducer, PayloadAction<TLoginSession | undefined>> = (state, action) => {
  state.inMemoryData.loginSession = action.payload
}

const resetTemporaryApplicationData: CaseReducer<IAuthReducer> = state => {
  state.data.applicationDataByLoginType.hardware = { wallets: [] }
  state.data.applicationDataByLoginType.key = { wallets: [] }
}

// Wallet Reducers
const saveWallet: CaseReducer<IAuthReducer, PayloadAction<IWalletState>> = (state, action) => {
  if (!state.inMemoryData.loginSession) {
    throw new Error('Error to save wallet: Current login session is not defined')
  }

  const loginSessionType = state.inMemoryData.loginSession.type
  const wallet = action.payload

  const applicationData = state.data.applicationDataByLoginType[loginSessionType]

  const walletIndex = applicationData.wallets.findIndex(it => it.id === wallet.id)
  if (walletIndex < 0) {
    applicationData.wallets = [...applicationData.wallets, wallet]
    return
  }

  applicationData.wallets[walletIndex] = wallet
}

const deleteWallet: CaseReducer<IAuthReducer, PayloadAction<string>> = (state, action) => {
  if (!state.inMemoryData.loginSession) {
    throw new Error('Error to delete wallet: Current login session is not defined')
  }

  const loginSessionType = state.inMemoryData.loginSession.type
  const walletId = action.payload
  const applicationData = state.data.applicationDataByLoginType[loginSessionType]

  applicationData.wallets = applicationData.wallets.filter(it => it.id !== walletId)
}

// Account Reducers
const saveAccount: CaseReducer<IAuthReducer, PayloadAction<IAccountState>> = (state, action) => {
  if (!state.inMemoryData.loginSession) {
    throw new Error('Error to save account: Current login session is not defined')
  }

  const loginSessionType = state.inMemoryData.loginSession.type
  const account = action.payload
  const walletId = account.idWallet

  const applicationData = state.data.applicationDataByLoginType[loginSessionType]

  const wallet = applicationData.wallets.find(it => it.id === walletId)
  if (!wallet) {
    throw new Error('Error to save account: Wallet not found')
  }

  const accountIndex = wallet.accounts.findIndex(it => it.id === account.id)
  if (accountIndex < 0) {
    wallet.accounts = [...wallet.accounts, account]
    return
  }

  wallet.accounts[accountIndex] = account
}

const deleteAccount: CaseReducer<IAuthReducer, PayloadAction<IAccountState>> = (state, action) => {
  if (!state.inMemoryData.loginSession) {
    throw new Error('Error to delete account: Current login session is not defined')
  }

  const loginSessionType = state.inMemoryData.loginSession.type
  const accountToRemove = action.payload
  const walletId = accountToRemove.idWallet

  const applicationData = state.data.applicationDataByLoginType[loginSessionType]

  const wallet = applicationData.wallets.find(it => it.id === walletId)
  if (!wallet) {
    throw new Error('Error to delete account: Wallet not found')
  }

  wallet.accounts = wallet.accounts.filter(account => account.id !== accountToRemove.id)
}

export const authSliceReducers = {
  saveWallet,
  deleteWallet,
  saveAccount,
  deleteAccount,
  setLoginSession,
  resetTemporaryApplicationData,
}
