import { useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'
import { SelectableAccountList } from '@renderer/components/SelectableAccountList'

import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'
import { useLogin } from '@renderer/hooks/useLogin'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { useAppDispatch } from '@renderer/hooks/useRedux'
import { useSelectedAccountSelector } from '@renderer/hooks/useSettingsSelector'
import { useWalletByIdSelector } from '@renderer/hooks/useWalletSelector'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import TbFileExport from '@renderer/assets/images/tb-file-export.svg?react'
import TbPencil from '@renderer/assets/images/tb-pencil.svg?react'
import TbPlus from '@renderer/assets/images/tb-plus.svg?react'
import TbWallet from '@renderer/assets/images/tb-wallet.svg?react'

import { settingsReducerActions } from '@renderer/store/reducers/settings'
import type { TModalState } from '@shared/types/modal'
import type { IAccountState } from '@shared/types/store'

export const AccountSelectionModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'accountSelection' })
  const { t: modalT } = useTranslation('modals', { keyPrefix: 'confirmPasswordExport' })
  const { loginSession, loginSessionRef } = useLoginSessionSelector()
  const { encryptPassword } = useLogin()
  const { walletId, onSelect } = useModalState<TModalState<'account-selection'>>()
  const { wallet } = useWalletByIdSelector(walletId)
  const { selectedAccount } = useSelectedAccountSelector()
  const { modalNavigate, modalNavigateWrapper } = useModalNavigate()

  const dispatch = useAppDispatch()

  const handleSelect = (account: IAccountState) => {
    dispatch(settingsReducerActions.setSelectedAccount(account))
    onSelect?.(account)
  }

  const handleEditAccount = () => {
    if (!selectedAccount) return

    modalNavigate('account-edit-list', {
      state: {
        walletId,
      },
    })
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
                account: selectedAccount ?? wallet!.accounts[0],
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
        <p className="text-blue truncate text-sm">{wallet?.name}</p>
      </div>

      <SelectableAccountList
        accounts={wallet!.accounts}
        onSelectAccount={handleSelect}
        selectedAccountId={selectedAccount?.id}
      />

      <div className="mt-auto flex gap-2.5">
        <Button
          className="w-full"
          variant="card"
          colorSchema="gray"
          label={t('editButtonLabel')}
          leftIcon={<TbPencil aria-hidden />}
          iconsOnEdge={false}
          onClick={handleEditAccount}
        />

        {!!selectedAccount?.encryptedKey && loginSession?.type === 'password' && (
          <Button
            label={t('exportButtonLabel')}
            variant="card"
            className="w-full"
            colorSchema="gray"
            iconsOnEdge={false}
            leftIcon={<TbFileExport aria-hidden />}
            onClick={handleGoToConfirmPasswordModal}
          />
        )}

        <Button
          className="w-full"
          variant="card"
          label={t('addButtonLabel')}
          leftIcon={<TbPlus aria-hidden />}
          iconsOnEdge={false}
          onClick={modalNavigateWrapper('create-account-1', { replace: true })}
        />
      </div>
    </BottomModalLayout>
  )
}

export default AccountSelectionModal
