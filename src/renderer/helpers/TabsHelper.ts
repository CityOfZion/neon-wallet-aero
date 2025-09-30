import { BackgroundHelper } from '@renderer/helpers/BackgroundHelper'
import { TBackgroundOpenTabMessage } from '@shared/types/background-events'

export class TabsHelper {
  static async openTab(path: string) {
    await BackgroundHelper.send<TBackgroundOpenTabMessage>({
      type: 'open-tab',
      payload: { url: `./src/renderer/app/tab/index.html#${path}` },
    })
  }

  static isInTab(url: string) {
    return url.startsWith('chrome-extension://') && url.includes('/src/renderer/app/tab/index.html#/')
  }
}
