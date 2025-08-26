import { useTranslation } from 'react-i18next'

import { BACKUP_FILE_EXTENSION, DEPRECATED_BACKUP_FILE_EXTENSION } from '@/constants/backup'
import { FileHelper } from '@/helpers/FileHelper'
import { ToastHelper } from '@/helpers/ToastHelper'

import { useActions } from './useActions'
import { TUseNeonMigrateData, useNeonImportMigrate } from './useNeonMigrate'

export type TUseBackupOrMigrateActionsData = {
  path?: string
} & (TUseNeonMigrateData | { content: undefined; type: undefined })

export const useBackupOrMigrate = () => {
  const { t } = useTranslation('hooks', { keyPrefix: 'useBackupOrMigrate' })
  const importMigrateActions = useNeonImportMigrate()

  const { actionData, actionState, handleAct, setData, setError, reset } = useActions<TUseBackupOrMigrateActionsData>({
    content: undefined,
    type: undefined,
    path: undefined,
  })

  const handleBrowse = async () => {
    const file = await FileHelper.pickFiles({
      accept: `.${BACKUP_FILE_EXTENSION},.${DEPRECATED_BACKUP_FILE_EXTENSION},.json`,
    })

    if (!file) {
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
