import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Banner } from '@renderer/components/Banner'
import { Button } from '@renderer/components/Button'
import { Input } from '@renderer/components/Input'
import { TUseBackupOrMigrateActionsData, useBackupOrMigrate } from '@renderer/hooks/useBackupOrMigrate'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { match } from 'ts-pattern'

import TbArrowLeft from '@renderer/assets/images/tb-arrow-left.svg?react'

export const RestoreBackupStep1 = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'settings.settingsRestoreWallet' })
  const { t: commonT } = useTranslation('common', { keyPrefix: 'general' })
  const { actionData, actionState, handleBrowse, handleAct } = useBackupOrMigrate()
  const navigate = useNavigate()
  const { modalNavigate } = useModalNavigate()
  const isDisabled = !actionData.path || !!actionState.errors.path

  const handleSubmit = async (data: TUseBackupOrMigrateActionsData) => {
    if (!data.content || !data.path || !data.type || isDisabled) return

    if (data.type === 'migrate') {
      modalNavigate('migrate-from-neon2-3', { state: { content: data.content } })
      return
    }

    navigate('/app/settings/backup-and-restore/restore/2', { state: { data } })
  }

  return (
    <form className="flex h-full min-h-0 flex-col justify-between gap-4" onSubmit={handleAct(handleSubmit)}>
      <div className="flex min-h-0 flex-col gap-4">
        <p className="text-xs text-gray-100">{t('description')}</p>

        <div className="flex flex-col items-end gap-2.5">
          <Input
            value={actionData?.path ?? ''}
            placeholder={t('browse')}
            readOnly
            containerClassName="w-full"
            label={t('saveBackupLabel')}
          />

          <Button
            colorSchema="neon"
            variant="outlined"
            label={t('browse')}
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

      <Button
        label={commonT('next')}
        variant="card"
        iconsOnEdge={false}
        type="submit"
        disabled={isDisabled}
        rightIcon={<TbArrowLeft className="rotate-180" aria-hidden />}
      />
    </form>
  )
}
