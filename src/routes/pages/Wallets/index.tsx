import { useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Location, useLocation, useNavigate } from 'react-router-dom'

import { IconButton } from '@/components/IconButton'
import { useAccountsWithWalletSelector } from '@/hooks/useAccountSelector'
import { useWalletsSelector } from '@/hooks/useWalletSelector'
import { MainLayout } from '@/layouts/MainLayout'
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

  const [selectedWallet, setSelectedWallet] = useState<IWalletState | undefined>()
  const [selectedAccount, setSelectedAccount] = useState<IAccountState | undefined>()

  useLayoutEffect(() => {
    const navigateToFirstAccount = () => {
      const firstWallet = wallets[0]
      const firstAccount = firstWallet?.accounts[0]
      if (firstAccount) {
        navigate(`/app/wallets`, { state: { account: firstAccount, wallet: firstWallet }, replace: true })
      }
    }

    if (!state?.account) {
      navigateToFirstAccount()
      return
    }

    const wallet = state?.wallet ?? wallets.find(wallet => wallet.id === state.account?.idWallet)

    setSelectedAccount(state.account)
    setSelectedWallet(wallet)
  }, [accountsWithWallet, navigate, state, wallets])

  return (
    <MainLayout id="parent">
      <div className="flex items-end justify-between">
        <div className="-ml-2 flex gap-9">
          <WalletsPageSelectButton
            label={t('labelWalletSelectButton')}
            selectedLabel={selectedWallet?.name ?? t('placeholderWalletSelectButton')}
          />
          <WalletsPageSelectButton
            label={t('labelAccountSelectButton')}
            selectedLabel={selectedAccount?.name ?? t('placeholderWalletSelectButton')}
          />
        </div>

        <IconButton aria-label={t('ariaLabels.menuIconButton')} className="mb-0.5" icon={<TbMenu2 aria-hidden />} />
      </div>

      {selectedWallet && selectedAccount && (
        <WalletsPageOverview selectedAccount={selectedAccount} selectedWallet={selectedWallet} />
      )}
    </MainLayout>
  )
}
