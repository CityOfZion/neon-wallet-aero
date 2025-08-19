import { useTranslation } from 'react-i18next'

import { Button } from '@/components/Button'
import { Separator } from '@/components/Separator'
import { ToastHelper } from '@/helpers/ToastHelper'
import { useLoginSessionSelector } from '@/hooks/useAuthSelector'
import { useLogin } from '@/hooks/useLogin'
import { useModalNavigate, useModalState } from '@/hooks/useModalRouter'
import { useWalletsSelector } from '@/hooks/useWalletSelector'
import { BottomModalLayout } from '@/layouts/BottomModalLayout'
import { TModalState } from '@/types/modal'
import { IWalletState } from '@/types/store'

import TbChevronRight from '@/assets/images/tb-chevron-right.svg?react'
import TbFileExport from '@/assets/images/tb-file-export.svg?react'
import TbPlus from '@/assets/images/tb-plus.svg?react'
import TbReorder from '@/assets/images/tb-reorder.svg?react'
import TbWallet from '@/assets/images/tb-wallet.svg?react'

export const WalletSelectionModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'walletSelectionModal' })
  const { t: modalT } = useTranslation('modals', { keyPrefix: 'confirmPasswordExport' })
  const { wallets } = useWalletsSelector()
  const { loginSessionRef } = useLoginSessionSelector()
  const { encryptPassword } = useLogin()
  const { onSelect, selectedWallet, shouldGoBackOnSelect = true } = useModalState<TModalState<'wallet-selection'>>()
  const { modalNavigate, modalNavigateWrapper } = useModalNavigate()

  const handleSelect = (wallet: IWalletState) => {
    onSelect?.(wallet)

    if (shouldGoBackOnSelect) {
      modalNavigate(-1)
    }
  }

  const handleGoToConfirmPasswordModal = () => {
    modalNavigate('confirm-password', {
      state: {
        heading: t('exportWalletTitle'),
        description: modalT('description'),
        inputPlaceholder: modalT('inputPlaceholder'),
        buttonLabel: modalT('buttonContinueLabel'),
        onSubmit: async (password: string) => {
          try {
            if (!loginSessionRef.current) {
              throw new Error('Login session not defined')
            }

            const encryptedPassword = await encryptPassword(password)

            if (loginSessionRef.current.encryptedPassword !== encryptedPassword) {
              throw new Error('Invalid password')
            }
            modalNavigate('export-wallet', {
              state: {
                wallet: selectedWallet ?? wallets[0],
              },
              replace: true,
            })
          } catch {
            ToastHelper.error({ message: t('exportError') })
          }
        },
      },
      replace: true,
    })
  }

  return (
    <BottomModalLayout heading={t('title')}>
      <div className="bg-asphalt flex items-center gap-4 rounded px-3.5 py-2">
        <TbWallet className="text-blue h-6 w-6" aria-hidden />
        <h3 className="text-blue text-sm">{t('subtitle')}</h3>
      </div>

      <ul className="my-2.5 min-h-0 overflow-y-auto rounded">
        {wallets.map((wallet, index, array) => (
          <li key={wallet.id}>
            <button
              aria-selected={selectedWallet?.id === wallet.id}
              onClick={handleSelect.bind(null, wallet)}
              className="flex w-full cursor-pointer items-center justify-between gap-2.5 px-2.5 py-3.5 transition-colors hover:bg-gray-300/15 aria-selected:bg-gray-300/15 aria-selected:hover:bg-gray-300/30"
            >
              <p className="truncate text-sm text-white">{wallet.name}</p>

              <TbChevronRight className="h-6 min-h-6 w-6 min-w-6 text-gray-300" aria-hidden />
            </button>

            {index + 1 !== array.length && <Separator />}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex gap-2.5">
        <Button
          variant="card"
          label={t('reorderButtonLabel')}
          colorSchema="gray"
          leftIcon={<TbReorder aria-hidden />}
        />
        <Button
          className="w-full"
          variant="card"
          label={t('addButtonLabel')}
          leftIcon={<TbPlus aria-hidden />}
          iconsOnEdge={false}
          onClick={modalNavigateWrapper('create-wallet-1', { replace: true })}
        />
        <Button
          variant="card"
          label={t('exportButtonLabel')}
          colorSchema="gray"
          leftIcon={<TbFileExport aria-hidden />}
          iconsOnEdge={false}
          onClick={handleGoToConfirmPasswordModal}
        />
      </div>
    </BottomModalLayout>
  )
}
