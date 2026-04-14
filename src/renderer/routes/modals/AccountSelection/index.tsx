import { Fragment, useState } from 'react'

import { useTranslation } from 'react-i18next'

import { BlockchainIcon } from '@renderer/components/BlockchainIcon'
import { Button } from '@renderer/components/Button'
import { Separator } from '@renderer/components/Separator'

import { AppError } from '@renderer/helpers/ErrorHelper'
import { StringHelper } from '@renderer/helpers/StringHelper'
import { StyleHelper } from '@renderer/helpers/StyleHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { useHasHardwareAccountSelector } from '@renderer/hooks/useAccountSelector'
import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'
import { useLogin } from '@renderer/hooks/useLogin'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { useAppDispatch } from '@renderer/hooks/useRedux'
import { useSelectedAccountSelector } from '@renderer/hooks/useSettingsSelector'
import { useWalletByIdSelector } from '@renderer/hooks/useWalletSelector'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import TbChevronRight from '@renderer/assets/images/tb-chevron-right.svg?react'
import TbFileExport from '@renderer/assets/images/tb-file-export.svg?react'
import TbPencil from '@renderer/assets/images/tb-pencil.svg?react'
import TbPlus from '@renderer/assets/images/tb-plus.svg?react'
import TbWallet from '@renderer/assets/images/tb-wallet.svg?react'

import { settingsReducerActions } from '@renderer/store/reducers/settings'
import type { TModalState } from '@shared/types/modal'
import type { TAccount } from '@shared/types/store'

export const AccountSelectionModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'accountSelection' })
  const { t: tConfirmPassword } = useTranslation('modals', { keyPrefix: 'confirmPassword' })
  const { loginSession, loginSessionRef } = useLoginSessionSelector()
  const { encryptPassword } = useLogin()
  const {
    walletId,
    onSelect,
    hideActions,
    shouldPersistSelection = true,
    accountTypes,
  } = useModalState<TModalState<'account-selection'>>()
  const { wallet } = useWalletByIdSelector(walletId)
  const { hasHardwareAccount } = useHasHardwareAccountSelector()
  const { selectedAccount } = useSelectedAccountSelector()
  const { modalNavigate, modalNavigateWrapper } = useModalNavigate()
  const [editMode, setEditMode] = useState(false)

  const filteredAccounts =
    accountTypes && accountTypes.length > 0
      ? wallet?.accounts.filter(account => accountTypes.includes(account.type))
      : wallet?.accounts

  const dispatch = useAppDispatch()

  const handleSelect = (account: TAccount) => {
    if (shouldPersistSelection) {
      dispatch(settingsReducerActions.setSelectedAccount(account))
    }

    onSelect?.(account)
  }

  const handleEdit = (account: TAccount) => {
    if (!selectedAccount) return

    modalNavigate('account-edit', {
      state: {
        account,
      },
    })
  }

  const handleGoToConfirmPasswordModal = () => {
    modalNavigate('confirm-password', {
      state: {
        heading: t('exportAccountTitle'),
        description: tConfirmPassword('description'),
        buttonLabel: tConfirmPassword('buttonContinueLabel'),
        inputPlaceholder: tConfirmPassword('inputPlaceholder'),
        onSubmit: async (password: string) => {
          try {
            const encryptedPassword = await encryptPassword(password)

            if (loginSessionRef.current?.encryptedPassword !== encryptedPassword) {
              throw new AppError(tConfirmPassword('invalidPasswordError'))
            }

            modalNavigate('export-key', {
              state: {
                account: selectedAccount || wallet!.accounts[0],
              },
              replace: true,
            })
          } catch {
            ToastHelper.error({ message: t('exportError') })
          }
        },
      },
    })
  }

  return (
    <BottomModalLayout heading={editMode ? t('titleEdit') : t('title')}>
      <div className="bg-asphalt flex items-center gap-4 rounded px-3.5 py-2">
        <TbWallet className="text-blue min-size-6 max-size-6 size-6" aria-hidden />
        <p className="text-blue truncate text-sm">{wallet?.name}</p>
      </div>

      {filteredAccounts && filteredAccounts.length > 0 ? (
        <ul className="my-2.5 min-h-0 overflow-y-auto rounded">
          {filteredAccounts.map((account, index, array) => (
            <li key={account.id}>
              <button
                type="button"
                aria-selected={selectedAccount?.id === account.id}
                onClick={editMode ? handleEdit.bind(null, account) : handleSelect.bind(null, account)}
                className="flex w-full cursor-pointer items-center justify-between gap-2.5 px-2.5 py-3.5 transition-colors hover:bg-gray-300/15 aria-selected:bg-gray-300/15 aria-selected:hover:bg-gray-300/30"
              >
                <div className="min-w-0 text-left">
                  <div className="flex min-w-0 items-center gap-5">
                    <BlockchainIcon
                      blockchain={account.blockchain}
                      className={StyleHelper.mergeStyles('min-size-4 size-4 text-gray-100', {
                        'text-neon': editMode,
                      })}
                    />
                    <p className={StyleHelper.mergeStyles('truncate text-sm text-white', { 'text-neon': editMode })}>
                      {account.name}
                    </p>
                  </div>

                  <p className="mt-0.5 ml-9 truncate text-xs text-gray-400">
                    {StringHelper.truncateMiddle(account.address, 10)}
                  </p>
                </div>

                <TbChevronRight aria-hidden className="min-size-6 max-size-6 size-6 text-gray-300" />
              </button>

              {index + 1 !== array.length && <Separator />}
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex items-center justify-center py-8 text-gray-400">
          <p className="text-center text-base">{t('noAccountsFound')}</p>
        </div>
      )}

      {!hideActions && (
        <div className="mt-auto flex gap-2.5">
          {editMode ? (
            <Button
              label={t('cancelButtonLabel', { defaultValue: 'Cancel' })}
              className="w-full"
              variant="card"
              colorSchema="gray"
              onClick={() => setEditMode(false)}
            />
          ) : (
            <Fragment>
              <Button
                className="w-full"
                variant="card"
                colorSchema="gray"
                label={t('editButtonLabel')}
                leftIcon={<TbPencil aria-hidden />}
                iconsOnEdge={false}
                onClick={() => setEditMode(true)}
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

              {(wallet?.encryptedMnemonic || (wallet?.type === 'hardware' && hasHardwareAccount)) && (
                <Button
                  className="w-full"
                  variant="card"
                  label={t('addButtonLabel')}
                  leftIcon={<TbPlus aria-hidden />}
                  iconsOnEdge={false}
                  onClick={modalNavigateWrapper('create-account-1', { replace: true })}
                />
              )}
            </Fragment>
          )}
        </div>
      )}
    </BottomModalLayout>
  )
}

export default AccountSelectionModal
