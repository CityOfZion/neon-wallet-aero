import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { BackgroundHelper } from '@renderer/helpers/BackgroundHelper'
import { EncryptionHelper } from '@renderer/helpers/EncryptionHelper'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'
import { authReducerActions } from '@renderer/store/reducers/auth'
import { LOGIN_CONTROL_VALUE } from '@shared/constants/password'
import { TBackgroundCloseAllTabsMessage, TBackgroundSaveLoginSessionMessage } from '@shared/types/background-events'
import { TAccountsToImport, TWalletToCreate } from '@shared/types/blockchain'
import { TLoginSession } from '@shared/types/store'

import { useBlockchainActions } from './useBlockchainActions'
import { useAppDispatch } from './useRedux'
import { useLoginControlSelector } from './useUtilitySelector'

export const useLogin = () => {
  const { t } = useTranslation('hooks', { keyPrefix: 'useLogin' })
  const dispatch = useAppDispatch()
  const { encryptedLoginControlRef } = useLoginControlSelector()
  const { createWallet, importAccounts } = useBlockchainActions()
  const navigate = useNavigate()

  const encryptPassword = useCallback(
    async (password: string) => {
      if (!encryptedLoginControlRef.current) {
        throw new Error(t('controlIsNotSet'))
      }

      return await EncryptionHelper.encryptedPassword(password)
    },
    [encryptedLoginControlRef, t]
  )

  const loginWithPassword = useCallback(
    async (password: string) => {
      const encryptedPassword = await encryptPassword(password)

      const decryptedLoginControl = await EncryptionHelper.decrypt(encryptedLoginControlRef.current, encryptedPassword)

      if (decryptedLoginControl !== LOGIN_CONTROL_VALUE) {
        throw new Error(t('controlIsNotValid'))
      }

      const loginSession: TLoginSession = {
        type: 'password',
        encryptedPassword,
      }

      await BackgroundHelper.send<TBackgroundSaveLoginSessionMessage>({
        type: 'save-login-session',
        payload: { loginSession },
      })

      dispatch(authReducerActions.setLoginSession(loginSession))
    },
    [encryptPassword, encryptedLoginControlRef, dispatch, t]
  )

  const loginWithKey = useCallback(
    async (accountsToCreate: TAccountsToImport, walletToCreate: TWalletToCreate) => {
      const randomPassword = UtilsHelper.uuid()
      const encryptedPassword = await EncryptionHelper.encryptedPassword(randomPassword)

      const loginSession: TLoginSession = {
        type: 'key',
        encryptedPassword,
      }

      await BackgroundHelper.send<TBackgroundSaveLoginSessionMessage>({
        type: 'save-login-session',
        payload: { loginSession },
      })

      dispatch(authReducerActions.setLoginSession(loginSession))

      const wallet = await createWallet(walletToCreate)

      await importAccounts({
        accounts: accountsToCreate,
        wallet,
      })
    },
    [createWallet, dispatch, importAccounts]
  )

  const logout = useCallback(async () => {
    const loginSession = undefined

    await BackgroundHelper.send<TBackgroundCloseAllTabsMessage>({ type: 'close-all-tabs' })

    await BackgroundHelper.send<TBackgroundSaveLoginSessionMessage>({
      type: 'save-login-session',
      payload: { loginSession },
    })

    dispatch(authReducerActions.setLoginSession(loginSession))

    navigate('/login', { replace: true })
  }, [dispatch, navigate])

  return {
    loginWithPassword,
    loginWithKey,
    encryptPassword,
    logout,
  }
}
