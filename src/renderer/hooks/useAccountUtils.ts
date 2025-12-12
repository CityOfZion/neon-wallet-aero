import { useCallback } from 'react'

import { AccountHelper } from '@renderer/helpers/AccountHelper'

import { useAccountsMapSelector } from '@renderer/hooks/useAccountSelector'
import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'

import type { TAccountHelperPredicateParams } from '@shared/types/helpers'

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
