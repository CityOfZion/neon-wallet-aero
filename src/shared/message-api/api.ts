import type { IWalletKit } from '@reown/walletkit'
import type { PendingRequestTypes, ProposalTypes } from '@walletconnect/types'

import type { TDapiRequest } from '@shared/types/dapi'
import type { TLoginSession } from '@shared/types/store'

export type TMessageApiListenerOptions<T = any[]> = {
  args: T
  sender: chrome.runtime.MessageSender
}

export type TMessageApiListener<T = any[], R = any> = (options: TMessageApiListenerOptions<T>) => Promise<R> | R

export type TMessageApiSendArgs<T> = T extends TMessageApiListener<infer U> ? U : never

export type TMessageApiSendResponse<T> = T extends TMessageApiListener<any, infer U> ? U : never

export type TOpenTabArgs = {
  href: string
  query?: Record<string, any>
}

export type TWalletConnectRejectProposalArgs = Parameters<IWalletKit['rejectSession']>[0]
export type TWalletConnectApproveProposalArgs = Parameters<IWalletKit['approveSession']>[0]
export type TWalletConnectDisconnectArgs = Parameters<IWalletKit['disconnectSession']>[0]
export type TWalletConnectRespondRequestArgs = Parameters<IWalletKit['respondSessionRequest']>[0]
export type TWalletConnectGetSessionsResponse = ReturnType<IWalletKit['getActiveSessions']>
export type TWalletConnectGetRequestsResponse = ReturnType<IWalletKit['getPendingSessionRequests']>

export type TMessageBackgroundApi = {
  'login:save-session': TMessageApiListener<TLoginSession | undefined, void>
  'login:get-session': TMessageApiListener<undefined, TLoginSession | undefined>
  'tab:open': TMessageApiListener<TOpenTabArgs, void>
  'tab:close-all': TMessageApiListener<undefined, void>
  'wallet-connect:pair': TMessageApiListener<string, ProposalTypes.Struct>
  'wallet-connect:disconnect': TMessageApiListener<TWalletConnectDisconnectArgs, void>
  'wallet-connect:reject-proposal': TMessageApiListener<TWalletConnectRejectProposalArgs, void>
  'wallet-connect:approve-proposal': TMessageApiListener<TWalletConnectApproveProposalArgs, void>
  'wallet-connect:get-sessions': TMessageApiListener<undefined, TWalletConnectGetSessionsResponse>
  'wallet-connect:get-requests': TMessageApiListener<undefined, TWalletConnectGetRequestsResponse>
  'wallet-connect:respond-request': TMessageApiListener<TWalletConnectRespondRequestArgs, void>
  'popup:open': TMessageApiListener<undefined, void>

  'dapi:neo3:get-accounts': TMessageApiListener<TDapiRequest, void>
  'dapi:neo3:get-network': TMessageApiListener<TDapiRequest, void>
  'dapi:neo3:get-balance': TMessageApiListener<TDapiRequest, void>
  'dapi:neo3:relay': TMessageApiListener<TDapiRequest, void>
  'dapi:neo3:get-block': TMessageApiListener<TDapiRequest, void>
  'dapi:neo3:get-block-count': TMessageApiListener<TDapiRequest, void>
  'dapi:neo3:get-transaction': TMessageApiListener<TDapiRequest, void>
  'dapi:neo3:get-application-log': TMessageApiListener<TDapiRequest, void>
  'dapi:neo3:get-storage': TMessageApiListener<TDapiRequest, void>
  'dapi:neo3:get-token-info': TMessageApiListener<TDapiRequest, void>
  'dapi:neo3:pick-address': TMessageApiListener<TDapiRequest, void>
  'dapi:neo3:authenticate': TMessageApiListener<TDapiRequest, void>
  'dapi:neo3:call': TMessageApiListener<TDapiRequest, void>
  'dapi:neo3:send': TMessageApiListener<TDapiRequest, void>
  'dapi:neo3:invoke': TMessageApiListener<TDapiRequest, void>
  'dapi:neo3:make-transaction': TMessageApiListener<TDapiRequest, void>
  'dapi:neo3:sign': TMessageApiListener<TDapiRequest, void>
  'dapi:neo3:sign-message': TMessageApiListener<TDapiRequest, void>
  'dapi:neo3:approval-result': TMessageApiListener<{ request: TDapiRequest; response?: unknown; error?: unknown }, void>
}

export type TMessageRendererApi = {
  'wallet-connect:session_request': TMessageApiListener<PendingRequestTypes.Struct, void>
  'wallet-connect:session_request_expire': TMessageApiListener<number, void>
}
