import { SelectorHelper } from '@renderer/helpers/SelectorHelper'
import { blockchainNames } from '@renderer/libs/blockchainService'
import { IAccountState } from '@shared/types/store'
import orderBy from 'lodash/orderBy'

import { createAppSelector, useAppSelector } from './useRedux'

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
