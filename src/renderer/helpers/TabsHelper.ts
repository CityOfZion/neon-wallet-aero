import { BackgroundHelper } from '@renderer/helpers/BackgroundHelper'

import type { TBackgroundOpenTabMessage } from '@shared/types/background-events'

export class TabsHelper {
  static async openTab(path: string, queryParams?: Record<string, string>) {
    const queryParamsString = new URLSearchParams(queryParams).toString()
    const queryParamsValue = !queryParamsString ? '' : `?${queryParamsString}`

    await BackgroundHelper.send<TBackgroundOpenTabMessage>({
      type: 'open-tab',
      payload: { url: `./src/renderer/tab.html#${path}${queryParamsValue}` },
    })
  }

  static isInTab(url: string) {
    return url.startsWith('chrome-extension://') && url.includes('/src/renderer/tab.html#/')
  }
}
