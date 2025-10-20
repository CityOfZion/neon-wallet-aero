import { useState } from 'react'

import { useTranslation } from 'react-i18next'

import { BlockchainIcon } from '@renderer/components/BlockchainIcon'
import { Button } from '@renderer/components/Button'
import { Separator } from '@renderer/components/Separator'

import { StringHelper } from '@renderer/helpers/StringHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { useAccountsByWalletIdSelector } from '@renderer/hooks/useAccountSelector'
import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'
import { useLogin } from '@renderer/hooks/useLogin'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import TbChevronRight from '@renderer/assets/images/tb-chevron-right.svg?react'
import TbFileExport from '@renderer/assets/images/tb-file-export.svg?react'
import TbPlus from '@renderer/assets/images/tb-plus.svg?react'
import TbWallet from '@renderer/assets/images/tb-wallet.svg?react'

import type { TModalState } from '@shared/types/modal'
import type { IAccountState } from '@shared/types/store'

export const AccountSelectionModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'accountSelectionModal' })
  const { t: modalT } = useTranslation('modals', { keyPrefix: 'confirmPasswordExport' })
  const { loginSession, loginSessionRef } = useLoginSessionSelector()
  const { encryptPassword } = useLogin()
  const { wallet, selectedAccount, onSelect } = useModalState<TModalState<'account-selection'>>()
  const { modalNavigate } = useModalNavigate()
  const { accountsByWalletId } = useAccountsByWalletIdSelector(wallet.id)

  const [selectedAccountInternal, setSelectedAccountInternal] = useState<IAccountState | undefined>(selectedAccount)

  const handleSelect = (account: IAccountState) => {
    setSelectedAccountInternal(account)
    onSelect?.(account)
  }

  const handleGoToConfirmPasswordModal = () => {
    modalNavigate('confirm-password', {
      state: {
        heading: t('exportAccountTitle'),
        description: modalT('description'),
        buttonLabel: modalT('buttonContinueLabel'),
        inputPlaceholder: modalT('inputPlaceholder'),
        onSubmit: async (password: string) => {
          try {
            if (!loginSessionRef.current) {
              throw new Error('Login session not defined')
            }

            const encryptedPassword = await encryptPassword(password)

            if (loginSessionRef.current.encryptedPassword !== encryptedPassword) {
              throw new Error('Invalid password')
            }

            modalNavigate('export-key', {
              state: {
                account: selectedAccountInternal ?? accountsByWalletId[0],
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
        <TbWallet className="text-blue h-6 max-h-6 min-h-6 w-6 max-w-6 min-w-6" aria-hidden />
        <p className="text-blue truncate text-sm">{wallet.name}</p>
      </div>

      <ul className="my-2.5 min-h-0 overflow-y-auto rounded">
        {accountsByWalletId.map((account, index, array) => (
          <li key={account.id}>
            <button
              aria-selected={selectedAccountInternal?.id === account.id}
              onClick={handleSelect.bind(null, account)}
              className="flex w-full cursor-pointer items-center justify-between gap-2.5 px-2.5 py-3.5 transition-colors hover:bg-gray-300/15 aria-selected:bg-gray-300/15 aria-selected:hover:bg-gray-300/30"
            >
              <div>
                <div className="flex min-w-0 items-center gap-5">
                  <BlockchainIcon blockchain={account.blockchain} className="h-4 min-h-4 w-4 min-w-4 text-gray-100" />
                  <p className="truncate text-sm text-white">{account.name}</p>
                </div>

                <p className="mt-0.5 ml-9 truncate text-xs text-gray-400">
                  {StringHelper.truncateMiddle(account.address, 10)}
                </p>
              </div>

              <TbChevronRight aria-hidden className="h-6 max-h-6 min-h-6 w-6 max-w-6 min-w-6 text-gray-300" />
            </button>

            {index + 1 !== array.length && <Separator />}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex gap-2.5">
        <Button
          className="w-full"
          variant="card"
          label={t('addButtonLabel')}
          leftIcon={<TbPlus aria-hidden />}
          iconsOnEdge={false}
          onClick={() => modalNavigate('create-account-1', { replace: true })}
        />

        {!!selectedAccountInternal?.encryptedKey && loginSession?.type === 'password' && (
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

export default AccountSelectionModal
