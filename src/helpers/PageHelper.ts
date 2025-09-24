import { EnvHelper } from '@/helpers/EnvHelper'
import { ToastHelper } from '@/helpers/ToastHelper'
import { WorkerHelper } from '@/helpers/WorkerHelper'
import { getI18next } from '@/libs/i18next'
import { TWorkerOpenTabMessage } from '@/types/worker-events'

const { t } = getI18next()

export class PageHelper {
  static async openTabAsInternalPage(path: string) {
    if (EnvHelper.DEV) {
      ToastHelper.info({ message: t('common:general.internalPageWarningMessage') })

      throw new Error("You can't access the internal page in development mode, use the built version")
    }

    const url = `./internal.html#${path}`

    try {
      await WorkerHelper.send<TWorkerOpenTabMessage>({
        type: 'open-tab',
        payload: { url },
      })
    } catch (error) {
      console.error(error)
    }
  }

  static isAtInternalPage(url: string) {
    return url.startsWith('chrome-extension://') && url.includes('/internal.html#/')
  }
}
