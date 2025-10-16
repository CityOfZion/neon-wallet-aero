import { useTranslation } from 'react-i18next'
import { Location, useLocation, useNavigate } from 'react-router-dom'
import { AlertErrorBanner } from '@renderer/components/AlertErrorBanner'
import { Button } from '@renderer/components/Button'
import { Input } from '@renderer/components/Input'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'
import { useActions } from '@renderer/hooks/useActions'
import { TUseNeonBackupData, useNeonImportBackup } from '@renderer/hooks/useNeonBackup'

import TbDeviceFloppy from '@renderer/assets/images/tb-device-floppy.svg?react'

type TFormData = {
  password: string
}

type TLocationState = {
  data: TUseNeonBackupData
}

export const BackupAndRestoreRestoreStep2Page = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'settings.confirmPasswordRecover' })
  const { state } = useLocation() as Location<TLocationState>
  const { handleImportBackupData, handleTryDecryptData, handleGenerateData } = useNeonImportBackup()
  const navigate = useNavigate()

  const { actionData, actionState, handleAct, setDataFromEventWrapper, setError, reset } = useActions<TFormData>({
    password: '',
  })

  const handleSubmit = async ({ password }: TFormData) => {
    if (password.length === 0) {
      setError('password', t('passwordError'))
      return
    }

    try {
      const decryptedData = await handleTryDecryptData(state.data, password)
      const generatedData = handleGenerateData(decryptedData)

      await handleImportBackupData(generatedData)

      await UtilsHelper.sleep(2000)
      navigate('/settings/backup-and-restore/restore/3')
    } catch {
      reset()
      setError('password', t('passwordError'))
    }
  }

  return (
    <form className="flex h-full flex-col gap-4" onSubmit={handleAct(handleSubmit)}>
      <p className="text-xs text-gray-100">{t('description')}</p>
      <div className="flex flex-grow flex-col justify-between gap-y-6">
        <div className="flex flex-col">
          <Input
            containerClassName="mt-10"
            label={t('passwordInputLabel')}
            placeholder={t('inputPlaceholder')}
            type="password"
            value={actionData.password}
            onChange={setDataFromEventWrapper('password')}
            autoFocus
          />
          {actionState.errors.password && <AlertErrorBanner message={actionState.errors.password} className="mt-4" />}
        </div>

        <Button
          type="submit"
          variant="card"
          label={t('buttonContinueLabel')}
          loading={actionState.isActing}
          leftIcon={<TbDeviceFloppy aria-hidden />}
          iconsOnEdge={false}
        />
      </div>
    </form>
  )
}

export default BackupAndRestoreRestoreStep2Page
