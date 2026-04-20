import { useTranslation } from 'react-i18next'

import { DateHelper } from '@renderer/helpers/DateHelper'
import { FileHelper } from '@renderer/helpers/FileHelper'

import { useLanguageSelector } from './useSettingsSelector'

export const useExportMnemonic = () => {
  const { t } = useTranslation('hooks', { keyPrefix: 'useExportMnemonic' })
  const { language } = useLanguageSelector()

  const saveMnemonicToTextFile = async (mnemonic: string) => {
    const fileName = `NEON-mnemonic-${Date.now()}.txt`
    const content = t('fileTemplate', {
      mnemonic,
      generatedAt: DateHelper.formatLocalized(new Date(), { format: 'PPPp', language }),
    })

    FileHelper.download(content, { type: 'text/plain' }, fileName)
  }

  return { saveMnemonicToTextFile }
}
