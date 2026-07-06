import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { match } from 'ts-pattern'

import { Banner } from '@renderer/components/Banner'
import { Button } from '@renderer/components/Button'
import { Input } from '@renderer/components/Input'

import { AppError } from '@renderer/helpers/ErrorHelper'

import type { TUseImportFromFileActionsData } from '@renderer/hooks/useImportFromFile'
import { useImportFromFile } from '@renderer/hooks/useImportFromFile'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { useNeonBackupFile } from '@renderer/hooks/useNeonBackupFile'

import { SettingsLayout } from '@renderer/layouts/SettingsLayout'

import { MigrateFromNeon2SuccessFooter } from './MigrateFromNeon2SuccessFooter'

export const MigrateFromNeon2Step2Page = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'settings.migrateFromNeon2.step2' })
  const { t: tConfirmPassword } = useTranslation('pages', { keyPrefix: 'settings.confirmPasswordRecover' })
  const { modalNavigate } = useModalNavigate()
  const navigate = useNavigate()
  const { actionData, actionState, handleBrowse, handleAct } = useImportFromFile()
  const { handleTryDecryptData, handleGenerateData, handleImportBackupData } = useNeonBackupFile()

  const handleSubmit = async (data: TUseImportFromFileActionsData) => {
    if (!data.content || !data.path || !data.type) return

    const handleOnEraseModal = () => {
      navigate('/settings', { replace: true })
    }

    if (data.type === 'migrate') {
      modalNavigate('migrate-from-neon2-3', { state: { content: data.content } })
      return
    }

    if (data.type === 'nep6') {
      modalNavigate('nep6-backup-import-step-3', { state: { content: data.content } })
      return
    }

    modalNavigate('confirm-password', {
      state: {
        heading: tConfirmPassword('title'),
        description: tConfirmPassword('description'),
        inputLabel: tConfirmPassword('subtitle'),
        buttonLabel: tConfirmPassword('buttonContinueLabel'),
        inputPlaceholder: tConfirmPassword('inputPlaceholder'),
        onSubmit: async (backupPassword: string) => {
          try {
            const decryptedData = await handleTryDecryptData(data, backupPassword)
            const generatedData = handleGenerateData(decryptedData)
            await handleImportBackupData(generatedData)

            modalNavigate('success', {
              state: {
                heading: tConfirmPassword('title'),
                subtitle: tConfirmPassword('importSuccess'),
                footer: <MigrateFromNeon2SuccessFooter />,
                onErase: handleOnEraseModal,
              },
              replace: true,
            })
          } catch (error) {
            throw new AppError(tConfirmPassword('passwordError'), error)
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
              name="migrate-path"
              id="migrate-path"
              value={actionData?.path || ''}
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

export default MigrateFromNeon2Step2Page
