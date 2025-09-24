import { useCallback } from 'react'

import { AccountHelper } from '@/helpers/AccountHelper'
import { useAccountsMapSelector } from '@/hooks/useAccountsMapSelector'
import { useLoginSessionSelector } from '@/hooks/useAuthSelector'
import { TAccountHelperPredicateParams } from '@/types/helpers'

export const useAccountUtils = () => {
  const { accountsMapRef } = useAccountsMapSelector()
  const { loginSessionRef } = useLoginSessionSelector()

  const doesAccountExist = useCallback(
    (params: TAccountHelperPredicateParams) =>
      loginSessionRef.current ? accountsMapRef.current.has(AccountHelper.buildAccountKey(params)) : false,
    [accountsMapRef, loginSessionRef]
  )

  return { doesAccountExist }
}
