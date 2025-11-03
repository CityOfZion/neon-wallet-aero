import { useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'
import { SelectableAccountList } from '@renderer/components/SelectableAccountList'

import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { useSelectedAccountSelector } from '@renderer/hooks/useSettingsSelector'
import { useWalletByIdSelector } from '@renderer/hooks/useWalletSelector'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import TbWallet from '@renderer/assets/images/tb-wallet.svg?react'

import type { TModalState } from '@shared/types/modal'
import type { IAccountState } from '@shared/types/store'

export const AccountEditListModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'accountEditList' })
  const { walletId } = useModalState<TModalState<'account-edit-list'>>()
  const { selectedAccount } = useSelectedAccountSelector()
  const { modalNavigate, modalNavigateWrapper } = useModalNavigate()
  const { wallet } = useWalletByIdSelector(walletId)

  const handlePickAccount = (account: IAccountState) => {
    modalNavigate('account-edit-form', {
      state: { account },
    })
  }

  return (
    <BottomModalLayout heading={t('title')}>
      <div className="bg-asphalt flex items-center gap-4 rounded px-3.5 py-2">
        <TbWallet className="text-blue h-6 max-h-6 min-h-6 w-6 max-w-6 min-w-6" aria-hidden />
        <p className="text-blue truncate text-sm">{wallet?.name}</p>
      </div>

      <SelectableAccountList
        accounts={wallet!.accounts}
        onSelectAccount={handlePickAccount}
        selectedAccountId={selectedAccount?.id}
      />

      <Button className="mt-auto" variant="card" label={t('cancelButtonLabel')} onClick={modalNavigateWrapper(-1)} />
    </BottomModalLayout>
  )
}

export default AccountEditListModal
