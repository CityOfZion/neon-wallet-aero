import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { cloneDeep } from 'lodash'

import { AccountHelper } from '@/helpers/AccountHelper'
import { EncryptionHelper } from '@/helpers/EncryptionHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'
import { bsAggregator } from '@/libs/blockchainService'
import { authReducerActions } from '@/store/reducers/AuthReducer'
import { utilityReducerActions } from '@/store/reducers/UtilityReducer'
import {
  TAccountToCreate,
  TAccountToEdit,
  TAccountToImport,
  TImportAccountsParam,
  TWalletToCreate,
  TWalletToEdit,
} from '@/types/blockchain'
import { IAccountState, IWalletState } from '@/types/store'

import { useLoginSessionSelector } from './useAuthSelector'
import { useAppDispatch } from './useRedux'

export function useBlockchainActions() {
  const dispatch = useAppDispatch()
  const { loginSessionRef } = useLoginSessionSelector()
  const { t } = useTranslation('common', { keyPrefix: 'account' })

  const createWallet = useCallback(
    async ({ name, mnemonic, id, type = 'standard' }: TWalletToCreate) => {
      if (!loginSessionRef.current) {
        throw new Error('Login session not defined')
      }

      let encryptedMnemonic: string | undefined

      if (mnemonic) {
        encryptedMnemonic = await EncryptionHelper.encrypt(mnemonic, loginSessionRef.current.encryptedPassword)
      }

      const newWallet: IWalletState = {
        name,
        id: id ?? UtilsHelper.uuid(),
        encryptedMnemonic,
        type,
        accounts: [],
      }

      dispatch(authReducerActions.saveWallet(newWallet))

      return newWallet
    },
    [dispatch, loginSessionRef]
  )

  const createStandardAccount = useCallback(
    async ({ blockchain, name, wallet, skin, id }: TAccountToCreate) => {
      if (!loginSessionRef.current) {
        throw new Error('Login session not defined')
      }

      if (!wallet.encryptedMnemonic) throw new Error('Problem to create account')

      const mnemonic = await EncryptionHelper.decrypt(
        wallet.encryptedMnemonic,
        loginSessionRef.current.encryptedPassword
      )

      const accountOrder = AccountHelper.getNextOrderOrMissing(wallet.accounts, blockchain)
      const service = bsAggregator.blockchainServicesByName[blockchain]
      const generatedAccount = service.generateAccountFromMnemonic(mnemonic, accountOrder)

      const encryptedKey = await EncryptionHelper.encrypt(
        generatedAccount.key,
        loginSessionRef.current.encryptedPassword
      )

      const newAccount: IAccountState = {
        id: id ?? UtilsHelper.uuid(),
        idWallet: wallet.id,
        name,
        blockchain,
        skin: skin ?? UtilsHelper.generateColorSkin(),
        address: generatedAccount.address,
        type: 'standard',
        encryptedKey,
        order: accountOrder,
      }

      dispatch(authReducerActions.saveAccount(newAccount))

      const firstAccount = service.generateAccountFromMnemonic(mnemonic, 0)
      dispatch(
        utilityReducerActions.saveLastIndexByWallet({
          firstAccountAddress: firstAccount.address,
          index: accountOrder,
          blockchain,
        })
      )

      return newAccount
    },
    [loginSessionRef, dispatch]
  )

  const importAccount = useCallback(
    async ({ address, blockchain, type, wallet, key, name, order, skin }: TAccountToImport) => {
      let encryptedKey: string | undefined

      if (!loginSessionRef.current) {
        throw new Error('Login session not defined')
      }

      if (type === 'standard' || type === 'hardware') {
        if (!key) throw new Error('Key not defined')
        encryptedKey = await EncryptionHelper.encrypt(key, loginSessionRef.current.encryptedPassword)
      }

      const accountOrder = order ?? AccountHelper.getNextOrderOrMissing(wallet.accounts, blockchain)

      const newAccount: IAccountState = {
        id: UtilsHelper.uuid(),
        idWallet: wallet.id,
        name: name ?? t('defaultName', { accountNumber: accountOrder + 1 }),
        blockchain,
        skin: skin ?? UtilsHelper.generateColorSkin(),
        address,
        type,
        encryptedKey,
        order: accountOrder,
      }

      dispatch(authReducerActions.saveAccount(newAccount))

      return newAccount
    },
    [loginSessionRef, t, dispatch]
  )

  const importAccounts = useCallback(
    async ({ accounts: accountsToImport, wallet }: TImportAccountsParam) => {
      if (!loginSessionRef.current) {
        throw new Error('Login session not defined')
      }

      const clonedWallet = cloneDeep(wallet)

      for (const accountToImport of accountsToImport) {
        const account = await importAccount({ ...accountToImport, wallet: clonedWallet })

        clonedWallet.accounts = [...clonedWallet.accounts, account]
      }

      return clonedWallet.accounts
    },
    [loginSessionRef, importAccount]
  )

  const deleteAccount = useCallback(
    async (account: IAccountState) => {
      if (!loginSessionRef.current) {
        throw new Error('Login session not defined')
      }

      dispatch(authReducerActions.deleteAccount(account))
    },
    [loginSessionRef, dispatch]
  )

  const deleteWallet = useCallback(
    (walletId: string) => {
      dispatch(authReducerActions.deleteWallet(walletId))
    },
    [dispatch]
  )

  const editAccount = useCallback(
    async ({ account, data }: TAccountToEdit) => {
      if (!loginSessionRef.current) {
        throw new Error('Login session not defined')
      }

      let encryptedKey = account.encryptedKey

      if (data.key) {
        encryptedKey = await EncryptionHelper.encrypt(data.key, loginSessionRef.current.encryptedPassword)
        delete data.key
      }

      const editedAccount: IAccountState = { ...account, ...data, encryptedKey }

      dispatch(authReducerActions.saveAccount(editedAccount))

      return editedAccount
    },
    [dispatch, loginSessionRef]
  )

  const editWallet = useCallback(
    async ({ data, wallet }: TWalletToEdit) => {
      if (!loginSessionRef.current) {
        throw new Error('Login session not defined')
      }

      let encryptedMnemonic = wallet.encryptedMnemonic

      if (data.mnemonic) {
        encryptedMnemonic = await EncryptionHelper.encrypt(data.mnemonic, loginSessionRef.current.encryptedPassword)

        delete data.mnemonic
      }

      const editedWallet: IWalletState = { ...wallet, ...data, encryptedMnemonic }

      dispatch(authReducerActions.saveWallet(editedWallet))

      return editedWallet
    },
    [dispatch, loginSessionRef]
  )

  return {
    createWallet,
    createStandardAccount,
    importAccount,
    importAccounts,
    deleteWallet,
    deleteAccount,
    editAccount,
    editWallet,
  }
}
