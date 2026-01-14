import { useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'
import { Separator } from '@renderer/components/Separator'

import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { useActions } from '@renderer/hooks/useActions'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { useNeonImportMigrate } from '@renderer/hooks/useNeonMigrate'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import type { TUseNeonMigrateAccountsSchema, TUseNeonMigrateDecryptedAccountSchema } from '@shared/types/hooks'
import type { TModalState } from '@shared/types/modal'

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

  const handlePasswordSubmit = async (accountToMigrate: TUseNeonMigrateAccountsSchema, password: string) => {
    const decryptedAccount = await handleTryDecryptAccount(accountToMigrate, password)

    if (!decryptedAccount) return

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
        replace: true,
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

      <ul className="mt-1 mb-3 flex min-h-0 w-full flex-grow flex-col overflow-y-auto pr-2">
        {selectedAccountsToMigrate.map((accountToMigrate, index) => (
          <li key={accountToMigrate.address} className="flex flex-col">
            <MigrateFromNeon2Password accountToMigrate={accountToMigrate} onSubmit={handlePasswordSubmit} />

            {index < selectedAccountsToMigrate.length - 1 && <Separator />}
          </li>
        ))}
      </ul>

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

export default MigrateFromNeon2Step4Modal
