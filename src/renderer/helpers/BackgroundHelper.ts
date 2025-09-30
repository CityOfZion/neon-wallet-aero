import { TBackgroundMessage } from '@shared/types/background-events'

export class BackgroundHelper {
  static async send<T extends TBackgroundMessage, D = void>(message: T): Promise<D> {
    return chrome.runtime.sendMessage(message)
  }
}
