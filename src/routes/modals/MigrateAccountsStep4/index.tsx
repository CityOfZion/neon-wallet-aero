import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/Button'
import { Separator } from '@/components/Separator'
import { useActions } from '@/hooks/useActions'
import { useModalState } from '@/hooks/useModalRouter'
import {
  TUseNeonMigrateAccountsSchema,
  TUseNeonMigrateDecryptedAccountSchema,
  useNeonImportMigrate,
} from '@/hooks/useNeonMigrate'
import { BottomModalLayout } from '@/layouts/BottomModalLayout'
import { TModalState } from '@/types/modal'

import { MigrateAccountsPassword } from './MigrateAccountsPassword'

type TActionData = {
  decryptedAccounts: TUseNeonMigrateDecryptedAccountSchema[]
}

export const MigrateAccountsStep4Modal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'migrateWallets.step4' })
  const { selectedAccountsToMigrate, content, onDecrypt } = useModalState<TModalState<'migrate-accounts-4'>>()
  const { actionData, actionState, setData, handleAct } = useActions<TActionData>({
    decryptedAccounts: [],
  })
  const { handleTryDecryptAccount, handleGenerateData } = useNeonImportMigrate()

  const handlePasswordSubmit = async (accountToMigrate: TUseNeonMigrateAccountsSchema, password: string) => {
    const decryptedAccount = await handleTryDecryptAccount(accountToMigrate, password)
    setData(prev => ({ ...prev, decryptedAccounts: [...prev.decryptedAccounts, decryptedAccount] }))
  }

  const handleMigrate = async (data: TActionData) => {
    const generatedData = handleGenerateData(content, data.decryptedAccounts)

    if (onDecrypt) {
      onDecrypt(generatedData)
      return
    }
  }

  const isDisabled = selectedAccountsToMigrate.some(
    account => !actionData.decryptedAccounts.some(decryptedAccount => decryptedAccount.address === account.address)
  )

  return (
    <BottomModalLayout heading={t('title')}>
      <p className="text-center text-white">{t('description')}</p>

      <div className="mt-1 mb-3 flex min-h-0 w-full flex-grow flex-col overflow-y-auto pr-2">
        {selectedAccountsToMigrate.map((accountToMigrate, index) => (
          <Fragment key={accountToMigrate.address}>
            <MigrateAccountsPassword accountToMigrate={accountToMigrate} onSubmit={handlePasswordSubmit} />

            {index < selectedAccountsToMigrate.length - 1 && <Separator />}
          </Fragment>
        ))}
      </div>

      <Button
        label={t('buttonLabel')}
        onClick={handleAct(handleMigrate)}
        loading={actionState.isActing}
        disabled={isDisabled}
      />
    </BottomModalLayout>
  )
}
