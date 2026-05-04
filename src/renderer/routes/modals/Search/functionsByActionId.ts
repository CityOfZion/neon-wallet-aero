import type { useNavigate } from 'react-router-dom'

import type { useModalNavigate } from '@renderer/hooks/useModalRouter'

import { EBuyAndSellTokensTab } from '@renderer/routes/tab/BuyAndSellTokens'

import { rendererApi } from '@shared/message-api/renderer'
import type { TAccount } from '@shared/types/store'

type TFunctionParams = {
  modalActions: ReturnType<typeof useModalNavigate>
  popupNavigate: ReturnType<typeof useNavigate>
}

type TFunctionsByActionId = {
  [K in string]: (params: TFunctionParams) => Promise<void>
}

export const functionsByActionId: TFunctionsByActionId = {
  transfer: async ({ popupNavigate, modalActions }) => {
    popupNavigate('/send')
    modalActions.modalErase('bottom')
  },
  swap: async ({ popupNavigate, modalActions }) => {
    popupNavigate('/swap')
    modalActions.modalErase('bottom')
  },
  viewContacts: async ({ popupNavigate, modalActions }) => {
    popupNavigate('/contacts')
    modalActions.modalErase('bottom')
  },
  createContact: async ({ modalActions, popupNavigate }) => {
    popupNavigate('/contacts')
    modalActions.modalNavigate('save-contact', { replace: true })
  },
  connect: async ({ modalActions }) => {
    modalActions.modalNavigate('wallet-selection', {
      state: {
        hideActions: true,
        onSelect: wallet => {
          modalActions.modalNavigate('account-selection', {
            state: {
              walletId: wallet.id,
              hideActions: true,
              accountTypes: ['standard', 'hardware'],
              onSelect: (account: TAccount) => {
                modalActions.modalNavigate('dapp-connection', { state: { account } })
              },
            },
          })
        },
      },
    })
  },
  buy: async () => {
    rendererApi.send('tab:open', { href: '/buy-and-sell-tokens', query: { tab: EBuyAndSellTokensTab.BUY_TOKENS } })
  },
  sell: async () => {
    rendererApi.send('tab:open', {
      href: '/buy-and-sell-tokens',
      query: { tab: EBuyAndSellTokensTab.SELL_TOKENS },
    })
  },
  createWallet: async ({ modalActions }) => {
    modalActions.modalNavigate('create-wallet-1', { replace: true })
  },
  import: async ({ popupNavigate, modalActions }) => {
    modalActions.modalErase('bottom')
    popupNavigate('/import')
  },
  createBackup: async ({ popupNavigate, modalActions }) => {
    modalActions.modalErase('bottom')
    popupNavigate('/settings/backup-and-restore/backup/1', { state: { tab: 'backup' } })
  },
  restoreBackup: async ({ popupNavigate, modalActions }) => {
    modalActions.modalErase('bottom')
    popupNavigate('/settings/backup-and-restore/restore/1', { state: { tab: 'restore' } })
  },
  neo3Vote: async ({ modalActions, popupNavigate }) => {
    modalActions.modalErase('bottom')
    popupNavigate('/neo3-vote')
  },
  neo3NeoXBridge: async ({ modalActions, popupNavigate }) => {
    modalActions.modalErase('bottom')
    popupNavigate('/neo3-neox-bridge')
  },
}
