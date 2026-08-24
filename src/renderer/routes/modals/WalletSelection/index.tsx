import { Fragment, useEffect, useRef, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button } from '@renderer/components/Button'
import { IconButton } from '@renderer/components/IconButton'
import { Separator } from '@renderer/components/Separator'
import { Tooltip } from '@renderer/components/Tooltip'

import { StyleHelper } from '@renderer/helpers/StyleHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'
import { useLogin } from '@renderer/hooks/useLogin'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { useAppDispatch } from '@renderer/hooks/useRedux'
import { useWalletsSelector } from '@renderer/hooks/useWalletSelector'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import TbAlertTriangle from '@renderer/assets/images/tb-alert-triangle.svg?react'
import TbChevronRight from '@renderer/assets/images/tb-chevron-right.svg?react'
import TbFileExport from '@renderer/assets/images/tb-file-export.svg?react'
import TbPencil from '@renderer/assets/images/tb-pencil.svg?react'
import TbPlus from '@renderer/assets/images/tb-plus.svg?react'
import TbReorder from '@renderer/assets/images/tb-reorder.svg?react'
import TbWallet from '@renderer/assets/images/tb-wallet.svg?react'

import { settingsReducerActions } from '@renderer/store/reducers/settings'
import { AppError } from '@shared/helpers/ErrorHelper'
import type { TModalState } from '@shared/types/modal'
import type { TWallet } from '@shared/types/store'

type TWalletItemProps = {
  wallet: TWallet
  isSelected: boolean
  editMode: boolean
  isLast: boolean
  isPasswordLogin: boolean
  onSelect: (wallet: TWallet) => void
  onEdit: (wallet: TWallet) => void
}

const WalletItem = ({ wallet, isSelected, editMode, isLast, isPasswordLogin, onSelect, onEdit }: TWalletItemProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'walletSelection' })
  const ref = useRef<HTMLLIElement>(null)
  const { modalErase } = useModalNavigate()
  const navigate = useNavigate()

  const handleClick = () => {
    if (editMode) {
      onEdit(wallet)
      return
    }

    onSelect(wallet)
  }

  const handleBackupClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    modalErase('bottom')
    navigate('/settings/backup-and-restore/backup/1')
  }

  useEffect(() => {
    if (!isSelected) return

    ref.current?.scrollIntoView({ behavior: 'instant', block: 'start' })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <li ref={ref}>
      <button
        type="button"
        aria-selected={isSelected}
        onClick={handleClick}
        className="flex w-full cursor-pointer items-center justify-between gap-2.5 px-2.5 py-3.5 transition-colors hover:bg-gray-300/15 focus:bg-gray-300/15 active:bg-gray-300/15 aria-selected:bg-gray-300/15 aria-selected:hover:bg-gray-300/30 aria-selected:focus:bg-gray-300/30 aria-selected:active:bg-gray-300/15"
      >
        <p className={StyleHelper.mergeStyles('truncate text-sm text-white', { 'text-neon': editMode })}>
          {wallet.name}
        </p>

        <div className="flex items-center gap-x-2">
          {wallet.backupStatus === 'unsuccessful' && isPasswordLogin && (
            <Tooltip
              title={t('walletWithoutBackupLabel')}
              contentProps={{ className: 'bg-asphalt' }}
              arrowProps={{ className: 'fill-asphalt' }}
              delayDuration={0}
            >
              <button
                type="button"
                onClick={handleBackupClick}
                className="flex cursor-pointer items-center justify-center"
              >
                <TbAlertTriangle className="text-yellow max-size-6 min-size-6 size-6" aria-hidden />
              </button>
            </Tooltip>
          )}

          <TbChevronRight className="max-size-6 min-size-6 size-6 text-gray-300" aria-hidden />
        </div>
      </button>

      {!isLast && <Separator />}
    </li>
  )
}

