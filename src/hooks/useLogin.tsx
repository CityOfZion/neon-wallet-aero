import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { LOGIN_CONTROL_VALUE } from '@/constants/password'
import { EncryptionHelper } from '@/helpers/EncryptionHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'
import { WorkerHelper } from '@/helpers/WorkerHelper'
import { authReducerActions } from '@/store/reducers/AuthReducer'
import { TAccountsToImport, TWalletToCreate } from '@/types/blockchain'
import { TLoginSession } from '@/types/store'
import { TWorkerCloseAllTabsMessage, TWorkerSaveLoginSessionMessage } from '@/types/worker-events'

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

      await WorkerHelper.send<TWorkerSaveLoginSessionMessage>({
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

      await WorkerHelper.send<TWorkerSaveLoginSessionMessage>({
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

    await WorkerHelper.send<TWorkerCloseAllTabsMessage>({ type: 'close-all-tabs' })

    await WorkerHelper.send<TWorkerSaveLoginSessionMessage>({
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
