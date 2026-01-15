import { hasEncryption } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'

import { neonMigrateSchemaWithTransform } from '@shared/schemas/neon-migrate'
import type { TAccountsToImport, TWalletToCreate } from '@shared/types/blockchain'
import type {
  TUseNeonMigrateAccountsSchema,
  TUseNeonMigrateData,
  TUseNeonMigrateDecryptedAccountSchema,
  TUseNeonMigrateGeneratedData,
  TUseNeonMigrateParsedContent,
} from '@shared/types/hooks'
import type { TContactAddress, TContactState } from '@shared/types/store'

import { useBlockchainActions } from './useBlockchainActions'
import { useContactsSelector } from './useContactSelector'

export const useNeonImportMigrate = () => {
  const { t: commonT } = useTranslation('common', { keyPrefix: 'wallet' })
  const { contactsRef } = useContactsSelector()
  const { saveContacts, createWallet, importAccounts } = useBlockchainActions()

  const validateAndParseFile = async (fileContent: string): Promise<TUseNeonMigrateData | undefined> => {
    try {
      const parsedContent = JSON.parse(fileContent)
      const validatedContent = await neonMigrateSchemaWithTransform.parseAsync(parsedContent)

      return { content: validatedContent, type: 'migrate' }
    } catch {
      /* empty */
    }

    return undefined
  }

  const handleTryDecryptAccount = async (
    accountToMigrate: TUseNeonMigrateAccountsSchema,
    password: string
  ): Promise<TUseNeonMigrateDecryptedAccountSchema | undefined> => {
    const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[accountToMigrate.blockchain]

    if (!hasEncryption(service)) return undefined

    const decryptedAccount = await service.decrypt(accountToMigrate.key, password)

    return {
      ...accountToMigrate,
      decryptedKey: decryptedAccount.key,
    }
  }

  const handleGenerateData = (
    content: TUseNeonMigrateParsedContent,
    decryptedAccounts: TUseNeonMigrateDecryptedAccountSchema[]
  ): TUseNeonMigrateGeneratedData => {
    const contactsToCreate: TContactState[] = []
    const walletToCreate: TWalletToCreate = { name: commonT('migratedWalletName'), backupStatus: 'successful' }
    const accountsToCreate: TAccountsToImport = []

    decryptedAccounts.map(({ address, blockchain, decryptedKey, label }) => {
      if (!blockchain) return

      accountsToCreate.push({ address, blockchain, key: decryptedKey, type: 'standard', name: label })
    })

    content.contacts.forEach(({ name, addresses }) => {
      const contactAddresses: TContactAddress[] = []
      const contacts = contactsRef.current
      const foundContact = contacts.find(contact => name === contact.name)

      addresses.forEach(({ address, blockchain }) => {
        if (!blockchain || foundContact?.addresses?.some(contact => contact.address === address)) return

        contactAddresses.push({ address, blockchain })
      })

      if (!contactAddresses.length) return

      contactsToCreate.push({ name, id: UtilsHelper.uuid(), addresses: contactAddresses })
    })

    return {
      walletToCreate,
      accountsToCreate,
      contactsToCreate,
    }
  }

  const handleImportBackupData = async (data: TUseNeonMigrateGeneratedData) => {
    await saveContacts(data.contactsToCreate)

    const wallet = await createWallet(data.walletToCreate)
    const accounts = await importAccounts({ wallet, accounts: data.accountsToCreate })

    return { wallet, accounts }
  }

  return {
    validateAndParseFile,
    handleTryDecryptAccount,
    handleGenerateData,
    handleImportBackupData,
  }
}
