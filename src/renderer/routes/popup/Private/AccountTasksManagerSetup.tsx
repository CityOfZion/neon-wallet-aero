import { useRef } from 'react'

import intersection from 'lodash/intersection'

import { ConstantsHelper } from '@renderer/helpers/ConstantsHelper'

import { useOwnAccountsSelector } from '@renderer/hooks/useAccountSelector'
import { useLazyBalance } from '@renderer/hooks/useBalances'
import { useMount } from '@renderer/hooks/useMount'
import { useUnreadNotificationsSelector } from '@renderer/hooks/useNotificationsSelector'
import { useAppDispatch } from '@renderer/hooks/useRedux'
import { useLazyVoteNeo3GetVoteDetailsByAddress } from '@renderer/hooks/useVoteNeo3'

import { authReducerActions } from '@renderer/store/reducers/auth'
import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import type { TBalance } from '@shared/types/query'
import type { IAccountState, TNotification } from '@shared/types/store'

const SETUP_PREFIX = 'pages:private.accountTasksManagerSetup'
const VOTING_NOTIFICATION_PREFIX = `${SETUP_PREFIX}.useVotingNeo3NotificationProcess`
const FRAUDULENT_NOTIFICATION_PREFIX = `${SETUP_PREFIX}.useFraudulentTokensNotificationProcess`

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
      console.error('Error on processNotification (useFraudulentTokensNotificationProcess):', error)

      // TODO: add Sentry.captureException(error) in the future
    }
  }

  const process = (account: IAccountState, balance?: TBalance) => {
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
      console.error('Error on process (useFraudulentTokensNotificationProcess):', error)

      // TODO: add Sentry.captureException(error) in the future
    }
  }

  const finish = () => {
    notificationKeysRef.current.clear()
  }

  return { process, processNotification, finish }
}

const useVotingNeo3NotificationProcess = () => {
  const dispatch = useAppDispatch()
  const { getVoteDetails } = useLazyVoteNeo3GetVoteDetailsByAddress()

  const notificationKeysRef = useRef<Set<string>>(new Set())

  const generateNotificationKey = (blockchain: TBlockchainServiceKey, address: string) => {
    return `${blockchain}:${address}`
  }

  const processNotification = (notification: TNotification) => {
    try {
      const payload = notification.action?.payload

      if (!payload || payload.to !== 'vote-neo3' || payload.blockchain !== 'neo3' || !payload.address) return

      const key = generateNotificationKey(payload.blockchain, payload.address)

      notificationKeysRef.current.add(key)
    } catch (error) {
      console.error('Error on processNotification (useVotingNeo3NotificationProcess):', error)

      // TODO: add Sentry.captureException(error) in the future
    }
  }

  const process = async (account: IAccountState) => {
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
              to: 'vote-neo3',
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
      console.error('Error on process (useVotingNeo3NotificationProcess):', error)

      // TODO: add Sentry.captureException(error) in the future
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
  const votingNeo3 = useVotingNeo3NotificationProcess()

  const accountsAlreadyProcessedRef = useRef<Set<string>>(new Set())

  useMount(() => {
    requestIdleCallback(
      async () => {
        for (const notification of unreadNotificationsRef.current) {
          fraudulentTokens.processNotification(notification)
          votingNeo3.processNotification(notification)
        }

        for (const account of ownAccounts) {
          if (accountsAlreadyProcessedRef.current.has(account.id)) continue

          accountsAlreadyProcessedRef.current.add(account.id)

          const balance = await getBalance(account, { showType: 'active' })

          fraudulentTokens.process(account, balance)
          await votingNeo3.process(account)
        }

        fraudulentTokens.finish()
        votingNeo3.finish()
      },
      { timeout: 15000 }
    )
  }, [ownAccounts.length])

  return null
}

export default AccountTasksManagerSetup
