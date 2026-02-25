import { WalletKitHelper } from '@cityofzion/bs-multichain'
import type { ErrorResponse } from '@walletconnect/jsonrpc-utils'
import type { PendingRequestTypes } from '@walletconnect/types'
import { useTranslation } from 'react-i18next'

import { AccountHelper } from '@renderer/helpers/AccountHelper'
import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { EncryptionHelper } from '@renderer/helpers/EncryptionHelper'
import { AppError } from '@renderer/helpers/ErrorHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { useAccountsMapSelector } from '@renderer/hooks/useAccountSelector'
import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { useMountUnsafe } from '@renderer/hooks/useMount'

import { rendererApi } from '@shared/message-api/renderer'

export const WalletConnectManagerSetup = () => {
  const { modalNavigate, modalErase } = useModalNavigate()
  const { accountsMapRef } = useAccountsMapSelector()
  const { loginSessionRef } = useLoginSessionSelector()
  const { t } = useTranslation('pages', { keyPrefix: 'private.walletConnectManagerSetup' })

  useMountUnsafe(async () => {
    async function handleRequest(request: PendingRequestTypes.Struct) {
      const sessions = await rendererApi.send('wallet-connect:get-sessions')

      const session = sessions[request.topic]
      if (!session) return

      const sessionDetails = WalletKitHelper.getSessionDetails({
        session,
        services: BlockchainServiceHelper.bsAggregator.blockchainServices,
      })
      const sessionAccount = accountsMapRef.current.get(AccountHelper.buildAccountKey(sessionDetails))

      async function handleReject(reason?: ErrorResponse) {
        await rendererApi
          .send('wallet-connect:respond-request', {
            topic: request.topic,
            response: WalletKitHelper.formatRequestError(request, reason ?? WalletKitHelper.getError('USER_REJECTED')),
          })
          .catch(console.error)
      }

      async function handleAccept() {
        try {
          const key = await EncryptionHelper.decrypt(
            sessionAccount!.encryptedKey,
            loginSessionRef.current!.encryptedPassword
          )

          const serviceAccount = await AccountHelper.getServiceAccount({ account: sessionAccount!, key })

          const response = await WalletKitHelper.processRequest({
            account: serviceAccount,
            request,
            sessionDetails,
          })

          await rendererApi.send('wallet-connect:respond-request', {
            topic: request.topic,
            response: WalletKitHelper.formatRequestResult(request, response),
          })

          return response
        } catch (error: any) {
          const appError = AppError.wrap(error, error.message)

          await rendererApi.send('wallet-connect:respond-request', {
            topic: request.topic,
            response: WalletKitHelper.formatRequestError(request, { message: appError.message, code: -32000 }),
          })

          throw appError
        }
      }

      if (!sessionAccount || sessionAccount.type === 'watch' || !loginSessionRef.current) {
        handleReject(WalletKitHelper.getError('UNSUPPORTED_NAMESPACE_KEY'))
        return
      }

      const method = request.params.request.method

      if (sessionDetails.service.walletConnectService.autoApproveMethods.includes(method)) {
        ToastHelper.loading({
          message: t('autoAcceptProcessingMessage'),
          id: 'auto-approve-walletconnect-request',
        })

        handleAccept()
          .then(() => {
            ToastHelper.success({
              message: t('autoAcceptSuccessMessage'),
              id: 'auto-approve-walletconnect-request',
            })
          })
          .catch(error => {
            ToastHelper.error({
              message: AppError.wrap(error, t('autoAcceptErrorMessage')).message,
              id: 'auto-approve-walletconnect-request',
            })
            console.error(error)
          })
        return
      }

      modalErase('bottom')
      modalNavigate('dapp-permission', {
        state: { request, session, sessionDetails, sessionAccount, onAccept: handleAccept, onReject: handleReject },
      })
    }

    const removeSessionRequestListener = rendererApi.listen('wallet-connect:session_request', ({ args }) => {
      handleRequest(args)
    })

    const pendingRequests = await rendererApi.send('wallet-connect:get-requests')
    const startPendingRequest = pendingRequests[0]
    if (startPendingRequest) {
      handleRequest(startPendingRequest)
    }

    return () => {
      removeSessionRequestListener()
    }
  })

  return null
}

export default WalletConnectManagerSetup
