import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { LOGIN_CONTROL_VALUE } from '@/constants/password'
import { EncryptionHelper } from '@/helpers/EncryptionHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'
import { authReducerActions } from '@/store/reducers/AuthReducer'
import { TAccountsToImport, TWalletToCreate } from '@/types/blockchain'

import { useBlockchainActions } from './useBlockchainActions'
import { useAppDispatch } from './useRedux'
import { useLoginControlSelector } from './useUtilitySelector'

export const useLogin = () => {
  const { encryptedLoginControlRef } = useLoginControlSelector()
  const dispatch = useAppDispatch()
  const { createWallet, importAccounts } = useBlockchainActions()
  const { t } = useTranslation('hooks', { keyPrefix: 'useLogin' })

  const loginWithPassword = useCallback(
    async (password: string) => {
      if (!encryptedLoginControlRef.current) {
        throw new Error(t('controlIsNotSet'))
      }

      const encryptedPassword = await EncryptionHelper.encryptedPassword(password)

      const decryptedLoginControl = await EncryptionHelper.decrypt(encryptedLoginControlRef.current, encryptedPassword)

      if (decryptedLoginControl !== LOGIN_CONTROL_VALUE) {
        throw new Error(t('controlIsNotValid'))
      }

      dispatch(authReducerActions.setLoginSession({ type: 'password', encryptedPassword }))
    },
    [encryptedLoginControlRef, dispatch, t]
  )

  const loginWithKey = useCallback(
    async (accountsToCreate: TAccountsToImport, walletToCreate: TWalletToCreate) => {
      const randomPassword = UtilsHelper.uuid()
      const encryptedPassword = await EncryptionHelper.encryptedPassword(randomPassword)

      dispatch(authReducerActions.setLoginSession({ type: 'key', encryptedPassword }))

      const wallet = await createWallet(walletToCreate)

      await importAccounts({
        accounts: accountsToCreate,
        wallet,
      })
    },
    [createWallet, dispatch, importAccounts]
  )

  const logout = useCallback(async () => {
    dispatch(authReducerActions.setLoginSession(undefined))
  }, [dispatch])

  return {
    loginWithPassword,
    logout,
    loginWithKey,
  }
}
