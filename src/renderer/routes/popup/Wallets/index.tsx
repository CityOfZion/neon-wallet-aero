import { useLayoutEffect } from 'react'

import isEqual from 'lodash/isEqual'
import { useTranslation } from 'react-i18next'
import type { Location } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

import { IconButton } from '@renderer/components/IconButton'
import { IconLink } from '@renderer/components/IconLink'

import { AccountHelper } from '@renderer/helpers/AccountHelper'
import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { useAccountsMapSelector } from '@renderer/hooks/useAccountSelector'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { useHasUnreadNotificationSelector } from '@renderer/hooks/useNotificationsSelector'
import { useAppDispatch } from '@renderer/hooks/useRedux'
import { useSelectedAccountSelector, useSelectedWalletSelector } from '@renderer/hooks/useSettingsSelector'
import { useWalletsMapSelector, useWalletsSelector } from '@renderer/hooks/useWalletSelector'

import { ScreenLayout } from '@renderer/layouts/ScreenLayout'

import TbBell from '@renderer/assets/images/tb-bell.svg?react'
import TbMenu2 from '@renderer/assets/images/tb-menu-2.svg?react'

import { settingsReducerActions } from '@renderer/store/reducers/settings'
import type { IAccountState, IWalletState } from '@shared/types/store'

import { WalletsPageOverview } from './WalletsPageOverview'
import { WalletsPageSelectButton } from './WalletsPageSelectButton'

export type TWalletsTab = 'tokens' | 'nfts' | 'transactions' | 'dappConnections'

type TLocationState = {
  account?: IAccountState
  wallet?: IWalletState
  tab?: TWalletsTab
}

export const WalletsPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'wallets' })
  const dispatch = useAppDispatch()
  const { modalNavigate, modalNavigateWrapper, modalErase } = useModalNavigate()
  const { state } = useLocation() as Location<TLocationState>
  const { wallets } = useWalletsSelector()
  const { selectedWallet } = useSelectedWalletSelector()
  const { selectedAccount } = useSelectedAccountSelector()
  const { walletsMapRef } = useWalletsMapSelector()
  const { accountsMapRef } = useAccountsMapSelector()
  const { hasUnreadNotification } = useHasUnreadNotificationSelector()

  const stateWallet = state?.wallet
  const stateAccount = state?.account
  const stateTab = state?.tab

  const handleWalletSelect = () => {
    modalNavigate('wallet-selection', {
      state: {
        selectedWallet,
        onSelect: wallet => {
          modalNavigate('account-selection', {
            state: {
              walletId: wallet.id,
              selectedAccount,
              onSelect: () => modalErase('bottom'),
            },
          })
        },
      },
    })
  }

  const handleAccountSelect = () => {
    modalNavigate('account-selection', {
      state: {
        walletId: selectedWallet!.id,
        selectedAccount,
        onSelect: () => modalErase('bottom'),
      },
    })
  }

  useLayoutEffect(() => {
    const getNextSelectedWallet = () => {
      const firstWallet = wallets[0]

      if (stateWallet) {
        return walletsMapRef.current.get(stateWallet.id) ?? firstWallet
      }

      if (stateAccount) {
        return walletsMapRef.current.get(stateAccount.idWallet) ?? firstWallet
      }

      if (selectedWallet) {
        return walletsMapRef.current.get(selectedWallet.id) ?? firstWallet
      }

      return firstWallet
    }

    const getNextSelectedAccount = (nextSelectedWallet: IWalletState) => {
      const firstAccount = nextSelectedWallet.accounts[0]

      if (stateAccount?.idWallet === nextSelectedWallet.id) {
        return accountsMapRef.current.get(AccountHelper.buildAccountKey(stateAccount)) ?? firstAccount
      }

      if (selectedAccount?.idWallet === nextSelectedWallet.id) {
        return accountsMapRef.current.get(AccountHelper.buildAccountKey(selectedAccount)) ?? firstAccount
      }

      return nextSelectedWallet.accounts[0]
    }

    const nextSelectedWallet = getNextSelectedWallet()
    const nextSelectedAccount = getNextSelectedAccount(nextSelectedWallet)

    if (!isEqual(selectedWallet, nextSelectedWallet)) {
      dispatch(settingsReducerActions.setSelectedWallet(nextSelectedWallet))
    }

    if (!isEqual(selectedAccount, nextSelectedAccount)) {
      dispatch(settingsReducerActions.setSelectedAccount(nextSelectedAccount))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallets, stateWallet, stateAccount])

  return (
    <ScreenLayout>
      <div className="flex items-end justify-between gap-x-2">
        <div className="-ml-2 flex gap-2">
          <WalletsPageSelectButton
            label={t('labelWalletSelectButton')}
            selectedLabel={selectedWallet?.name ?? t('placeholderWalletSelectButton')}
            onClick={handleWalletSelect}
          />

          <WalletsPageSelectButton
            label={t('labelAccountSelectButton')}
            selectedLabel={selectedAccount?.name ?? t('placeholderAccountSelectButton')}
            onClick={handleAccountSelect}
            disabled={!selectedWallet}
          />
        </div>

        <div className="mb-0.5 flex items-center gap-x-1">
          <IconLink
            aria-label={t('ariaLabels.notificationsIconButton')}
            to="/notifications"
            icon={
              <div
                className={StyleHelper.mergeStyles('relative flex items-center justify-center text-center', {
                  "after:border-asphalt after:bg-pink after:absolute after:top-0.5 after:right-0.5 after:box-content after:block after:size-1 after:rounded-full after:border-2 after:content-['']":
                    hasUnreadNotification,
                })}
              >
                <TbBell aria-hidden className="size-full" />
              </div>
            }
          />

          <IconButton
            aria-label={t('ariaLabels.menuIconButton')}
            icon={<TbMenu2 aria-hidden />}
            onClick={modalNavigateWrapper('menu')}
          />
        </div>
      </div>

      {selectedWallet && selectedAccount && (
        <WalletsPageOverview selectedWallet={selectedWallet} selectedAccount={selectedAccount} defaultTab={stateTab} />
      )}
    </ScreenLayout>
  )
}

export default WalletsPage
