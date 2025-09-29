import { WorkerHelper } from '@/helpers/WorkerHelper'
import { TWorkerOpenTabMessage } from '@/types/worker-events'

export class TabsHelper {
  static async openTab(path: string) {
    await WorkerHelper.send<TWorkerOpenTabMessage>({
      type: 'open-tab',
      payload: { url: `./src/tab.html#${path}` },
    })
  }

  static isInTab(url: string) {
    return url.startsWith('chrome-extension://') && url.includes('/src/tab.html#/')
  }
}
