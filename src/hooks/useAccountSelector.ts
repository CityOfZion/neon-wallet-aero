import orderBy from 'lodash/orderBy'

import { blockchainNames } from '@/libs/blockchainService'
import { IAccountState } from '@/types/store'

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
