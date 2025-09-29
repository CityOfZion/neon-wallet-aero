import { TWorkerMessage } from '@/types/worker-events'

export class WorkerHelper {
  static async send<T extends TWorkerMessage, D = void>(message: T): Promise<D> {
    return chrome.runtime.sendMessage(message)
  }
}
