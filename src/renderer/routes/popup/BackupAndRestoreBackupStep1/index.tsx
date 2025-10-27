import type { ChangeEvent } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Banner } from '@renderer/components/Banner'
import { Button } from '@renderer/components/Button'
import { Input } from '@renderer/components/Input'

import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { useActions } from '@renderer/hooks/useActions'
import { useNeonCreateBackup } from '@renderer/hooks/useNeonBackup'

import TbDeviceFloppy from '@renderer/assets/images/tb-device-floppy.svg?react'

import { PASSWORD_MIN_LENGTH } from '@shared/constants/password'

type TFormData = {
  password: string
  confirmPassword: string
}

export const BackupAndRestoreBackupStep1Page = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'backupAndRestore.backup.step1' })
  const navigate = useNavigate()
  const { handleCreateBackup } = useNeonCreateBackup()
  const { handleAct, actionState, actionData, setData, setError, clearErrors } = useActions<TFormData>({
    password: '',
    confirmPassword: '',
  })

  const handleSubmitCreateBackup = async () => {
    if (isDisabled) return

    try {
      await handleCreateBackup(actionData.password)

      navigate('/settings/backup-and-restore/backup/2', {
        state: { backupPassword: actionData.password },
      })
    } catch {
      ToastHelper.error({ message: t('error.unexpectedError') })
    }
  }

  const handleBackupPasswordChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    clearErrors()
    const trimmedValue = value.trim()

    setData({ password: trimmedValue })

    if (trimmedValue.length < PASSWORD_MIN_LENGTH) {
      setError('password', t('error.backupPasswordLength', { minLength: PASSWORD_MIN_LENGTH }))
    }

    if (actionData.confirmPassword && trimmedValue !== actionData.confirmPassword) {
      setError('confirmPassword', t('error.confirmPassword'))
    }
  }

  const handleConfirmPasswordChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    clearErrors()
    const trimmedValue = value.trim()

    setData({ confirmPassword: trimmedValue })

    if (trimmedValue !== actionData.password) {
      setError('confirmPassword', t('error.confirmPassword'))
    }
  }

  const isDisabled =
    !actionData.password ||
    !actionData.confirmPassword ||
    actionData.password !== actionData.confirmPassword ||
    actionData.password.length < PASSWORD_MIN_LENGTH

  return (
    <form className="flex h-full w-full flex-col" onSubmit={handleAct(handleSubmitCreateBackup)}>
      <fieldset className="flex h-full w-full flex-col">
        <legend className="mb-7 text-xs">{t('description')}</legend>

        <div className="flex flex-grow flex-col gap-y-4">
          <Input
            label={t('backupPasswordLabel')}
            value={actionData.password}
            onChange={handleBackupPasswordChange}
            errorMessage={actionState.errors.password}
            contentClassName="bg-gray-800"
            type="password"
          />

          <Input
            label={t('confirmBackupPasswordLabel')}
            value={actionData.confirmPassword}
            onChange={handleConfirmPasswordChange}
            errorMessage={actionState.errors.confirmPassword}
            contentClassName="bg-gray-800"
            type="password"
          />
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
          />
        </div>
      </fieldset>
    </form>
  )
}

export default BackupAndRestoreBackupStep1Page
