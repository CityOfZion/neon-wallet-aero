import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'

import { Separator } from '@renderer/components/Separator'

import { useNotificationsSelector } from '@renderer/hooks/useNotificationsSelector'

import { ScreenLayout } from '@renderer/layouts/ScreenLayout'

import TbBell from '@renderer/assets/images/tb-bell.svg?react'

import { NotificationItem } from './NotificationItem'

export const NotificationsPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'notifications' })
  const { notifications } = useNotificationsSelector()

  return (
    <ScreenLayout heading={t('title')} icon={<TbBell aria-hidden />}>
      <div className="flex w-full flex-col">
        {notifications.length === 0 ? (
          <div className="mt-8 flex flex-col items-center text-center">
            <TbBell className="size-20 text-gray-300" aria-hidden />

            <p className="mt-2 text-lg font-semibold text-white">{t('notFound.title')}</p>
            <p className="text-sm text-gray-100">{t('notFound.description')}</p>
          </div>
        ) : (
          <ul className="flex w-full flex-col">
            <AnimatePresence mode="popLayout">
              {notifications.map(notification => (
                <motion.li
                  key={`notification-list-item-${notification.id}`}
                  className="group"
                  layout
                  transition={{ layout: { type: 'spring', damping: 25, stiffness: 400 } }}
                >
                  <NotificationItem notification={notification} />

                  <Separator className="my-2 group-last:hidden" />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </ScreenLayout>
  )
}

export default NotificationsPage
