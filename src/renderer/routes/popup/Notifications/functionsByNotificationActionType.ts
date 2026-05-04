import type { useNavigate } from 'react-router-dom'
import { match } from 'ts-pattern'

import { AccountHelper } from '@renderer/helpers/AccountHelper'
import { ReduxHelper } from '@renderer/helpers/ReduxHelper'

import { selectAccounts } from '@renderer/hooks/useAccountSelector'
import type { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { selectWalletById } from '@renderer/hooks/useWalletSelector'

import type { TAccountHelperPredicateParams } from '@shared/types/helpers'
import type { TAccount, TNotificationAction, TWallet } from '@shared/types/store'

type TFunctionParams<T> = {
  modalActions: ReturnType<typeof useModalNavigate>
  popupNavigate: ReturnType<typeof useNavigate>
  notificationAction: T
}

type TFunctionsByNotificationActionType = {
  [K in TNotificationAction['type']]: (params: TFunctionParams<TNotificationAction & { type: K }>) => Promise<void>
}

const getAccount = (predicate: TAccountHelperPredicateParams): TAccount => {
  const state = ReduxHelper.store.getState()
  const accounts = selectAccounts(state)
  const account = accounts.find(AccountHelper.predicate(predicate))

  if (!account) throw new Error('Account not found')

  return account
}

const getWalletByAccount = (account: TAccount): TWallet => {
  const state = ReduxHelper.store.getState()
  const wallet = selectWalletById(account.idWallet)(state)

  if (!wallet) throw new Error('Wallet not found')

  return wallet
}

export const functionsByNotificationActionType: TFunctionsByNotificationActionType = {
  navigate: async ({ modalActions, popupNavigate, notificationAction }) => {
    match(notificationAction.payload)
      .with({ to: 'account-tokens' }, ({ address, blockchain }) => {
        const account = getAccount({ address, blockchain })
        const wallet = getWalletByAccount(account)

        modalActions.modalErase('side')
        popupNavigate('/wallets', { state: { wallet, account, tab: 'tokens' }, replace: true })
      })
      .with({ to: 'account-transactions' }, payload => {
        const account = getAccount(payload)
        const wallet = getWalletByAccount(account)

        modalActions.modalErase('side')
        popupNavigate('/wallets', { state: { wallet, account, tab: 'transactions' }, replace: true })
      })
      .with({ to: 'hide-fraudulent-token' }, ({ address, blockchain, tokenHash }) => {
        const account = getAccount({ address, blockchain })

        modalActions.modalErase('side')
        modalActions.modalNavigate('hide-fraudulent-token', { state: { tokenHash, account } })
      })
      .with({ to: 'neo3-vote' }, payload => {
        const initialNeoAccount = getAccount(payload)
        const initialWallet = getWalletByAccount(initialNeoAccount)

        modalActions.modalErase('side')
        popupNavigate('/neo3-vote', { state: { initialNeoAccount, initialWallet }, replace: true })
      })
      .with({ to: 'backup-wallet' }, () => {
        modalActions.modalErase('side')
        popupNavigate('/settings/backup-and-restore/backup/1', { replace: true })
      })
      .otherwise(() => {
        // No action needed for unhandled navigation types
      })
  },
}
