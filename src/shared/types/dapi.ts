import type { Address } from '@cityofzion/neon-dapi'

import type { TAccount } from './store'

export type TDapiRequest = {
  id: string
  event: string
  method: string
  args: any[]
  origin: string
  type: string
  icon?: string
  name?: string
  account?: TAccount<'neo3'>
}

export type TDapiPermissionContentProps = {
  request: TDapiRequest
  sendResult: (response?: any, error?: any) => void
}

export type TDapiConnectedDapp = {
  address: Address
  networks: string[]
}

export enum EDapiMessageTypes {
  NEON_WALLET_INJECTED_REQUEST = 'NEON_WALLET_INJECTED_REQUEST',
  NEON_WALLET_INJECTED_RESULT = 'NEON_WALLET_INJECTED_RESULT',
  NEON_WALLET_APP_RESULT = 'NEON_WALLET_APP_RESULT',
}
