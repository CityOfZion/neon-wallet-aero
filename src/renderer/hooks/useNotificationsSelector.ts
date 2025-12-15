import orderBy from 'lodash/orderBy'

import { SelectorHelper } from '@renderer/helpers/SelectorHelper'

import { createAppSelector, useAppSelector } from '@renderer/hooks/useRedux'

import type { TNotification, TNotificationPriority } from '@shared/types/store'

const priorityOrder: Record<TNotificationPriority, number> = {
  high: 1,
  medium: 2,
  low: 3,
}

const orderNotifications = <T extends TNotification>(notifications: T[]): T[] =>
  orderBy(
    [...notifications],
    [notification => notification.read, notification => priorityOrder[notification.priority], 'date'],
    ['asc', 'asc', 'desc']
  )

const selectNotifications = createAppSelector(
  [({ auth }) => auth.data.applicationDataByLoginType, ({ auth }) => auth.inMemoryData.loginSession],
  (applicationDataByLoginType, loginSession) => {
    if (!loginSession) return SelectorHelper.fallbackToEmptyArray<TNotification>()

    return orderNotifications(applicationDataByLoginType[loginSession.type].notifications)
  }
)

const selectHasUnreadNotification = createAppSelector(
  [({ auth }) => auth.data.applicationDataByLoginType, ({ auth }) => auth.inMemoryData.loginSession],
  (applicationDataByLoginType, loginSession) => {
    if (!loginSession) return false

    return applicationDataByLoginType[loginSession.type].notifications.some(notification => !notification.read)
  }
)

const selectUnreadNotifications = createAppSelector(
  [({ auth }) => auth.data.applicationDataByLoginType, ({ auth }) => auth.inMemoryData.loginSession],
  (applicationDataByLoginType, loginSession) => {
    if (!loginSession?.type) return SelectorHelper.fallbackToEmptyArray<TNotification>()

    return applicationDataByLoginType[loginSession.type].notifications.filter(({ read }) => !read)
  }
)

export const useNotificationsSelector = () => {
  const { value, ref } = useAppSelector(selectNotifications)

  return { notifications: value, notificationsRef: ref }
}

export const useHasUnreadNotificationSelector = () => {
  const { ref, value } = useAppSelector(selectHasUnreadNotification)

  return { hasUnreadNotification: value, hasUnreadNotificationRef: ref }
}

export const useUnreadNotificationsSelector = () => {
  const { ref, value } = useAppSelector(selectUnreadNotifications)

  return { unreadNotifications: value, unreadNotificationsRef: ref }
}
