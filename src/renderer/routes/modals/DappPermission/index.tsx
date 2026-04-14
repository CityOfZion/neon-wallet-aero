import { useEffect } from 'react'

import type { TWalletKitHelperSessionDetails } from '@cityofzion/bs-multichain'
import { BSNeoXConstants } from '@cityofzion/bs-neox'
import type { ErrorResponse } from '@walletconnect/jsonrpc-utils'
import type { PendingRequestTypes, SessionTypes } from '@walletconnect/types'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'

import { WalletConnectError } from '@renderer/helpers/ErrorHelper'
import { LoggerHelper } from '@renderer/helpers/LoggerHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { useConfirmAction } from '@renderer/hooks/useConfirmAction'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { usePressOnce } from '@renderer/hooks/usePressOnce'
import { useSelectedNetworkSelector } from '@renderer/hooks/useSettingsSelector'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import { rendererApi } from '@shared/message-api/renderer'
import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import type { TModalState } from '@shared/types/modal'
import type { TAccount } from '@shared/types/store'

import { DappPermissionErrorContent } from './DappPermissionErrorContent'
import { DappPermissionGenericContent } from './DappPermissionGenericContent'
import { DappPermissionInvokeNeo3Content } from './DappPermissionInvokeNeo3Content'
import { DappPermissionSuccessContent } from './DappPermissionSuccessContent'

export type TDappPermissionProps = {
  request: PendingRequestTypes.Struct
  session: SessionTypes.Struct
  sessionDetails: TWalletKitHelperSessionDetails<TBlockchainServiceKey>
  sessionAccount: TAccount
  onAccept: () => void
  onReject: (reason?: ErrorResponse, toastMessage?: string) => void
  isAccepting: boolean
  isRejecting: boolean
}

const CUSTOM_CONTENT_BY_REQUEST: Partial<
  Record<TBlockchainServiceKey, Record<string, (props: TDappPermissionProps) => JSX.Element>>
> = {
  neo3: {
    invokeFunction: DappPermissionInvokeNeo3Content,
    signTransaction: DappPermissionInvokeNeo3Content,
  },
}

export const DappPermissionModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'dappPermission' })
  const { session, request, onAccept, onReject, sessionAccount, sessionDetails } =
    useModalState<TModalState<'dapp-permission'>>()
  const { modalErase, modalNavigate } = useModalNavigate()
  const { confirmAction } = useConfirmAction()

  const blockchain = sessionAccount.blockchain || sessionDetails.blockchain

  const { network } = useSelectedNetworkSelector(blockchain)

  const [isRejecting, startReject] = usePressOnce(async (reason?: ErrorResponse, toastMessage?: string) => {
    await onReject(reason)
    modalErase('bottom')
    ToastHelper.error({ message: toastMessage || t('errors.cancelled'), id: 'dapp-permission-cancel' })
  })

  const [isAccepting, startAccept] = usePressOnce(async () => {
    try {
      await confirmAction({ account: sessionAccount })

      const response = await onAccept()

      modalNavigate('success', {
        replace: true,
        state: {
          heading: t('successContent.title'),
          subtitle: t('successContent.subtitle'),
          content: <DappPermissionSuccessContent response={response} />,
        },
      })
    } catch (error) {
      LoggerHelper.error(error, { where: 'DappPermissionModal', operation: 'startAccept' })
      const walletConnectError = WalletConnectError.wrap(error)

      if (walletConnectError.fromAppError) {
        ToastHelper.error({ message: walletConnectError.message, id: 'dapp-permission-error' })
        return
      }

      const hasNonce = !!request.params.request.params?.[0]?.nonce

      const isNeoxAntiMev =
        blockchain === 'neox' &&
        BSNeoXConstants.ANTI_MEV_RPC_LIST_BY_NETWORK_ID[network.id].some(url => url === network.url)

      // It's expected to receive a transaction cached error on first Anti-MEV transaction
      if (isNeoxAntiMev && hasNonce && walletConnectError.message?.includes('transaction cached')) {
        modalNavigate('success', {
          replace: true,
          state: {
            heading: t('successContent.title'),
            subtitle: t('successContent.subtitle'),
            // Don't translate the response, because this property isn't translated, it comes from RPC
            content: <DappPermissionSuccessContent response="Transaction cached" />,
          },
        })

        return
      }

      modalNavigate('error', {
        replace: true,
        state: {
          heading: t('errorContent.title'),
          subtitle: t('errorContent.subtitle'),
          content: <DappPermissionErrorContent error={walletConnectError} />,
        },
      })
    }
  })

  useEffect(() => {
    const removeSessionRequestExpireListener = rendererApi.listen(
      'wallet-connect:session_request_expire',
      async ({ args }) => {
        if (args !== request.id) return
        ToastHelper.error({ message: t('errors.expired'), id: 'dapp-permission-expired' })
        modalErase('bottom')
      }
    )

    return () => {
      removeSessionRequestExpireListener()
    }
  }, [modalErase, request.id, t])

  const Content = CUSTOM_CONTENT_BY_REQUEST[blockchain]?.[request.params.request.method] || DappPermissionGenericContent

  return (
    <BottomModalLayout heading={t('title')} contentClassName="px-0 flex flex-col pb-5 min-h-0" onClose={startReject}>
      <Content
        request={request}
        session={session}
        sessionDetails={sessionDetails}
        sessionAccount={sessionAccount}
        onAccept={startAccept}
        onReject={startReject}
        isAccepting={isAccepting}
        isRejecting={isRejecting}
      />
    </BottomModalLayout>
  )
}

export default DappPermissionModal
