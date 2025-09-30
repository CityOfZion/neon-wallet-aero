import { useTranslation } from 'react-i18next'
import { FileHelper } from '@renderer/helpers/FileHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { useActions } from './useActions'
import { TUseNeonBackupData, useNeonImportBackup } from './useNeonBackup'
import { TUseNeonMigrateData, useNeonImportMigrate } from './useNeonMigrate'

export type TUseBackupOrMigrateActionsData = {
  path?: string
} & (TUseNeonMigrateData | TUseNeonBackupData | { content: undefined; type: undefined })

export const useBackupOrMigrate = () => {
  const { t } = useTranslation('hooks', { keyPrefix: 'useBackupOrMigrate' })
  const importBackupActions = useNeonImportBackup()
  const importMigrateActions = useNeonImportMigrate()

  const { actionData, actionState, handleAct, setData, setError, reset } = useActions<TUseBackupOrMigrateActionsData>({
    content: undefined,
    type: undefined,
    path: undefined,
  })

  const handleBrowse = async () => {
    const file = await FileHelper.pickFiles({
      accept: '.json',
    })

    if (!file) {
      return
    }

    const backupContent = await importBackupActions.validateAndParseFile(file.name, file.content)

    if (backupContent) {
      ToastHelper.success({ message: t('neon3BackupFileDetected') })

      setData({ path: file.name, ...backupContent })
      return
    }

    const migrateContent = await importMigrateActions.validateAndParseFile(file.content)
    if (migrateContent) {
      ToastHelper.success({ message: t('neon2MigrateFileDetected') })

      setData({ path: file.name, ...migrateContent })
      return
    }

    setError('path', t('error'))
    ToastHelper.error({ message: t('error'), id: 'file-backup-or-migrate-error' })
  }

  return {
    actionData,
    actionState,
    handleAct,
    handleBrowse,
    reset,
  }
}
