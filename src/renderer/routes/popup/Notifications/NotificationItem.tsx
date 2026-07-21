import { cloneElement, useMemo } from 'react'

import type { JSX, KeyboardEvent, MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { ActionPopover } from '@renderer/components/ActionPopover'
import { IconButton } from '@renderer/components/IconButton'

import { AccountHelper } from '@renderer/helpers/AccountHelper'
import { DateHelper } from '@renderer/helpers/DateHelper'
import { LoggerHelper } from '@renderer/helpers/LoggerHelper'
import { StringHelper } from '@renderer/helpers/StringHelper'
import { StyleHelper } from '@renderer/helpers/StyleHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { useAccountsMapSelector } from '@renderer/hooks/useAccountSelector'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { usePressOnce } from '@renderer/hooks/usePressOnce'
import { useAppDispatch } from '@renderer/hooks/useRedux'
import { useLanguageSelector } from '@renderer/hooks/useSettingsSelector'

import MdMoreVert from '@renderer/assets/images/md-more-vert.svg?react'
import TbAlertSquare from '@renderer/assets/images/tb-alert-square.svg?react'
import TbAlertTriangle from '@renderer/assets/images/tb-alert-triangle.svg?react'

import { authReducerActions } from '@renderer/store/reducers/auth'
import { AppError } from '@shared/helpers/ErrorHelper'
import type { TNotification, TNotificationPriority } from '@shared/types/store'

import { functionsByNotificationActionType } from './functionsByNotificationActionType'

type TProps = {
  notification: TNotification
}

const iconsByPriority: Record<TNotificationPriority, JSX.Element> = {
  high: <TbAlertTriangle className="text-pink" />,
  medium: <TbAlertSquare className="text-blue" />,
  low: (
    <div className="text-neon mt-4.5 flex items-center justify-center">
      <div className="min-size-1.5 max-size-1.5 size-1.5 rounded-full bg-current" />
    </div>
  ),
}

export const NotificationItem = ({ notification }: TProps) => {
  const { t } = useTranslation('pages', { keyPrefix: 'notifications.item' })

  const { t: tGlobal } = useTranslation()
  const dispatch = useAppDispatch()
  const modalActions = useModalNavigate()
  const popupNavigate = useNavigate()
  const { language } = useLanguageSelector()
  const { accountsMapRef } = useAccountsMapSelector()

  const account = useMemo(() => {
    const related = notification.related

    if (!related) return undefined

    const address = related.address
    const blockchain = related.blockchain

    return !!address && !!blockchain
      ? accountsMapRef.current.get(AccountHelper.buildAccountKey({ address, blockchain }))
      : undefined
  }, [accountsMapRef, notification.related])

  const icon = iconsByPriority[notification.priority || 'low']

  const [isActing, startAction] = usePressOnce(async () => {
    try {
      const notificationAction = notification.action
      if (!notificationAction || notification.read) return
      const fn = functionsByNotificationActionType[notificationAction.type]
      if (!fn) return
      await fn({ modalActions, popupNavigate, notificationAction })
      dispatch(authReducerActions.saveNotification({ ...notification, read: true }))
    } catch (error) {
      LoggerHelper.error(error, { where: 'Notification', operation: 'clickNotification' })
      ToastHelper.error({ message: AppError.wrap(error).message })
    }
  })

  const handleStopPropagation = (event: MouseEvent) => {
    event.stopPropagation()
  }

  const handleToggleRead = () => {
    dispatch(authReducerActions.saveNotification({ ...notification, read: !notification.read }))
  }

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.code !== 'Enter') return
    startAction()
  }

  return (
    <div
      className={StyleHelper.mergeStyles('flex w-full cursor-auto flex-col rounded-lg transition-colors', {
        'cursor-pointer hover:bg-gray-700/30 focus:bg-gray-700/30 active:bg-gray-700/30':
          !!notification.action && !notification.read && !isActing,
      })}
      role="button"
      aria-disabled={notification.read || isActing}
      tabIndex={0}
      onClick={startAction}
      onKeyDown={handleKeydown}
    >
      <div className="flex w-full items-center gap-x-3 px-3 py-2">
        {cloneElement(icon, {
          'aria-hidden': true,
          className: StyleHelper.mergeStyles('mt-6', icon.props?.className, 'size-7 max-size-7 min-size-7 self-start', {
            'text-gray-300': notification.read,
          }),
        })}

        <div className="flex w-full min-w-0 grow flex-col text-left">
          <div className="mb-0.5 flex items-center gap-x-2">
            <p className="text-1xs text-gray-300">
              {DateHelper.formatLocalized(notification.date, { format: 'Pp', language })}
            </p>

            {notification.provider && (
              <p
                className={StyleHelper.mergeStyles('text-1xs rounded-full bg-gray-800 px-2 py-px text-gray-300', {
                  'bg-gray-300/15 text-gray-100/50': notification.read,
                })}
              >
                {t(`providerLabels.${notification.provider}`)}
              </p>
            )}
          </div>

          <h2
            className={StyleHelper.mergeStyles('text-sm font-bold text-white', {
              'text-gray-300': notification.read,
            })}
          >
            {tGlobal(notification.title, { defaultValue: notification.title, value: notification.titleValue })}
          </h2>

          <p
            className={StyleHelper.mergeStyles('text-1xs text-gray-100', {
              'text-gray-300': notification.read,
            })}
          >
            {tGlobal(notification.previewBody, {
              defaultValue: notification.previewBody,
              value: notification.previewBodyValue,
            })}
          </p>

          {notification.related?.address && (
            <div className="text-1xs mt-0.5 flex items-center gap-x-2 text-gray-300">
              {account && (
                <p className="w-full max-w-[50%] truncate">{t('relatedAccountLabel', { name: account.name })}</p>
              )}

              <p>
                {t('relatedAddressLabel', { address: StringHelper.truncateMiddle(notification.related.address, 10) })}
              </p>
            </div>
          )}
        </div>

        <ActionPopover.Root>
          <ActionPopover.Trigger asChild>
            <IconButton
              aria-label={t('actionsButtonLabel')}
              size="xs"
              icon={<MdMoreVert aria-hidden className="max-size-6 min-size-6 size-6 text-gray-300" />}
              onClick={handleStopPropagation}
            />
          </ActionPopover.Trigger>

          <ActionPopover.Content side="bottom" align="end" onClick={handleStopPropagation}>
            <ActionPopover.Item
              label={notification.read ? t('markAsUnreadButtonLabel') : t('markAsReadButtonLabel')}
              actionPopoverItemType="button"
              colorSchema="white"
              iconsOnEdge={false}
              onClick={handleToggleRead}
            />
          </ActionPopover.Content>
        </ActionPopover.Root>
      </div>
    </div>
  )
}
