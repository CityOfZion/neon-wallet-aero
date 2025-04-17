import { RefObject, useRef } from 'react'
import { useSelector } from 'react-redux'

import { AccountHelper } from '@/helpers/AccountHelper'
import { createAppSelector, TRootState } from '@/hooks/useRedux'
import { IAccountState } from '@/types/store'

const selectAccounts = createAppSelector(
  [state => state.auth.data.applicationDataByLoginType, state => state.auth.inMemoryData.loginSession],
  (applicationDataByLoginType, loginSession) =>
    applicationDataByLoginType[loginSession?.type ?? 'password'].wallets.flatMap(({ accounts }) => accounts)
)

export const useAccountsMapSelector = () => {
  const accountsMapRef = useRef<Map<string, IAccountState>>(null) as RefObject<Map<string, IAccountState>>

  useSelector((state: TRootState) => {
    const accounts = selectAccounts(state)

    accountsMapRef.current = new Map<string, IAccountState>()

    accounts.forEach(account => {
      accountsMapRef.current.set(AccountHelper.buildAccountKey(account), account)
    })
  })

  return { accountsMapRef }
}
