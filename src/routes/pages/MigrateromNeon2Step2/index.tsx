import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { match } from 'ts-pattern'

import { Banner } from '@/components/Banner'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Separator } from '@/components/Separator'
import { TUseBackupOrMigrateActionsData, useBackupOrMigrate } from '@/hooks/useBackupOrMigrate'
import { useModalNavigate } from '@/hooks/useModalRouter'
import { useNeonImportBackup } from '@/hooks/useNeonBackup'
import { SettingsLayout } from '@/layouts/Settings'

const SuccessFooter = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'migrateWallets.step4' })
  const { modalErase } = useModalNavigate()
  const navigate = useNavigate()

  const handleView = () => {
    modalErase('bottom')
    navigate(`/app/wallets`)
  }

  return (
    <div className="flex w-full flex-grow flex-col items-center justify-end gap-7">
      <Separator />
      <Button variant="card" label={t('returnToSettingsButtonLabel')} onClick={handleView} className="w-full" />
    </div>
  )
}

export const MigrateFromNeon2Step2 = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'settings.migrateFromNeon2.step2' })
  const { t: confirmPasswordT } = useTranslation('pages', { keyPrefix: 'settings.confirmPasswordRecover' })
  const { modalNavigate } = useModalNavigate()
  const { actionData, actionState, handleBrowse, handleAct } = useBackupOrMigrate()
  const { handleTryDecryptData, handleGenerateData, handleImportBackupData } = useNeonImportBackup()

  const handleSubmit = async (data: TUseBackupOrMigrateActionsData) => {
    if (!data.content || !data.path || !data.type) return

    if (data.type === 'migrate') {
      modalNavigate('migrate-from-neon2-3', { state: { content: data.content } })
      return
    }

    modalNavigate('confirm-password', {
      state: {
        heading: confirmPasswordT('title'),
        description: confirmPasswordT('description'),
        inputLabel: confirmPasswordT('subtitle'),
        buttonLabel: confirmPasswordT('buttonContinueLabel'),
        inputPlaceholder: confirmPasswordT('inputPlaceholder'),
        onSubmit: async (backupPassword: string) => {
          try {
            const decryptedData = await handleTryDecryptData(data, backupPassword)
            const generatedData = handleGenerateData(decryptedData)
            await handleImportBackupData(generatedData)

            modalNavigate('success', {
              state: {
                heading: confirmPasswordT('title'),
                subtitle: confirmPasswordT('importSuccess'),
                footer: <SuccessFooter />,
              },
            })
          } catch {
            throw new Error('Invalid password')
          }
        },
      },
    })
  }

  return (
    <SettingsLayout title={t('title')}>
      <form className="flex h-full min-h-0 flex-col justify-between gap-4" onSubmit={handleAct(handleSubmit)}>
        <div className="flex flex-col gap-8">
          <p className="text-xs text-gray-100">{t('description')}</p>

          <div className="flex flex-col items-end gap-2.5">
            <Input
              value={actionData?.path ?? ''}
              placeholder={t('buttonPlaceholder')}
              readOnly
              containerClassName="w-full"
              label={t('inputLabel')}
            />

            <Button
              colorSchema="neon"
              variant="outlined"
              label={t('buttonBrowseLabel')}
              type="button"
              onClick={handleBrowse}
              className="h-fit w-30"
            />
          </div>

          {match({ hasPath: !!actionData.path, hasError: !!actionState.errors.path })
            .with({ hasPath: true, hasError: false }, () => <Banner type="success" message={t('compatibleFile')} />)
            .with({ hasError: true }, () => <Banner type="error" message={actionState.errors.path} />)
            .otherwise(() => null)}
        </div>

        <Button variant="card" type="submit" disabled={!actionData.path || !actionData.content}>
          {t('buttonImportLabel')}
        </Button>
      </form>
    </SettingsLayout>
  )
}
