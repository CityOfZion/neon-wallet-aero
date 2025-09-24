import { TWorkerMessage } from '@/types/worker-events'

export class WorkerHelper {
  static async send<T extends TWorkerMessage, D = void>(message: T): Promise<D | undefined> {
    if (chrome.runtime === undefined) {
      console.warn("This feature is available on built version, the chrome.runtime doesn't exist")

      return undefined
    }

    return chrome.runtime.sendMessage(message)
  }
}
