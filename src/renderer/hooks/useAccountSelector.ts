import { useRef } from 'react'

import { useSelector } from 'react-redux'

import { AccountHelper } from '@renderer/helpers/AccountHelper'
import { SelectorHelper } from '@renderer/helpers/SelectorHelper'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import type { TRootState } from '@shared/types/redux'
import type { IAccountState, TAccountWithWallet } from '@shared/types/store'

import { createAppSelector, useAppSelector } from './useRedux'

export const selectAccounts = createAppSelector(
  [state => state.auth.data.applicationDataByLoginType, state => state.auth.inMemoryData.loginSession],
  (applicationDataByLoginType, loginSession) => {
    if (!loginSession?.type) return SelectorHelper.fallbackToEmptyArray<IAccountState>()

    const accounts = applicationDataByLoginType[loginSession.type].wallets.flatMap(wallet => wallet.accounts)

    if (accounts.length === 0) return SelectorHelper.fallbackToEmptyArray<IAccountState>()

    return AccountHelper.orderAccounts(accounts)
  }
)

const selectAccountsWithWallet = createAppSelector(
  [state => state.auth.data.applicationDataByLoginType, state => state.auth.inMemoryData.loginSession],
  (applicationDataByLoginType, loginSession) => {
    if (!loginSession?.type) return SelectorHelper.fallbackToEmptyArray<TAccountWithWallet>()

    const accounts = applicationDataByLoginType[loginSession.type].wallets.flatMap(wallet =>
      wallet.accounts.map(account => ({ ...account, wallet }))
    )

    if (accounts.length === 0) return SelectorHelper.fallbackToEmptyArray<TAccountWithWallet>()

    return AccountHelper.orderAccounts<TAccountWithWallet>(accounts)
  }
)

const selectAccountsByWalletId = (walletId: string) =>
  createAppSelector(
    [state => state.auth.data.applicationDataByLoginType, state => state.auth.inMemoryData.loginSession],
    (applicationDataByLoginType, loginSession) => {
      if (!loginSession?.type) return SelectorHelper.fallbackToEmptyArray<IAccountState>()

      const accounts = applicationDataByLoginType[loginSession.type].wallets.find(
        wallet => wallet.id === walletId
      )?.accounts

      if (!accounts || accounts.length === 0) return SelectorHelper.fallbackToEmptyArray<IAccountState>()

      return AccountHelper.orderAccounts(accounts)
    }
  )

const selectAccountsByBlockchains = (blockchains: TBlockchainServiceKey[]) =>
  createAppSelector(
    [({ auth }) => auth.data.applicationDataByLoginType, ({ auth }) => auth.inMemoryData.loginSession],
    (applicationDataByLoginType, loginSession) => {
      if (!loginSession?.type) return SelectorHelper.fallbackToEmptyArray<IAccountState>()

      return applicationDataByLoginType[loginSession.type].wallets
        .flatMap(wallet => wallet.accounts)
        .filter(account => blockchains.some(blockchain => blockchain === account.blockchain))
    }
  )

const selectHasHardwareAccount = createAppSelector(
  [state => state.auth.data.applicationDataByLoginType, state => state.auth.inMemoryData.loginSession],
  (applicationDataByLoginType, currentLoginSession) => {
    return applicationDataByLoginType[currentLoginSession?.type ?? 'password'].wallets.some(wallet =>
      wallet.accounts.some(account => account.type === 'hardware')
    )
  }
)

const selectHardwareAccounts = createAppSelector(
  [state => state.auth.data.applicationDataByLoginType, state => state.auth.inMemoryData.loginSession],
  (applicationDataByLoginType, loginSession) => {
    if (!loginSession?.type) return SelectorHelper.fallbackToEmptyArray<IAccountState>()

    const accounts = applicationDataByLoginType[loginSession.type].wallets.flatMap(wallet => wallet.accounts)
    const hardwareAccounts = accounts.filter(account => account.type === 'hardware')

    return AccountHelper.orderAccounts(hardwareAccounts)
  }
)

export const useAccountsSelector = () => {
  const { ref, value } = useAppSelector(selectAccounts)

  return {
    accounts: value,
    accountsRef: ref,
  }
}

export const useAccountsWithWalletSelector = () => {
  const { ref, value } = useAppSelector(selectAccountsWithWallet)

  return {
    accountsWithWallet: value,
    accountsWithWalletRef: ref,
  }
}

export const useAccountsByWalletIdSelector = (walletId: string) => {
  const { value, ref } = useAppSelector(selectAccountsByWalletId(walletId))

  return {
    accountsByWalletId: value,
    accountsByWalletIdRef: ref,
  }
}

export const useAccountsByBlockchainsSelector = (blockchains: TBlockchainServiceKey[]) => {
  const { value: accountsByBlockchains, ref: accountsByBlockchainsRef } = useAppSelector(
    selectAccountsByBlockchains(blockchains)
  )

  return { accountsByBlockchains, accountsByBlockchainsRef }
}

export const useAccountsMapSelector = () => {
  const accountsMapRef = useRef(new Map<string, TAccountWithWallet>())

  useSelector((state: TRootState) => {
    const accounts = selectAccountsWithWallet(state)

    accountsMapRef.current.clear()

    accountsMapRef.current = new Map<string, TAccountWithWallet>()

    accounts.forEach(account => {
      accountsMapRef.current.set(AccountHelper.buildAccountKey(account), account)
    })
  })

  return { accountsMapRef }
}

export const useHardwareAccountsSelector = () => {
  const { ref, value } = useAppSelector(selectHardwareAccounts)

  return {
    hardwareAccounts: value,
    hardwareAccountsRef: ref,
  }
}

export const useHasHardwareAccountSelector = () => {
  const { ref, value } = useAppSelector(selectHasHardwareAccount)

  return {
    hasHardwareAccount: value,
    hasHardwareAccountRef: ref,
  }
}
