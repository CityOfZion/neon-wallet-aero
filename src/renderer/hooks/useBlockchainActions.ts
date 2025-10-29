import { useCallback } from 'react'

import { hasWalletConnect } from '@cityofzion/blockchain-service'
import { WalletKitHelper } from '@cityofzion/bs-multichain'
import { cloneDeep } from 'lodash'
import { useTranslation } from 'react-i18next'

import { AccountHelper } from '@renderer/helpers/AccountHelper'
import { ContactsHelper } from '@renderer/helpers/ContactsHelper'
import { EncryptionHelper } from '@renderer/helpers/EncryptionHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'

import { bsAggregator } from '@renderer/libs/blockchain-service'
import { authReducerActions } from '@renderer/store/reducers/auth'
import { contactReducerActions } from '@renderer/store/reducers/contact'
import { utilityReducerActions } from '@renderer/store/reducers/utility'
import { rendererApi } from '@shared/message-api/renderer'
import type {
  TAccountToCreate,
  TAccountToEdit,
  TAccountToImport,
  TImportAccountsParam,
  TWalletToCreate,
  TWalletToEdit,
} from '@shared/types/blockchain'
import type { IAccountState, IWalletState, TContactState } from '@shared/types/store'

import { useAccountsSelector } from './useAccountSelector'
import { useLoginSessionSelector } from './useAuthSelector'
import { useAppDispatch } from './useRedux'
import { useWalletsSelector } from './useWalletSelector'

export function useBlockchainActions() {
  const dispatch = useAppDispatch()
  const { loginSessionRef } = useLoginSessionSelector()
  const { t } = useTranslation('common', { keyPrefix: 'account' })
  const { t: tHook } = useTranslation('hooks', { keyPrefix: 'useBlockchainActions' })
  const { wallets } = useWalletsSelector()
  const { accounts } = useAccountsSelector()

  const saveContacts = async (contacts: TContactState[]) => {
    if (!loginSessionRef.current?.encryptedPassword) return

    for (const contact of contacts) {
      const encryptedContact = await ContactsHelper.encryptContact(contact, loginSessionRef.current.encryptedPassword)
      dispatch(contactReducerActions.saveContact(encryptedContact))
    }
  }

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
      const filteredAccounts = accounts.filter(({ idWallet }) => idWallet === account.idWallet)

      if (filteredAccounts.length === 1) {
        ToastHelper.error({ message: tHook('errors.deleteLastAccountError') })
        return
      }

      const service = bsAggregator.blockchainServicesByName[account.blockchain]
      if (!hasWalletConnect(service)) return

      const sessions = await rendererApi.send('wallet-connect:get-sessions')
      const accountSessions = WalletKitHelper.filterSessions(Object.values(sessions), {
        addresses: [account.address],
        chains: [service.walletConnectService.chain],
      })
      await Promise.allSettled(
        accountSessions.map(session =>
          rendererApi.send('wallet-connect:disconnect', {
            topic: session.topic,
            reason: WalletKitHelper.getError('USER_DISCONNECTED'),
          })
        )
      )

      dispatch(authReducerActions.deleteAccount(account))
    },
    [dispatch, tHook, accounts]
  )

  const deleteWallet = useCallback(
    async (wallet: IWalletState) => {
      const isLastWallet = wallets.length === 1

      if (isLastWallet) {
        ToastHelper.error({ message: tHook('errors.deleteLastWalletError') })
        return
      }

      const sessions = await rendererApi.send('wallet-connect:get-sessions')

      const addresses: string[] = []
      const chains: string[] = []

      for (const account of wallet.accounts) {
        const service = bsAggregator.blockchainServicesByName[account.blockchain]
        if (!hasWalletConnect(service)) continue

        addresses.push(account.address)
        chains.push(service.walletConnectService.chain)
      }

      const accountSessions = WalletKitHelper.filterSessions(Object.values(sessions), { addresses, chains })
      await Promise.allSettled(
        accountSessions.map(session =>
          rendererApi.send('wallet-connect:disconnect', {
            topic: session.topic,
            reason: WalletKitHelper.getError('USER_DISCONNECTED'),
          })
        )
      )

      dispatch(authReducerActions.deleteWallet(wallet.id))
    },

    [dispatch, tHook, wallets]
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
    saveContacts,
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
