import { Trans, useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { AlertErrorBanner } from '@renderer/components/AlertErrorBanner'
import { Banner } from '@renderer/components/Banner'
import { Button } from '@renderer/components/Button'
import { Input } from '@renderer/components/Input'

import { AnalyticsHelper } from '@renderer/helpers/AnalyticsHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { useActions } from '@renderer/hooks/useActions'
import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'
import { useLogin } from '@renderer/hooks/useLogin'
import { useNeonCreateBackup } from '@renderer/hooks/useNeonBackupFile'

import TbDeviceFloppy from '@renderer/assets/images/tb-device-floppy.svg?react'

type TFormData = {
  password: string
}

export const BackupAndRestoreBackupStep1Page = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'backupAndRestore.backup.step1' })
  const navigate = useNavigate()
  const { handleCreateBackup } = useNeonCreateBackup()
  const { handleAct, actionState, actionData, setError, setDataFromEventWrapper } = useActions<TFormData>({
    password: '',
  })
  const { loginSessionRef } = useLoginSessionSelector()
  const { encryptPassword } = useLogin()

  const handleSubmitCreateBackup = async () => {
    if (isDisabled) return

    const encryptedPassword = await encryptPassword(actionData.password)

    if (loginSessionRef.current?.encryptedPassword !== encryptedPassword) {
      setError('password', t('error.incorrectPassword'))
      return
    }

    try {
      await handleCreateBackup(actionData.password)

      await AnalyticsHelper.logEvent('backup_done')

      navigate('/settings/backup-and-restore/backup/2', {
        state: { password: actionData.password },
        replace: true,
      })
    } catch {
      ToastHelper.error({ message: t('error.unexpectedError') })
    }
  }

  const isDisabled = !actionData.password

  return (
    <form className="flex size-full flex-col" onSubmit={handleAct(handleSubmitCreateBackup)}>
      <p className="mb-7 text-sm">{t('description')}</p>

      <div className="flex flex-grow flex-col gap-y-4">
        <Input
          name="password"
          id="password"
          label={t('passwordInputLabel')}
          value={actionData.password}
          onChange={setDataFromEventWrapper('password')}
          error={!!actionState.errors.password}
          contentClassName="bg-gray-800"
          type="password"
        />

        {actionState.errors.password && <AlertErrorBanner message={actionState.errors.password} />}
      </div>

      <div className="flex flex-col justify-center gap-y-5">
        <Banner
          type="warningOrange"
          message={
            <Trans t={t} i18nKey="warning">
              start
              <span className="text-orange">middle</span>
              end
            </Trans>
          }
        />

        <Button
          label={t('backup')}
          leftIcon={<TbDeviceFloppy aria-hidden />}
          iconsOnEdge={false}
          disabled={isDisabled}
          type="submit"
          variant="card"
          className="w-full"
          loading={actionState.isActing}
        />
      </div>
    </form>
  )
}

export default BackupAndRestoreBackupStep1Page
