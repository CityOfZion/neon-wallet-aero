import { useEffect } from 'react'

import type { TWalletKitHelperSessionDetails } from '@cityofzion/bs-multichain'
import type { ErrorResponse } from '@walletconnect/jsonrpc-utils'
import type { PendingRequestTypes, SessionTypes } from '@walletconnect/types'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'

import { WalletConnectError } from '@renderer/helpers/ErrorHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { usePressOnce } from '@renderer/hooks/usePressOnce'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import { rendererApi } from '@shared/message-api/renderer'
import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import type { TModalState } from '@shared/types/modal'
import type { IAccountState } from '@shared/types/store'

import { DappPermissionErrorContent } from './DappPermissionErrorContent'
import { DappPermissionGenericContent } from './DappPermissionGenericContent'
import { DappPermissionInvokeNeo3Content } from './DappPermissionInvokeNeo3Content'
import { DappPermissionSuccessContent } from './DappPermissionSuccessContent'

export type TDappPermissionProps = {
  request: PendingRequestTypes.Struct
  session: SessionTypes.Struct
  sessionDetails: TWalletKitHelperSessionDetails<TBlockchainServiceKey>
  sessionAccount: IAccountState
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

  const [isRejecting, startReject] = usePressOnce(async (reason?: ErrorResponse, toastMessage?: string) => {
    await onReject(reason)
    modalErase('bottom')
    ToastHelper.error({ message: toastMessage ?? t('errors.cancelled'), id: 'dapp-permission-cancel' })
  })

  const [isAccepting, startAccept] = usePressOnce(async () => {
    try {
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
      const walletConnectError = WalletConnectError.wrap(error)

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

  const Content =
    CUSTOM_CONTENT_BY_REQUEST[sessionDetails.blockchain]?.[request.params.request.method] ??
    DappPermissionGenericContent

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
