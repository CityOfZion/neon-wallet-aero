import type { TBSToken, TTransactionDefault, TTransactionUtxo } from '@cityofzion/blockchain-service'
import type { TBSNeo3Name } from '@cityofzion/bs-neo3'
import type { TBSStellarName } from '@cityofzion/bs-stellar'
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
import type { TUseBalanceResult } from './query'
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

export type TUseTransactionsTransaction = TBlockchainServiceKey extends infer N
  ? N extends TBlockchainServiceKey
    ? TTransactionDefault<N> | TTransactionUtxo<N>
    : never
  : never

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

export type TUseNeo3VoteCalculateVoteFeeParams = {
  neo3Account?: TAccount<TBSNeo3Name>
  candidatePubKey: string
}

export type TUseNeo3VoteBuildNeo3VoteGetCandidatesToVoteQueryKeyParams = {
  neo3Network: TNetwork
}

export type TUseNeo3VoteBuildNeo3VoteCalculateVoteFeeQueryKeyParams = {
  neo3Network: TNetwork
  candidatePubKey: string
  neo3Account?: TAccount<TBSNeo3Name>
}

export type TUseNeo3VoteBuildNeo3VoteGetVoteDetailsByAddressQueryKeyParams = {
  neo3Network: TNetwork
  address: string
}

export type TUseNeo3VoteValidationsParams = {
  balanceQuery: TUseBalanceResult
  gasFee?: string
}

export type TUseStellarPersistTrustlineMutationParams = {
  stellarAccount: TAccount<TBSStellarName>
  token: TBSToken
  limit?: string
}
