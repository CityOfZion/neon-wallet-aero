import { useCallback, useLayoutEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { IconButton } from '@renderer/components/IconButton'

import { useAccountsSelector } from '@renderer/hooks/useAccountSelector'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { useAppDispatch } from '@renderer/hooks/useRedux'
import { useSelectedAccountSelector, useSelectedWalletSelector } from '@renderer/hooks/useSettingsSelector'
import { useWalletsSelector } from '@renderer/hooks/useWalletSelector'

import { ScreenLayout } from '@renderer/layouts/ScreenLayout'

import TbMenu2 from '@renderer/assets/images/tb-menu-2.svg?react'

import { settingsReducerActions } from '@renderer/store/reducers/settings'
import type { IAccountState, IWalletState } from '@shared/types/store'

import { WalletsPageOverview } from './WalletsPageOverview'
import { WalletsPageSelectButton } from './WalletsPageSelectButton'

export const WalletsPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'wallets' })
  const { wallets } = useWalletsSelector()
  const { accounts } = useAccountsSelector()
  const navigate = useNavigate()
  const { modalNavigate, modalNavigateWrapper, modalErase } = useModalNavigate()
  const { selectedWallet } = useSelectedWalletSelector()
  const { selectedAccount } = useSelectedAccountSelector()
  const dispatch = useAppDispatch()

  const handleNavigateSelect = useCallback(
    (wallet: IWalletState, account: IAccountState) => {
      navigate('/wallets', { state: { account, wallet }, replace: true })
    },
    [navigate]
  )

  const handleWalletSelect = () => {
    modalNavigate('wallet-selection', {
      state: {
        selectedWallet,
        onSelect: wallet => {
          modalNavigate('account-selection', {
            state: {
              walletId: wallet.id,
              selectedAccount,
              onSelect: account => {
                handleNavigateSelect(wallet, account)
                modalErase('bottom')
              },
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
        onSelect: (account: IAccountState) => {
          handleNavigateSelect(selectedWallet!, account)
          modalErase('bottom')
        },
      },
    })
  }

  useLayoutEffect(() => {
    const firstWallet = wallets.find(wallet => wallet.id === selectedWallet?.id) || wallets[0]
    const firstWalletAccounts = accounts.filter(account => account.idWallet === firstWallet.id)
    const firstAccount =
      (!!selectedAccount && firstWalletAccounts.find(account => account.id === selectedAccount.id)) ||
      firstWalletAccounts[0]

    if (firstWallet) {
      dispatch(settingsReducerActions.setSelectedWallet(firstWallet))
    }

    if (firstAccount) {
      dispatch(settingsReducerActions.setSelectedAccount(firstAccount))
    }
  }, [wallets, selectedAccount, selectedWallet, dispatch, accounts])

  return (
    <ScreenLayout>
      <div className="flex items-end justify-between">
        <div className="-ml-2 flex gap-2">
          <WalletsPageSelectButton
            label={t('labelWalletSelectButton')}
            selectedLabel={selectedWallet?.name ?? t('placeholderWalletSelectButton')}
            onClick={handleWalletSelect}
          />

          <WalletsPageSelectButton
            label={t('labelAccountSelectButton')}
            selectedLabel={selectedAccount?.name ?? t('placeholderWalletSelectButton')}
            onClick={handleAccountSelect}
            disabled={!selectedWallet}
          />
        </div>

        <IconButton
          aria-label={t('ariaLabels.menuIconButton')}
          className="mb-0.5"
          icon={<TbMenu2 aria-hidden />}
          onClick={modalNavigateWrapper('menu')}
        />
      </div>

      {selectedWallet && selectedAccount && (
        <WalletsPageOverview selectedAccount={selectedAccount} selectedWallet={selectedWallet} />
      )}
    </ScreenLayout>
  )
}

export default WalletsPage
