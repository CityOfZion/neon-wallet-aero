import { useTranslation } from 'react-i18next'

import { FileHelper } from '@renderer/helpers/FileHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'

import type { TUseNeonBackupData, TUseNeonMigrateData, TUseNep6Data } from '@shared/types/hooks'

import { useActions } from './useActions'
import { useNeonBackupFile } from './useNeonBackupFile'
import { useNeonMigrateFile } from './useNeonMigrateFile'
import { useNep6BackupFile } from './useNep6BackupFile'

export type TUseImportFromFileActionsData = {
  path?: string
} & (TUseNeonMigrateData | TUseNep6Data | TUseNeonBackupData | { content: undefined; type: undefined })

export const useImportFromFile = () => {
  const { t } = useTranslation('hooks', { keyPrefix: 'useImportFromFile' })
  const neonBackupFileActions = useNeonBackupFile()
  const neonMigrateFileActions = useNeonMigrateFile()
  const nep6BackupFileActions = useNep6BackupFile()

  const { actionData, actionState, handleAct, setData, setError, reset } = useActions<TUseImportFromFileActionsData>({
    content: undefined,
    type: undefined,
    path: undefined,
  })

  const handleBrowse = async () => {
    const file = await FileHelper.pick({
      accept: '.json',
    })

    if (!file) {
      return
    }

    const backupContent = await neonBackupFileActions.validateAndParseFile(file.name, file.content)

    if (backupContent) {
      ToastHelper.success({ message: t('neonBackupFileDetected') })

      setData({ path: file.name, ...backupContent })
      return
    }

    const nep6Content = await nep6BackupFileActions.validateAndParseFile(file.content)

    if (nep6Content) {
      ToastHelper.success({ message: t('nep6BackupFileDetected') })

      setData({ path: file.name, ...nep6Content })
      return
    }

    const migrateContent = await neonMigrateFileActions.validateAndParseFile(file.content)

    if (migrateContent) {
      ToastHelper.success({ message: t('neon2MigrateFileDetected') })

      setData({ path: file.name, ...migrateContent })
      return
    }

    setError('path', t('error'))
    ToastHelper.error({ message: t('error'), id: 'file-import-from-file-error' })
  }

  return {
    actionData,
    actionState,
    handleAct,
    handleBrowse,
    reset,
  }
}