export const WalletSelectionModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'walletSelection' })
  const { t: tConfirmPassword } = useTranslation('modals', { keyPrefix: 'confirmPassword' })
  const { wallets } = useWalletsSelector()
  const { loginSession, loginSessionRef } = useLoginSessionSelector()
  const { encryptPassword } = useLogin()
  const { modalNavigate, modalNavigateWrapper } = useModalNavigate()
  const {
    onSelect,
    selectedWallet,
    hideActions,
    shouldPersistSelection = true,
  } = useModalState<TModalState<'wallet-selection'>>()
  const dispatch = useAppDispatch()
  const [editMode, setEditMode] = useState(false)

  const isPasswordLogin = loginSession?.type === 'password'

  const handleSelect = (wallet: TWallet) => {
    if (shouldPersistSelection) {
      dispatch(settingsReducerActions.setSelectedWallet(wallet))
    }

    onSelect?.(wallet)
  }

  const handleEdit = (wallet: TWallet) => {
    if (!selectedWallet || !editMode) return

    modalNavigate('wallet-edit', {
      state: {
        walletId: wallet.id,
      },
    })
  }

  const handleGoToConfirmPasswordModal = () => {
    modalNavigate('confirm-password', {
      state: {
        heading: t('exportWalletTitle'),
        description: tConfirmPassword('description'),
        inputPlaceholder: tConfirmPassword('inputPlaceholder'),
        buttonLabel: tConfirmPassword('buttonContinueLabel'),
        onSubmit: async (password: string) => {
          try {
            const encryptedPassword = await encryptPassword(password)

            if (loginSessionRef.current?.encryptedPassword !== encryptedPassword) {
              throw new AppError(tConfirmPassword('invalidPasswordError'))
            }

            modalNavigate('export-mnemonic', {
              state: {
                wallet: selectedWallet || wallets[0],
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
        <TbWallet className="text-blue size-6" aria-hidden />
        <h3 className="text-blue text-sm">{t('subtitle')}</h3>
      </div>

      <ul className="my-2.5 min-h-0 overflow-y-auto rounded">
        {wallets.map((wallet, index, array) => (
          <WalletItem
            key={wallet.id}
            wallet={wallet}
            isSelected={selectedWallet?.id === wallet.id}
            editMode={editMode}
            isLast={index + 1 === array.length}
            isPasswordLogin={isPasswordLogin}
            onSelect={handleSelect}
            onEdit={handleEdit}
          />
        ))}
      </ul>

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
              <Tooltip
                title={t('editButtonLabel')}
                contentProps={{ className: 'bg-asphalt' }}
                arrowProps={{ className: 'fill-asphalt' }}
                delayDuration={200}
              >
                <IconButton
                  aria-label={t('editButtonLabel')}
                  variant="contained"
                  icon={<TbPencil aria-hidden />}
                  onClick={() => setEditMode(true)}
                  disabled={!isPasswordLogin}
                />
              </Tooltip>

              <Tooltip
                title={t('reorderButtonLabel')}
                contentProps={{ className: 'bg-asphalt' }}
                arrowProps={{ className: 'fill-asphalt' }}
                delayDuration={200}
              >
                <IconButton
                  aria-label={t('reorderButtonLabel')}
                  variant="contained"
                  className="min-size-12 max-size-12 size-12"
                  clickableProps={{ className: 'min-size-[inherit] max-size-[inherit] size-[inherit] p-0' }}
                  icon={<TbReorder aria-hidden />}
                  onClick={modalNavigateWrapper('reorder-wallets')}
                  disabled={!isPasswordLogin}
                />
              </Tooltip>

              {!!selectedWallet?.encryptedMnemonic && isPasswordLogin && (
                <Button
                  label={t('exportButtonLabel')}
                  className="w-full"
                  variant="card"
                  colorSchema="gray"
                  leftIcon={<TbFileExport aria-hidden />}
                  iconsOnEdge={false}
                  onClick={handleGoToConfirmPasswordModal}
                  disabled={!isPasswordLogin}
                />
              )}

              <Button
                label={t('addButtonLabel')}
                className="w-full"
                variant="card"
                leftIcon={<TbPlus aria-hidden />}
                iconsOnEdge={false}
                onClick={modalNavigateWrapper('create-wallet-1', { replace: true })}
                disabled={!isPasswordLogin}
              />
            </Fragment>
          )}
        </div>
      )}
    </BottomModalLayout>
  )
}

export default WalletSelectionModal
