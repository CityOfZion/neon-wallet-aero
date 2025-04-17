import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { LOGIN_CONTROL_VALUE } from '@/constants/password'
import { EncryptionHelper } from '@/helpers/EncryptionHelper'
import { authReducerActions } from '@/store/reducers/AuthReducer'

import { useAppDispatch } from './useRedux'
import { useLoginControlSelector } from './useUtilitySelector'

export const useLogin = () => {
  const { encryptedLoginControlRef } = useLoginControlSelector()
  const dispatch = useAppDispatch()
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

  const logout = useCallback(async () => {
    dispatch(authReducerActions.setLoginSession(undefined))
  }, [dispatch])

  return {
    loginWithPassword,
    logout,
  }
}
