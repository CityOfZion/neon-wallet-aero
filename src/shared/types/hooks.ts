import type {
  TBSToken,
  TFullTransactionAssetEvent as TBSFullTransactionAssetEvent,
  TFullTransactionNftEvent as TBSFullTransactionNftEvent,
  TFullTransactionsByAddressResponse as TBSFullTransactionsByAddressResponse,
  TFullTransactionsItem as TBSFullTransactionsItem,
} from '@cityofzion/blockchain-service'
import type zod from 'zod'

import type { neonBackupContentSchema, neonBackupDataSchema } from '@shared/schemas/neon-backup'

import type {
  TAccountsToImport,
  TBlockchainServiceKey,
  TCreateWalletAndAccountParam,
  TWalletToCreate,
} from './blockchain'
import type { TModalRouterContextNavigateOptions, TRouteType } from './modal'
import type { TModalRouterRouteTypes } from './modal-router'
import type { IAccountState, TContactState, TSwapRecord } from './store'

export type TUseActionsData = Record<string, any>

export type TUseActionsOptions = {
  clearErrorsOnChange?: boolean
}

export type TUseImportActionInputType = 'key' | 'mnemonic' | 'encrypted' | 'address'

export type TUseActionsErrors<T> = Record<keyof T, string | undefined>

export type TUseActionsChanged<T> = Record<keyof T, boolean>

export type TUseActionsActionState<T> = {
  hasChanged: boolean
  isValid: boolean
  isActing: boolean
  errors: TUseActionsErrors<T>
  changed: TUseActionsChanged<T>
  hasActed: boolean
}

type TUseModalNavigateFunction<R = void> = {
  (name: number): R
  <T extends keyof TModalRouterRouteTypes>(
    name: T,
    options?: TModalRouterContextNavigateOptions<TModalRouterRouteTypes[T]>
  ): R
}

export type TUseModalNavigateResponse = {
  modalNavigate: TUseModalNavigateFunction
  modalNavigateWrapper: TUseModalNavigateFunction<() => void>
  modalErase(type: TRouteType): void
  modalEraseWrapper(type: TRouteType): () => void
}

type TFullTransactionCommonEvent = {
  fromAccount?: IAccountState
  toAccount?: IAccountState
}

export type TFullTransactionNftEvent = TFullTransactionCommonEvent & TBSFullTransactionNftEvent

export type TFullTransactionAssetEvent = TFullTransactionCommonEvent & TBSFullTransactionAssetEvent

export type TFullTransactionEvent = TFullTransactionAssetEvent | TFullTransactionNftEvent

export type TFullTransactionsItem = Omit<TBSFullTransactionsItem, 'events'> & {
  account: IAccountState
  blockchain: TBlockchainServiceKey
  isPending: boolean
  events: TFullTransactionEvent[]
}

export type TFullTransactionsByAddressResponse = Omit<TBSFullTransactionsByAddressResponse, 'data'> & {
  data: Map<string, TFullTransactionsItem>
}

export type TFullTransactionsGroupedDataByDate = {
  date: string
  items: TFullTransactionsItem[]
}

export type TTransactionsTransfer = {
  time: number
  hash: string
  account: IAccountState
  fromAccount?: IAccountState
  toAccount?: IAccountState
  methodName?: string
  isPending?: boolean
  isClaim?: boolean
  amount: string
  from?: string
  to?: string
  asset: string
  assetHash: string
  token?: TBSToken
  explorerUrl?: string
}

export type TUseHardwareWalletByUsbStatus = 'searching' | 'connected' | 'not-connected'

export type TUseNeonBackupAccount = zod.infer<typeof neonBackupDataSchema>['wallets'][0]['accounts'][0]
export type TUseNeonBackupWallet = zod.infer<typeof neonBackupDataSchema>['wallets'][0]

export type TUseNeonBackupContentSchema = zod.infer<typeof neonBackupContentSchema>
export type TUseNeonBackupDataSchema = zod.infer<typeof neonBackupDataSchema>
export type TUseNeonBackupData = { content: TUseNeonBackupContentSchema; type: 'backup' }
export type TUseNeonBackupDeprecatedData = { content: string; type: 'backup-deprecated' }

export type TUseNeonBackupGeneratedData = {
  wallets: TCreateWalletAndAccountParam[]
  swapRecords?: TSwapRecord[]
  contacts?: TContactState[]
}

export type TUseNeonMigrateAccountsSchema = {
  address: string
  label: string
  key: string
  blockchain: TBlockchainServiceKey
}

export type TUseNeonMigrateContactsSchema = {
  addresses: { address: string; blockchain: TBlockchainServiceKey }[]
  name: string
}

export type TUseNeonMigrateParsedContent = {
  accounts: TUseNeonMigrateAccountsSchema[]
  contacts: TUseNeonMigrateContactsSchema[]
}

export type TUseNeonMigrateData = { content: TUseNeonMigrateParsedContent; type: 'migrate' }

export type TUseNeonMigrateDecryptedAccountSchema = TUseNeonMigrateAccountsSchema & {
  decryptedKey: string
}

export type TUseNeonMigrateGeneratedData = {
  walletToCreate: TWalletToCreate
  accountsToCreate: TAccountsToImport
  contactsToCreate: TContactState[]
}
