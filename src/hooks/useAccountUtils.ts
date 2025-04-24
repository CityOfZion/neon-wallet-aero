import { useCallback } from 'react'

import { AccountHelper } from '@/helpers/AccountHelper'
import { useAccountsMapSelector } from '@/hooks/useAccountsMapSelector'
import { TAccountHelperPredicateParams } from '@/types/helpers'

export const useAccountUtils = () => {
  const { accountsMapRef } = useAccountsMapSelector()

  const doesAccountExist = useCallback(
    (params: TAccountHelperPredicateParams) => accountsMapRef.current.has(AccountHelper.buildAccountKey(params)),
    [accountsMapRef]
  )

  return { doesAccountExist }
}
