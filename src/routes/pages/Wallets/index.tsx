import { useCallback, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Location, useLocation, useNavigate } from 'react-router-dom'

import { IconButton } from '@/components/IconButton'
import { useAccountsWithWalletSelector } from '@/hooks/useAccountSelector'
import { useModalNavigate } from '@/hooks/useModalRouter'
import { useWalletsSelector } from '@/hooks/useWalletSelector'
import { ScreenLayout } from '@/layouts/ScreenLayout'
import { IAccountState, IWalletState } from '@/types/store'

import { WalletsPageOverview } from './WalletsPageOverview'
import { WalletsPageSelectButton } from './WalletsPageSelectButton'

import TbMenu2 from '@/assets/images/tb-menu-2.svg?react'

type TLocationState = {
  account?: IAccountState
  wallet?: IWalletState
}

export const WalletsPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'wallets' })
  const { state } = useLocation() as Location<TLocationState>
  const { wallets } = useWalletsSelector()
  const { accountsWithWallet } = useAccountsWithWalletSelector()
  const navigate = useNavigate()
  const { modalNavigate, modalErase } = useModalNavigate()

  const [selectedWallet, setSelectedWallet] = useState<IWalletState | undefined>()
  const [selectedAccount, setSelectedAccount] = useState<IAccountState | undefined>()

  const handleNavigateSelect = useCallback(
    (wallet: IWalletState, account: IAccountState) => {
      navigate(`/app/wallets`, { state: { account, wallet }, replace: true })
    },
    [navigate]
  )

  const handleWalletSelect = () => {
    modalNavigate('wallet-selection', {
      state: {
        selectedWallet,
        shouldGoBackOnSelect: false,
        onSelect: wallet => {
          modalNavigate('account-selection', {
            state: {
              wallet,
              selectedAccount,
              shouldGoBackOnSelect: false,
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
        wallet: selectedWallet!,
        selectedAccount,
        onSelect: (account: IAccountState) => {
          handleNavigateSelect(selectedWallet!, account)
        },
      },
    })
  }

  useLayoutEffect(() => {
    const navigateToFirstAccount = () => {
      const firstWallet = wallets[0]
      const firstAccount = firstWallet?.accounts[0]
      if (firstAccount) {
        handleNavigateSelect(firstWallet, firstAccount)
      }
    }

    if (!state?.account) {
      navigateToFirstAccount()
      return
    }

    const wallet = state?.wallet ?? wallets.find(wallet => wallet.id === state.account?.idWallet)

    setSelectedAccount(state.account)
    setSelectedWallet(wallet)
  }, [accountsWithWallet, handleNavigateSelect, state, wallets])

  return (
    <ScreenLayout>
      <div className="flex items-end justify-between">
        <div className="-ml-2 flex gap-9">
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

        <IconButton aria-label={t('ariaLabels.menuIconButton')} className="mb-0.5" icon={<TbMenu2 aria-hidden />} />
      </div>

      {selectedWallet && selectedAccount && (
        <WalletsPageOverview selectedAccount={selectedAccount} selectedWallet={selectedWallet} />
      )}
    </ScreenLayout>
  )
}
