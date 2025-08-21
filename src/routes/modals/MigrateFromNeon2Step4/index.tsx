import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/Button'
import { Separator } from '@/components/Separator'
import { ToastHelper } from '@/helpers/ToastHelper'
import { useActions } from '@/hooks/useActions'
import { useModalNavigate, useModalState } from '@/hooks/useModalRouter'
import {
  TUseNeonMigrateDecryptedAccountSchema,
  TUseNeonMigrateFromNeon2Schema,
  useNeonImportMigrate,
} from '@/hooks/useNeonMigrate'
import { BottomModalLayout } from '@/layouts/BottomModalLayout'
import { TModalState } from '@/types/modal'

import { MigrateFromNeon2Password } from './MigrateFromNeon2Password'
import { MigrateFromNeon2Success } from './MigrateFromNeon2Success'

type TActionData = {
  decryptedAccounts: TUseNeonMigrateDecryptedAccountSchema[]
}

export const MigrateFromNeon2Step4Modal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'migrateWallets' })
  const { selectedAccountsToMigrate, content, onDecrypt } = useModalState<TModalState<'migrate-from-neon2-4'>>()
  const { actionData, actionState, setData, handleAct } = useActions<TActionData>({
    decryptedAccounts: [],
  })
  const { handleTryDecryptAccount, handleGenerateData, handleImportBackupData } = useNeonImportMigrate()
  const { modalNavigate, modalErase } = useModalNavigate()

  const handlePasswordSubmit = async (accountToMigrate: TUseNeonMigrateFromNeon2Schema, password: string) => {
    const decryptedAccount = await handleTryDecryptAccount(accountToMigrate, password)
    setData(prev => ({ ...prev, decryptedAccounts: [...prev.decryptedAccounts, decryptedAccount] }))
  }

  const handleMigrate = async (data: TActionData) => {
    const generatedData = handleGenerateData(content, data.decryptedAccounts)

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
          content: <MigrateFromNeon2Success accounts={accounts} />,
        },
      })
    } catch {
      ToastHelper.error({ message: t('step4.migrateError') })
      modalErase('bottom')
    }
  }

  const isDisabled = selectedAccountsToMigrate.some(
    account => !actionData.decryptedAccounts.some(decryptedAccount => decryptedAccount.address === account.address)
  )

  return (
    <BottomModalLayout heading={t('step4.title')}>
      <p className="text-center text-white">{t('step4.description')}</p>

      <div className="mt-1 mb-3 flex min-h-0 w-full flex-grow flex-col overflow-y-auto pr-2">
        {selectedAccountsToMigrate.map((accountToMigrate, index) => (
          <Fragment key={accountToMigrate.address}>
            <MigrateFromNeon2Password accountToMigrate={accountToMigrate} onSubmit={handlePasswordSubmit} />

            {index < selectedAccountsToMigrate.length - 1 && <Separator />}
          </Fragment>
        ))}
      </div>

      <Button
        label={t('step4.buttonLabel')}
        variant="card"
        onClick={handleAct(handleMigrate)}
        loading={actionState.isActing}
        disabled={isDisabled}
      />
    </BottomModalLayout>
  )
}
