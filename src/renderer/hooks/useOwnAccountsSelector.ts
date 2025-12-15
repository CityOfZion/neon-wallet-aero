import { AccountHelper } from '@renderer/helpers/AccountHelper'
import { SelectorHelper } from '@renderer/helpers/SelectorHelper'

import { createAppSelector, useAppSelector } from '@renderer/hooks/useRedux'

import type { IAccountState } from '@shared/types/store'

const selectOwnAccounts = createAppSelector(
  [({ auth }) => auth.data.applicationDataByLoginType, ({ auth }) => auth.inMemoryData.loginSession],
  (applicationDataByLoginType, loginSession) => {
    if (!loginSession) return SelectorHelper.fallbackToEmptyArray<IAccountState>()

    const { wallets } = applicationDataByLoginType[loginSession.type]
    const accounts: IAccountState[] = []

    wallets
      .flatMap(wallet => wallet.accounts)
      .forEach(account => {
        const wallet = wallets.find(wallet => wallet.id === account.idWallet)

        if (account.type === 'watch' && (!wallet || wallet.type !== 'hardware')) return

        accounts.push(account)
      })

    return AccountHelper.orderAccounts(accounts)
  }
)

export const useOwnAccountsSelector = () => {
  const { value: ownAccounts, ref: ownAccountsRef } = useAppSelector(selectOwnAccounts)

  return { ownAccounts, ownAccountsRef }
}
