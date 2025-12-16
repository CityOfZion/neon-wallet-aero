import { useCallback } from 'react'

import { BSKeychainHelper, type TBSAccount } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'

import { AccountHelper } from '@renderer/helpers/AccountHelper'
import { AppError } from '@renderer/helpers/ErrorHelper'
import { HardwareWalletHelper } from '@renderer/helpers/HardwareWalletHelper'

import { utilityReducerActions } from '@renderer/store/reducers/utility'
import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import type { IAccountState, IWalletState } from '@shared/types/store'

import { useAccountsMapSelector } from './useAccountSelector'
import { useLoginSessionSelector } from './useAuthSelector'
import { useBlockchainActions } from './useBlockchainActions'
import { useAppDispatch } from './useRedux'

export const useCreateHardwareWallet = () => {
  const { t: tCommon } = useTranslation('common')
  const { createWallet, editAccount, importAccount, editWallet } = useBlockchainActions()
  const { loginSessionRef } = useLoginSessionSelector()
  const { accountsMapRef } = useAccountsMapSelector()

  const createHardwareWallet = useCallback(
    async (accounts: TBSAccount<TBlockchainServiceKey>[]) => {
      if (!loginSessionRef.current) {
        throw new AppError(tCommon('errors.noLoginSession'))
      }

      const existentWalletsByBlockchain = new Map<TBlockchainServiceKey, IWalletState>()
      const groupedAccountInfosByBlockchain = new Map<
        TBlockchainServiceKey,
        {
          existentAccount?: IAccountState
          account: TBSAccount<TBlockchainServiceKey>
        }[]
      >()

      // Group accounts by blockchain and check if the wallet already exists
      accounts.forEach(account => {
        const existentAccount = accountsMapRef.current.get(AccountHelper.buildAccountKey(account))
        const existentWallet = existentAccount?.wallet

        const groupedInfo = groupedAccountInfosByBlockchain.get(account.blockchain) ?? []
        groupedInfo.push({ existentAccount, account })

        groupedAccountInfosByBlockchain.set(account.blockchain, groupedInfo)

        // If the wallet already exist, we reuse it
        if (existentWallet && !existentWalletsByBlockchain.has(account.blockchain)) {
          existentWalletsByBlockchain.set(account.blockchain, existentWallet)
        }
      })

      const newAccounts: IAccountState[] = []

      for (const [blockchain, accountInfos] of groupedAccountInfosByBlockchain.entries()) {
        const existentWallet = existentWalletsByBlockchain.get(blockchain)

        let wallet: IWalletState

        const walletName = tCommon('wallet.hardwareName', { blockchain: tCommon(`blockchain.${blockchain}`) })
        const walletType = 'hardware'
        if (!existentWallet) {
          wallet = await createWallet({
            name: walletName,
            type: walletType,
            backupStatus: 'successful',
          })
        } else {
          wallet = await editWallet({
            wallet: existentWallet,
            data: {
              name: walletName,
              type: walletType,
            },
          })
        }

        for (const info of accountInfos) {
          let account: IAccountState | undefined

          if (info.existentAccount) {
            account = await editAccount({
              account: info.existentAccount,
              data: {
                key: info.account.key,
                type: 'hardware',
              },
            })
          } else {
            account = await importAccount({
              address: info.account.address,
              blockchain: info.account.blockchain,
              type: 'hardware',
              key: info.account.key,
              wallet,
              order: BSKeychainHelper.extractIndexFromPath(info.account.bip44Path!),
            })
          }

          newAccounts.push(account)
        }
      }

      return newAccounts
    },
    [loginSessionRef, accountsMapRef, createWallet, tCommon, editWallet, editAccount, importAccount]
  )

  return {
    createHardwareWallet,
  }
}

export const useAddAccountHardwareWallet = () => {
  const { t: commonT } = useTranslation('common')
  const { loginSessionRef } = useLoginSessionSelector()
  const { importAccount } = useBlockchainActions()
  const dispatch = useAppDispatch()

  const addHardwareAccount = useCallback(
    async (wallet: IWalletState, accountName?: string) => {
      if (!loginSessionRef.current) {
        throw new AppError(commonT('errors.noLoginSession'))
      }

      if (wallet.type !== 'hardware') {
        throw new AppError(commonT('hardwareWallet.errors.accountIsNotHardware'))
      }

      // When a wallet is hardware, all accounts are from the same blockchain
      const blockchain = wallet.accounts[0].blockchain
      const accountOrder = AccountHelper.getNextOrderOrMissing(wallet.accounts, blockchain)
      const serviceAccount = await HardwareWalletHelper.getAccount({ index: accountOrder, blockchain })

      const account = await importAccount({
        ...serviceAccount,
        type: 'hardware',
        wallet,
        order: accountOrder,
        name: accountName || `Account ${accountOrder + 1}`,
      })

      const firstAccount = await HardwareWalletHelper.getAccount({ index: 0, blockchain })

      dispatch(
        utilityReducerActions.saveLastIndexByWallet({
          firstAccountAddress: firstAccount.address,
          index: accountOrder,
          blockchain,
        })
      )
      return account
    },
    [commonT, dispatch, importAccount, loginSessionRef]
  )

  return {
    addHardwareAccount,
  }
}
