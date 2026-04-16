import { useRef } from 'react'

import { LoggerHelper } from '@renderer/helpers/LoggerHelper'

import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'
import { useMount } from '@renderer/hooks/useMount'
import { useUnreadNotificationsSelector } from '@renderer/hooks/useNotificationsSelector'
import { useAppDispatch } from '@renderer/hooks/useRedux'
import { useWalletsSelector } from '@renderer/hooks/useWalletSelector'

import { authReducerActions } from '@renderer/store/reducers/auth'
import type { TNotification, TWallet } from '@shared/types/store'

const SETUP_PREFIX = 'pages:private.walletTasksManagerSetup'
const BACKUP_NOTIFICATION_PREFIX = `${SETUP_PREFIX}.useBackupReminderNotificationProcess`

const useBackupReminderNotificationProcess = () => {
  const dispatch = useAppDispatch()

  const { loginSessionRef } = useLoginSessionSelector()

  const hasUnreadNotificationRef = useRef(false)
  const hasWalletWithoutBackupRef = useRef(false)

  const processNotification = (notification: TNotification) => {
    try {
      if (hasUnreadNotificationRef.current) return

      const payload = notification.action?.payload

      if (payload?.to !== 'backup-wallet') return

      hasUnreadNotificationRef.current = true
    } catch (error) {
      LoggerHelper.error(error, { where: 'useBackupReminderNotificationProcess', operation: 'processNotification' })
    }
  }

  const processWallet = (wallet: TWallet) => {
    try {
      if (
        hasUnreadNotificationRef.current ||
        hasWalletWithoutBackupRef.current ||
        wallet.backupStatus === 'successful' ||
        loginSessionRef.current?.type !== 'password'
      )
        return

      hasWalletWithoutBackupRef.current = true
    } catch (error) {
      LoggerHelper.error(error, { where: 'useBackupReminderNotificationProcess', operation: 'process' })
    }
  }

  const finish = () => {
    try {
      if (hasUnreadNotificationRef.current || !hasWalletWithoutBackupRef.current) return

      setTimeout(() => {
        dispatch(
          authReducerActions.saveNotification({
            title: `${BACKUP_NOTIFICATION_PREFIX}.notificationTitle`,
            previewBody: `${BACKUP_NOTIFICATION_PREFIX}.notificationDescription`,
            priority: 'high',
            action: {
              type: 'navigate',
              payload: { to: 'backup-wallet' },
            },
          })
        )

        hasWalletWithoutBackupRef.current = false
        hasUnreadNotificationRef.current = false
      }, 2000)
    } catch (error) {
      LoggerHelper.error(error, { where: 'useBackupReminderNotificationProcess', operation: 'finish' })
    }
  }

  return { processNotification, processWallet, finish }
}

const WalletTasksManagerSetup = () => {
  const { wallets } = useWalletsSelector()
  const { unreadNotificationsRef } = useUnreadNotificationsSelector()
  const backupReminderNotificationProcess = useBackupReminderNotificationProcess()

  const walletsAlreadyProcessedRef = useRef<Set<string>>(new Set())

  useMount(() => {
    requestIdleCallback(
      async () => {
        for (const notification of unreadNotificationsRef.current) {
          backupReminderNotificationProcess.processNotification(notification)
        }

        for (const wallet of wallets) {
          if (walletsAlreadyProcessedRef.current.has(wallet.id)) continue

          walletsAlreadyProcessedRef.current.add(wallet.id)

          backupReminderNotificationProcess.processWallet(wallet)
        }

        backupReminderNotificationProcess.finish()
      },
      { timeout: 20000 }
    )
  }, [wallets.length])

  return null
}

export default WalletTasksManagerSetup
