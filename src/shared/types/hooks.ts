import type {
  TGetTransactionsByAddressResponse,
  TTransactionDefault,
  TTransactionInputOutput,
  TTransactionNftEvent,
  TTransactionTokenEvent,
  TTransactionUtxo,
} from '@cityofzion/blockchain-service'
import type zod from 'zod'

import type { neonBackupContentSchema, neonBackupDataSchema } from '@shared/schemas/neon-backup'

import type {
  TAccountsToImport,
  TBlockchainServiceKey,
  TCreateWalletAndAccountParam,
  TNetwork,
  TWalletToCreate,
} from './blockchain'
import type { TModalRouterContextNavigateOptions, TRouteType } from './modal'
import type { TModalRouterRouteTypes } from './modal-router'
import type { TAccount, TContact, TSwapRecord } from './store'

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

//* useTransactions types *//

export type TUseTransactionsProps = {
  account: TAccount
  dateFrom: Date
  dateTo: Date
}

type TUseTransactionsTransactionEventBase = {
  fromAccount?: TAccount
  toAccount?: TAccount
}

export type TUseTransactionsTransactionEventToken = TTransactionTokenEvent & TUseTransactionsTransactionEventBase

export type TUseTransactionsTransactionEventNft = TTransactionNftEvent & TUseTransactionsTransactionEventBase

export type TUseTransactionsTransactionEvent =
  | TUseTransactionsTransactionEventToken
  | TUseTransactionsTransactionEventNft

export type TUseTransactionsTransactionInputOutput = TTransactionInputOutput & {
  account?: TAccount
}

type TUseTransactionsTransactionBase = {
  account: TAccount
  blockchain: TBlockchainServiceKey
  isPending: boolean
}

export type TUseTransactionsTransactionDefault = TTransactionDefault<TBlockchainServiceKey> &
  TUseTransactionsTransactionBase & { events: TUseTransactionsTransactionEvent[] }

export type TUseTransactionsTransactionUtxo = TTransactionUtxo<TBlockchainServiceKey> &
  TUseTransactionsTransactionBase & {
    inputs: TUseTransactionsTransactionInputOutput[]
    outputs: TUseTransactionsTransactionInputOutput[]
  }

export type TUseTransactionsTransaction = TUseTransactionsTransactionDefault | TUseTransactionsTransactionUtxo

export type TUseTransactionsQueryData = Omit<
  TGetTransactionsByAddressResponse<TBlockchainServiceKey>,
  'transactions'
> & {
  transactions: Map<string, TUseTransactionsTransaction>
}

export type TUseTransactionsGroupedTransactionsByDate = {
  date: string
  transactions: TUseTransactionsTransaction[]
}

export type TUseTransactionsBuildTransactionsQueryKeyParams = {
  address: string
  blockchain: TBlockchainServiceKey
  network: TNetwork
  dateFrom?: Date
  dateTo?: Date
}

export type TUseNeonBackupAccount = zod.infer<typeof neonBackupDataSchema>['wallets'][0]['accounts'][0]
export type TUseNeonBackupWallet = zod.infer<typeof neonBackupDataSchema>['wallets'][0]

export type TUseNeonBackupContentSchema = zod.infer<typeof neonBackupContentSchema>
export type TUseNeonBackupDataSchema = zod.infer<typeof neonBackupDataSchema>
export type TUseNeonBackupData = { content: TUseNeonBackupContentSchema; type: 'backup' }

export type TUseNeonBackupGeneratedData = {
  wallets: TCreateWalletAndAccountParam[]
  swapRecords?: TSwapRecord[]
  contacts?: TContact[]
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
  contactsToCreate: TContact[]
}
