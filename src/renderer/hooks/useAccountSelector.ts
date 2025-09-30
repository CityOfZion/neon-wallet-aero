import { useRef } from 'react'
import { useSelector } from 'react-redux'
import { AccountHelper } from '@renderer/helpers/AccountHelper'
import { SelectorHelper } from '@renderer/helpers/SelectorHelper'
import { blockchainNames } from '@renderer/libs/blockchainService'
import { IAccountState, TAccountWithWallet } from '@shared/types/store'
import orderBy from 'lodash/orderBy'

import { createAppSelector, TRootState, useAppSelector } from './useRedux'

const orderAccounts = (accounts: IAccountState[]) =>
  orderBy([...accounts], [({ blockchain }) => blockchainNames.indexOf(blockchain), 'order'], ['asc', 'asc'])

const selectAccounts = createAppSelector(
  [state => state.auth.data.applicationDataByLoginType, state => state.auth.inMemoryData.loginSession],
  (applicationDataByLoginType, loginSession) => {
    const accounts = applicationDataByLoginType[loginSession?.type ?? 'password'].wallets.flatMap(
      wallet => wallet.accounts
    )

    return orderAccounts(accounts)
  }
)

const selectAccountsWithWallet = createAppSelector(
  [state => state.auth.data.applicationDataByLoginType, state => state.auth.inMemoryData.loginSession],
  (applicationDataByLoginType, loginSession) => {
    const accounts = applicationDataByLoginType[loginSession?.type ?? 'password'].wallets.flatMap(wallet =>
      wallet.accounts.map(account => ({ ...account, wallet }))
    )

    return orderAccounts(accounts)
  }
)

const selectAccountsByWalletId = (walletId: string) =>
  createAppSelector(
    [state => state.auth.data.applicationDataByLoginType, state => state.auth.inMemoryData.loginSession],
    (applicationDataByLoginType, loginSession) => {
      const wallet = applicationDataByLoginType[loginSession?.type ?? 'password'].wallets.find(
        wallet => wallet.id === walletId
      )!

      return SelectorHelper.fallbackToEmptyArray(wallet?.accounts)
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

export const useAccountMapSelector = () => {
  const accountsMapRef = useRef<Map<string, TAccountWithWallet>>(new Map())

  useSelector((state: TRootState) => {
    const result = selectAccountsWithWallet(state)

    accountsMapRef.current = new Map<string, TAccountWithWallet>()

    result.forEach(account => {
      accountsMapRef.current.set(AccountHelper.buildAccountKey(account), account as TAccountWithWallet)
    })
  })

  return {
    accountsMapRef,
  }
}
