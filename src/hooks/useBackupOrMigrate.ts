import { useTranslation } from 'react-i18next'

import { FileHelper } from '@/helpers/FileHelper'

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
      setData({ path: file.name, ...backupContent })
      return
    }

    const migrateContent = await importMigrateActions.validateAndParseFile(file.content)
    if (migrateContent) {
      setData({ path: file.name, ...migrateContent })
      return
    }

    setError('path', t('error'))
  }

  return {
    actionData,
    actionState,
    handleAct,
    handleBrowse,
    reset,
  }
}
