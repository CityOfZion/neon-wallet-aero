import { useRef } from 'react'

import intersection from 'lodash/intersection'

import { ConstantsHelper } from '@renderer/helpers/ConstantsHelper'
import { LoggerHelper } from '@renderer/helpers/LoggerHelper'

import { useOwnAccountsSelector } from '@renderer/hooks/useAccountSelector'
import { useLazyBalance } from '@renderer/hooks/useBalances'
import { useMount } from '@renderer/hooks/useMount'
import { useLazyNeo3VoteGetVoteDetailsByAddress } from '@renderer/hooks/useNeo3Vote'
import { useUnreadNotificationsSelector } from '@renderer/hooks/useNotificationsSelector'
import { useAppDispatch } from '@renderer/hooks/useRedux'

import { authReducerActions } from '@renderer/store/reducers/auth'
import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import type { TBalance } from '@shared/types/query'
import type { TAccount, TNotification } from '@shared/types/store'

const SETUP_PREFIX = 'pages:private.accountTasksManagerSetup'
const VOTING_NOTIFICATION_PREFIX = `${SETUP_PREFIX}.useVotingNeo3NotificationProcess`
const FRAUDULENT_NOTIFICATION_PREFIX = `${SETUP_PREFIX}.useFraudulentTokensNotificationProcess`
const BNEO_SHUTDOWN_NOTIFICATION_PREFIX = `${SETUP_PREFIX}.useBNeoShutdownNotificationProcess`

const useFraudulentTokensNotificationProcess = () => {
  const dispatch = useAppDispatch()

  const notificationKeysRef = useRef<Set<string>>(new Set())

  const generateNotificationKey = (blockchain: TBlockchainServiceKey, address: string, tokenHash: string) => {
    return `${blockchain}:${address}:${tokenHash}`
  }

  const processNotification = (notification: TNotification) => {
    try {
      const payload = notification.action?.payload

      if (payload?.to !== 'hide-fraudulent-token') return

      const key = generateNotificationKey(payload.blockchain, payload.address, payload.tokenHash)

      notificationKeysRef.current.add(key)
    } catch (error) {
      LoggerHelper.error(error, { where: 'useFraudulentTokensNotificationProcess', operation: 'processNotification' })
    }
  }

  const process = (account: TAccount, balance?: TBalance) => {
    try {
      if (!balance) return

      const fraudulentHashes = ConstantsHelper.fraudulentTokenHashesByBlockchain.get(account.blockchain)

      if (!fraudulentHashes) return

      const fraudulentHashesOwned = new Set(intersection([...fraudulentHashes], [...balance.tokensBalancesMap.keys()]))

      for (const fraudulentHash of fraudulentHashesOwned) {
        const tokenBalance = balance.tokensBalancesMap.get(fraudulentHash)

        if (!tokenBalance) continue

        const notificationKey = generateNotificationKey(account.blockchain, account.address, tokenBalance.token.hash)

        if (notificationKeysRef.current.has(notificationKey)) continue

        dispatch(
          authReducerActions.saveNotification({
            title: `${FRAUDULENT_NOTIFICATION_PREFIX}.notificationTitle`,
            titleValue: tokenBalance.token.name,
            previewBody: `${FRAUDULENT_NOTIFICATION_PREFIX}.notificationDescription`,
            previewBodyValue: tokenBalance.token.name,
            priority: 'high',
            action: {
              type: 'navigate',
              payload: {
                to: 'hide-fraudulent-token',
                address: account.address,
                blockchain: account.blockchain,
                tokenHash: tokenBalance.token.hash,
              },
            },
            related: {
              address: account.address,
              blockchain: account.blockchain,
            },
          })
        )
      }
    } catch (error) {
      LoggerHelper.error(error, { where: 'useFraudulentTokensNotificationProcess', operation: 'process' })
    }
  }

  const finish = () => {
    notificationKeysRef.current.clear()
  }

  return { process, processNotification, finish }
}

