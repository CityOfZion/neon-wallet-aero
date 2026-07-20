import { Fragment, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button } from '@renderer/components/Button'
import { Checkbox } from '@renderer/components/Checkbox'
import { ImportPasswordRow } from '@renderer/components/ImportPasswordRow'
import { ImportSharedPassword } from '@renderer/components/ImportSharedPassword'
import { ImportSuccessContent } from '@renderer/components/ImportSuccessContent'
import { Separator } from '@renderer/components/Separator'

import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { useActions } from '@renderer/hooks/useActions'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { useNep6BackupFile } from '@renderer/hooks/useNep6BackupFile'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import { AppError } from '@shared/helpers/ErrorHelper'
import type { TUseImportNep6Account, TUseImportNep6DecryptedAccount } from '@shared/types/hooks'
import type { TModalState } from '@shared/types/modal'

type TActionsData = {
  decryptedAccounts: TUseImportNep6DecryptedAccount[]
}

export const Nep6BackupImportStep4Modal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'nep6BackupImport' })
  const { accounts, onDecrypt } = useModalState<TModalState<'nep6-backup-import-step-4'>>()
  const { actionData, actionState, setData, handleAct } = useActions<TActionsData>({
    decryptedAccounts: [],
  })
  const { handleTryDecryptAccount, handleGenerateData, handleImportBackupData } = useNep6BackupFile()
  const { modalNavigate, modalErase } = useModalNavigate()
  const navigate = useNavigate()

  const hasMultipleAccounts = accounts.length > 1
  const [samePassword, setSamePassword] = useState(hasMultipleAccounts)

  const handlePasswordSubmit = async (account: TUseImportNep6Account, password: string) => {
    const decryptedAccount = await handleTryDecryptAccount(account, password)

    if (!decryptedAccount) return

    setData(previousData => ({
      ...previousData,
      decryptedAccounts: [...previousData.decryptedAccounts, decryptedAccount],
    }))
  }

  const handleSamePasswordSubmit = async (password: string) => {
    try {
      const decryptedAccounts: TUseImportNep6DecryptedAccount[] = []

      for (const account of accounts) {
        const decryptedAccount = await handleTryDecryptAccount(account, password)

        if (!decryptedAccount) throw new AppError(t('step4.passwordError'))

        decryptedAccounts.push(decryptedAccount)
      }

      setData(previousData => ({ ...previousData, decryptedAccounts }))
    } catch (error) {
      setData(previousData => ({ ...previousData, decryptedAccounts: [] }))
      throw error
    }
  }

  const handleToggleSamePassword = (checked: boolean) => {
    setSamePassword(checked)
    setData(previousData => ({ ...previousData, decryptedAccounts: [] }))
  }

  const handleImport = async (data: TActionsData) => {
    const generatedData = handleGenerateData(data.decryptedAccounts)

    const handleEraseModal = () => {
      modalErase('bottom')
      navigate('/settings', { replace: true })
    }

    if (onDecrypt) {
      onDecrypt(generatedData)
      return
    }

    try {
      const { accounts } = await handleImportBackupData(generatedData)

      modalNavigate('success', {
        state: {
          heading: t('step4.success.title'),
          subtitle: t('step4.success.subtitle'),
          content: <ImportSuccessContent accounts={accounts} />,
          footer: (
            <Button
              label={t('step4.success.returnToSettingsButtonLabel')}
              className="mt-4"
              variant="card"
              onClick={handleEraseModal}
            />
          ),
          onErase: handleEraseModal,
        },
        replace: true,
      })
    } catch {
      ToastHelper.error({ message: t('step4.importError') })
      modalErase('bottom')
    }
  }

  const isDisabled = accounts.length !== actionData.decryptedAccounts.length

  return (
    <BottomModalLayout heading={t('step4.title')}>
      <p className="text-center text-white">{t('step4.description')}</p>

      {hasMultipleAccounts && (
        <label className="mt-4 flex w-fit cursor-pointer items-center gap-2 px-2">
          <Checkbox checked={samePassword} onCheckedChange={handleToggleSamePassword} />
          <span className="text-xs text-gray-100">{t('step4.useSamePasswordLabel')}</span>
        </label>
      )}

      <div className="mt-1 mb-3 flex min-h-0 w-full grow flex-col overflow-y-auto pr-2">
        {samePassword ? (
          <ImportSharedPassword
            inputLabel={t('step4.inputLabel')}
            inputPlaceholder={t('step4.inputPlaceholder')}
            error={t('step4.passwordError')}
            onSubmit={handleSamePasswordSubmit}
          />
        ) : (
          accounts.map((account, index) => (
            <Fragment key={account.address}>
              <ImportPasswordRow
                account={account}
                inputLabel={t('step4.inputLabel')}
                inputPlaceholder={t('step4.inputPlaceholder')}
                error={t('step4.passwordError')}
                onSubmit={handlePasswordSubmit}
              />

              {index < accounts.length - 1 && <Separator />}
            </Fragment>
          ))
        )}
      </div>

      <Button
        label={t('step4.buttonLabel')}
        variant="card"
        onClick={handleAct(handleImport)}
        loading={actionState.isActing}
        disabled={isDisabled}
      />
    </BottomModalLayout>
  )
}

export default Nep6BackupImportStep4Modal
