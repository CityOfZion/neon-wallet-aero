import { ToastHelper } from '@renderer/helpers/ToastHelper'
import { getI18next } from '@renderer/libs/i18next'

const { t } = getI18next()

export class ClipboardHelper {
  static async write(text: string) {
    ToastHelper.success({ message: t('common:general.successfullyCopied') })
    navigator.clipboard.writeText(text)
  }
}
