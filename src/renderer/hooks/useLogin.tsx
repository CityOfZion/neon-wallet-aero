import { useCallback } from 'react'

import type { TBSAccount } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { EncryptionHelper } from '@renderer/helpers/EncryptionHelper'
import { AppError } from '@renderer/helpers/ErrorHelper'
import { HardwareWalletHelper } from '@renderer/helpers/HardwareWalletHelper'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'

import { authReducerActions } from '@renderer/store/reducers/auth'
import { settingsReducerActions } from '@renderer/store/reducers/settings'
import { utilityReducerActions } from '@renderer/store/reducers/utility'
import { rendererApi } from '@shared/message-api/renderer'
import type { TAccountsToImport, TBlockchainServiceKey, TWalletToCreate } from '@shared/types/blockchain'
import type { TLoginSession } from '@shared/types/store'

import { useBlockchainActions } from './useBlockchainActions'
import { useCreateHardwareWallet } from './useHardwareWallet'
import { useAppDispatch } from './useRedux'
import { useLoginControlSelector } from './useUtilitySelector'

const LOGIN_CONTROL_VALUE = 'true'

export const useLogin = () => {
  const { t } = useTranslation('hooks', { keyPrefix: 'useLogin' })
  const dispatch = useAppDispatch()
  const { encryptedLoginControlRef } = useLoginControlSelector()
  const { createWallet, importAccounts } = useBlockchainActions()
  const { createHardwareWallet } = useCreateHardwareWallet()

  const navigate = useNavigate()

  const encryptPassword = useCallback(
    async (password: string) => {
      if (!encryptedLoginControlRef.current) {
        throw new AppError(t('controlIsNotSet'))
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
        throw new AppError(t('controlIsNotValid'))
      }

      const loginSession: TLoginSession = {
        type: 'password',
        encryptedPassword,
      }

      await rendererApi.send('login:save-session', loginSession)

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

      await rendererApi.send('login:save-session', loginSession)

      dispatch(authReducerActions.setLoginSession(loginSession))

      const wallet = await createWallet(walletToCreate)

      await importAccounts({
        accounts: accountsToCreate,
        wallet,
      })
    },
    [createWallet, dispatch, importAccounts]
  )

  const loginWithHardwareWallet = useCallback(
    async (accounts: TBSAccount<TBlockchainServiceKey>[]) => {
      const randomPassword = UtilsHelper.uuid()
      const encryptedPassword = await EncryptionHelper.encryptedPassword(randomPassword)

      const loginSession: TLoginSession = {
        type: 'key',
        encryptedPassword,
      }

      await rendererApi.send('login:save-session', loginSession)

      dispatch(authReducerActions.setLoginSession(loginSession))

      // Prevent the login session from being not set within createHardwareWallet
      await UtilsHelper.sleep(500)

      await createHardwareWallet(accounts)
    },
    [createHardwareWallet, dispatch]
  )

  const logout = useCallback(async () => {
    const loginSession = undefined

    await rendererApi.send('login:save-session', loginSession)

    dispatch(settingsReducerActions.setSelectedWallet(undefined))
    dispatch(settingsReducerActions.setSelectedAccount(undefined))
    dispatch(authReducerActions.setLoginSession(loginSession))
    dispatch(authReducerActions.resetTemporaryApplicationData())
    await HardwareWalletHelper.disconnect()

    navigate('/login', { replace: true })

    await rendererApi.send('tab:close-all')
  }, [dispatch, navigate])

  return {
    loginWithPassword,
    loginWithKey,
    loginWithHardwareWallet,
    encryptPassword,
    logout,
  }
}

export const useSignup = () => {
  const dispatch = useAppDispatch()

  const signup = useCallback(
    async (password: string, isAlreadyEncrypted?: boolean) => {
      const encryptedPassword = !isAlreadyEncrypted ? await EncryptionHelper.encryptedPassword(password) : password

      const encryptedLoginControl = await EncryptionHelper.encrypt(LOGIN_CONTROL_VALUE, encryptedPassword)

      dispatch(utilityReducerActions.setEncryptedLoginControl(encryptedLoginControl))
      dispatch(authReducerActions.setLoginSession({ type: 'password', encryptedPassword }))
    },
    [dispatch]
  )

  return {
    signup,
  }
}
