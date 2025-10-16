import { RefObject, useRef } from 'react'
import { useSelector } from 'react-redux'
import { AccountHelper } from '@renderer/helpers/AccountHelper'
import { SelectorHelper } from '@renderer/helpers/SelectorHelper'
import { createAppSelector } from '@renderer/hooks/useRedux'
import type { TRootState } from '@shared/types/redux'
import { IAccountState } from '@shared/types/store'

const selectAccounts = createAppSelector(
  [state => state.auth.data.applicationDataByLoginType, state => state.auth.inMemoryData.loginSession],
  (applicationDataByLoginType, loginSession) => {
    if (!loginSession?.type) return SelectorHelper.fallbackToEmptyArray<IAccountState>()

    return applicationDataByLoginType[loginSession.type].wallets.flatMap(({ accounts }) => accounts)
  }
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