const useBNeoShutdownNotificationProcess = () => {
  const dispatch = useAppDispatch()

  const notificationsSetByAddressRef = useRef<Set<string>>(new Set())

  const dateLimit = new Date('2026-08-01T00:00:00Z')

  const processNotification = (notification: TNotification) => {
    try {
      const payload = notification.action?.payload

      if (payload?.to !== 'bneo-shutdown') return

      notificationsSetByAddressRef.current.add(payload.address)
    } catch (error) {
      LoggerHelper.error(error, { where: 'useBNeoShutdownNotificationProcess', operation: 'processNotification' })
    }
  }

  const process = (account: TAccount, balance: TBalance | undefined) => {
    try {
      if (!balance || account.blockchain !== 'neo3' || new Date() >= dateLimit) return

      const tokenBalance = balance.tokensBalancesMap.get(ConstantsHelper.bNeoTokenHash)
      if (!tokenBalance || tokenBalance.amountNumber === 0) return

      if (notificationsSetByAddressRef.current.has(account.address)) return

      dispatch(
        authReducerActions.saveNotification({
          title: `${BNEO_SHUTDOWN_NOTIFICATION_PREFIX}.title`,
          previewBody: `${BNEO_SHUTDOWN_NOTIFICATION_PREFIX}.description`,
          priority: 'high',
          action: {
            type: 'navigate',
            payload: {
              to: 'bneo-shutdown',
              address: balance.address,
              blockchain: balance.blockchain,
            },
          },
          related: {
            address: balance.address,
            blockchain: balance.blockchain,
          },
        })
      )
    } catch (error) {
      LoggerHelper.error(error, { where: 'useBNeoShutdownNotificationProcess', operation: 'process' })
    }
  }

  const finish = () => {
    notificationsSetByAddressRef.current.clear()
  }

  return { process, processNotification, finish }
}

const useVotingNeo3NotificationProcess = () => {
  const dispatch = useAppDispatch()
  const { getVoteDetails } = useLazyNeo3VoteGetVoteDetailsByAddress()

  const notificationKeysRef = useRef<Set<string>>(new Set())

  const generateNotificationKey = (blockchain: TBlockchainServiceKey, address: string) => {
    return `${blockchain}:${address}`
  }

  const processNotification = (notification: TNotification) => {
    try {
      const payload = notification.action?.payload

      if (!payload || payload.to !== 'neo3-vote' || payload.blockchain !== 'neo3' || !payload.address) return

      const key = generateNotificationKey(payload.blockchain, payload.address)

      notificationKeysRef.current.add(key)
    } catch (error) {
      LoggerHelper.error(error, { where: 'useVotingNeo3NotificationProcess', operation: 'processNotification' })
    }
  }

  const process = async (account: TAccount) => {
    try {
      if (account.blockchain !== 'neo3') return

      const notificationKey = generateNotificationKey(account.blockchain, account.address)

      if (notificationKeysRef.current.has(notificationKey)) return

      const voteDetails = await getVoteDetails(account.address)

      if (!voteDetails || voteDetails.candidatePubKey || voteDetails.neoBalance === 0) return

      dispatch(
        authReducerActions.saveNotification({
          title: `${VOTING_NOTIFICATION_PREFIX}.notificationTitle`,
          previewBody: `${VOTING_NOTIFICATION_PREFIX}.notificationDescription`,
          action: {
            type: 'navigate',
            payload: {
              to: 'neo3-vote',
              blockchain: 'neo3',
              address: voteDetails.address,
            },
          },
          related: {
            blockchain: 'neo3',
            address: voteDetails.address,
          },
        })
      )
    } catch (error) {
      LoggerHelper.error(error, { where: 'useVotingNeo3NotificationProcess', operation: 'process' })
    }
  }

  const finish = () => {
    notificationKeysRef.current.clear()
  }

  return { process, processNotification, finish }
}

const AccountTasksManagerSetup = () => {
  const { ownAccounts } = useOwnAccountsSelector()
  const { unreadNotificationsRef } = useUnreadNotificationsSelector()

  const { getBalance } = useLazyBalance()

  const fraudulentTokens = useFraudulentTokensNotificationProcess()
  const bNeoShutdownProcess = useBNeoShutdownNotificationProcess()
  const votingNeo3 = useVotingNeo3NotificationProcess()

  const accountsAlreadyProcessedRef = useRef<Set<string>>(new Set())

  useMount(() => {
    requestIdleCallback(
      async () => {
        for (const notification of unreadNotificationsRef.current) {
          fraudulentTokens.processNotification(notification)
          bNeoShutdownProcess.processNotification(notification)
          votingNeo3.processNotification(notification)
        }

        for (const account of ownAccounts) {
          if (accountsAlreadyProcessedRef.current.has(account.id)) continue

          accountsAlreadyProcessedRef.current.add(account.id)

          const balance = await getBalance(account, { showType: 'active' })

          fraudulentTokens.process(account, balance)
          bNeoShutdownProcess.process(account, balance)
          await votingNeo3.process(account)
        }

        fraudulentTokens.finish()
        bNeoShutdownProcess.finish()
        votingNeo3.finish()
      },
      { timeout: 15000 }
    )
  }, [ownAccounts.length])

  return null
}

export default AccountTasksManagerSetup
