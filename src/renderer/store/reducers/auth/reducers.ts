import type { CaseReducer, PayloadAction } from '@reduxjs/toolkit'

import { DateHelper } from '@renderer/helpers/DateHelper'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'

import type { IAccountState, IWalletState, TLoginSession, TNotification, TSaveNotification } from '@shared/types/store'

import type { IAuthReducer } from '.'

const setLoginSession: CaseReducer<IAuthReducer, PayloadAction<TLoginSession | undefined>> = (state, action) => {
  state.inMemoryData.loginSession = action.payload
}

const resetTemporaryApplicationData: CaseReducer<IAuthReducer> = state => {
  state.data.applicationDataByLoginType.key = { wallets: [], notifications: [] }
}

// Wallet Reducers
const saveWallet: CaseReducer<IAuthReducer, PayloadAction<IWalletState>> = (state, action) => {
  if (!state.inMemoryData.loginSession) {
    return
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

const saveNotification: CaseReducer<IAuthReducer, PayloadAction<TSaveNotification>> = (state, action) => {
  const loginSessionType = state.inMemoryData.loginSession?.type

  if (!loginSessionType) return

  const notification: TNotification = {
    id: UtilsHelper.uuid(),
    date: DateHelper.getNowUnix(),
    read: false,
    priority: 'low',
    provider: 'system',
    ...action.payload,
  }

  const applicationData = state.data.applicationDataByLoginType[loginSessionType]
  const foundIndex = applicationData.notifications.findIndex(item => item.id === notification.id)

  if (foundIndex < 0) {
    applicationData.notifications = [...applicationData.notifications, notification]

    return
  }

  applicationData.notifications[foundIndex] = notification
}

const deleteWallet: CaseReducer<IAuthReducer, PayloadAction<string>> = (state, action) => {
  if (!state.inMemoryData.loginSession) {
    return
  }

  const loginSessionType = state.inMemoryData.loginSession.type
  const walletId = action.payload
  const applicationData = state.data.applicationDataByLoginType[loginSessionType]

  applicationData.wallets = applicationData.wallets.filter(it => it.id !== walletId)
}

const reorderWallets: CaseReducer<IAuthReducer, PayloadAction<IWalletState[]>> = (state, action) => {
  const loginSessionType = state.inMemoryData.loginSession?.type

  if (!loginSessionType) return

  const applicationData = state.data.applicationDataByLoginType[loginSessionType]

  applicationData.wallets = action.payload
}

// Account Reducers
const saveAccount: CaseReducer<IAuthReducer, PayloadAction<IAccountState>> = (state, action) => {
  if (!state.inMemoryData.loginSession) return

  const loginSessionType = state.inMemoryData.loginSession.type
  const account = action.payload
  const walletId = account.idWallet
  const applicationData = state.data.applicationDataByLoginType[loginSessionType]
  const wallet = applicationData.wallets.find(it => it.id === walletId)

  if (!wallet) return

  const accountIndex = wallet.accounts.findIndex(it => it.id === account.id)

  if (accountIndex < 0) {
    wallet.accounts = [...wallet.accounts, account]
    return
  }

  wallet.accounts[accountIndex] = account
}

const deleteAccount: CaseReducer<IAuthReducer, PayloadAction<IAccountState>> = (state, action) => {
  if (!state.inMemoryData.loginSession) {
    return
  }

  const loginSessionType = state.inMemoryData.loginSession.type
  const accountToRemove = action.payload
  const walletId = accountToRemove.idWallet
  const applicationData = state.data.applicationDataByLoginType[loginSessionType]
  const wallet = applicationData.wallets.find(it => it.id === walletId)

  if (!wallet) {
    return
  }

  wallet.accounts = wallet.accounts.filter(account => account.id !== accountToRemove.id)
}

export const authSliceReducers = {
  saveWallet,
  deleteWallet,
  reorderWallets,
  saveAccount,
  deleteAccount,
  saveNotification,
  setLoginSession,
  resetTemporaryApplicationData,
}
