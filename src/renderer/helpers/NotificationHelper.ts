import { match } from 'ts-pattern'

import { I18nextHelper } from '@shared/helpers/I18nextHelper'
import type { TNotification } from '@shared/types/store'

import { UtilsHelper } from './UtilsHelper'

const { t } = I18nextHelper.get()

export class NotificationHelper {
  static async create({ title, previewBody, ...notification }: TNotification) {
    const id = UtilsHelper.uuid()
    const priority = match(notification.priority)
      .with('high', () => 2)
      .with('medium', () => 1)
      .otherwise(() => 0)

    await chrome.notifications.create(id, {
      title: t(title, { defaultValue: title, value: notification.titleValue }),
      message: t(previewBody, {
        defaultValue: previewBody,
        value: notification.previewBodyValue,
      }),
      type: 'basic',
      priority,
      requireInteraction: false,
      iconUrl: chrome.runtime.getURL('/icon-128x128.png'),
    })
  }
}
