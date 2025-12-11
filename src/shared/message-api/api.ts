import type { IWalletKit } from '@reown/walletkit'
import type { PendingRequestTypes, ProposalTypes } from '@walletconnect/types'

import type { THardwareWalletHelperConnectionType } from '@shared/types/helpers'
import type { TLoginSession } from '@shared/types/store'

export type TMessageApiListener<T = any[], R = any> = (options: {
  args: T
  sender: chrome.runtime.MessageSender
}) => Promise<R> | R

export type TMessageApiSendArgs<T> = T extends TMessageApiListener<infer U> ? U : never

export type TMessageApiSendResponse<T> = T extends TMessageApiListener<any, infer U> ? U : never

export type TOpenTabArgs = {
  path: string
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
  'hardware-wallet:save-type': TMessageApiListener<THardwareWalletHelperConnectionType | undefined, void>
  'hardware-wallet:get-type': TMessageApiListener<undefined, THardwareWalletHelperConnectionType | undefined>
}

export type TMessageRendererApi = {
  'wallet-connect:session_request': TMessageApiListener<PendingRequestTypes.Struct, void>
  'wallet-connect:session_request_expire': TMessageApiListener<number, void>
}
