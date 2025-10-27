import { useState } from 'react'

import { useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'
import { Separator } from '@renderer/components/Separator'

import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'
import { useLogin } from '@renderer/hooks/useLogin'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { useAppDispatch } from '@renderer/hooks/useRedux'
import { useWalletsSelector } from '@renderer/hooks/useWalletSelector'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import TbChevronRight from '@renderer/assets/images/tb-chevron-right.svg?react'
import TbFileExport from '@renderer/assets/images/tb-file-export.svg?react'
import TbPlus from '@renderer/assets/images/tb-plus.svg?react'
import TbReorder from '@renderer/assets/images/tb-reorder.svg?react'
import TbWallet from '@renderer/assets/images/tb-wallet.svg?react'

import { settingsReducerActions } from '@renderer/store/reducers/settings'
import type { TModalState } from '@shared/types/modal'
import type { IWalletState } from '@shared/types/store'

export const WalletSelectionModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'walletSelection' })
  const { t: modalT } = useTranslation('modals', { keyPrefix: 'confirmPasswordExport' })
  const { wallets } = useWalletsSelector()
  const { loginSession, loginSessionRef } = useLoginSessionSelector()
  const { encryptPassword } = useLogin()
  const { modalNavigate, modalNavigateWrapper } = useModalNavigate()
  const { onSelect, selectedWallet } = useModalState<TModalState<'wallet-selection'>>()
  const dispatch = useAppDispatch()

  const [selectedWalletInternal, setSelectedWalletInternal] = useState<IWalletState | undefined>(selectedWallet)

  const handleSelect = (wallet: IWalletState) => {
    dispatch(settingsReducerActions.setSelectedWallet(wallet))
    setSelectedWalletInternal(wallet)
    onSelect?.(wallet)
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
            modalNavigate('export-mnemonic', {
              state: {
                wallet: selectedWalletInternal ?? wallets[0],
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
              aria-selected={selectedWalletInternal?.id === wallet.id}
              onClick={handleSelect.bind(null, wallet)}
              className="flex w-full cursor-pointer items-center justify-between gap-2.5 px-2.5 py-3.5 transition-colors hover:bg-gray-300/15 aria-selected:bg-gray-300/15 aria-selected:hover:bg-gray-300/30"
            >
              <p className="truncate text-sm text-white">{wallet.name}</p>

              <TbChevronRight className="h-6 max-h-6 min-h-6 w-6 max-w-6 min-w-6 text-gray-300" aria-hidden />
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
          onClick={modalNavigateWrapper('reorder-wallets')}
        />

        <Button
          className="w-full"
          variant="card"
          label={t('addButtonLabel')}
          leftIcon={<TbPlus aria-hidden />}
          iconsOnEdge={false}
          onClick={modalNavigateWrapper('create-wallet-1', { replace: true })}
        />

        {!!selectedWalletInternal?.encryptedMnemonic && loginSession?.type === 'password' && (
          <Button
            label={t('exportButtonLabel')}
            variant="card"
            colorSchema="gray"
            iconsOnEdge={false}
            leftIcon={<TbFileExport aria-hidden />}
            onClick={handleGoToConfirmPasswordModal}
          />
        )}
      </div>
    </BottomModalLayout>
  )
}

export default WalletSelectionModal
