import { hasNameService } from '@cityofzion/blockchain-service'
import zod from 'zod'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { I18nextHelper } from '@renderer/helpers/I18nextHelper'

import type { TUseNeonMigrateAccountsSchema, TUseNeonMigrateContactsSchema } from '@shared/types/hooks'

const { t } = I18nextHelper.get()

const neonMigrateAccountsSchema = zod.object({
  address: zod.string().nullish(),
  label: zod.string().nullish(),
  key: zod.string().nullish(),
})

const neonMigrateContactsSchema = zod.object({
  name: zod.string().nullish(),
  addresses: zod.array(zod.string()).nullish(),
})

export const neonMigrateSchema = zod.object({
  accounts: zod.array(neonMigrateAccountsSchema),
  contacts: zod.array(neonMigrateContactsSchema),
})

export const neonMigrateSchemaWithTransform = neonMigrateSchema.transform(data => {
  const transformedAccounts: TUseNeonMigrateAccountsSchema[] = []

  data.accounts.forEach(({ label, address, key }) => {
    if (!address || !key || transformedAccounts.some(account => account.address === address || account.key === key))
      return

    const [blockchain] = BlockchainServiceHelper.bsAggregator.getBlockchainNameByAddress(address)

    if (!blockchain) return

    transformedAccounts.push({
      address,
      key,
      label: label || t('hooks:useBackupOrMigrate.defaultAccountLabel'),
      blockchain,
    })
  })

  const transformedContacts = data.contacts.map<TUseNeonMigrateContactsSchema>(contact => {
    const transformedAddresses: TUseNeonMigrateContactsSchema['addresses'] = []
    const blockchainServices = Object.values(BlockchainServiceHelper.bsAggregator.blockchainServicesByName)

    contact.addresses?.forEach(address => {
      for (const service of blockchainServices) {
        if (
          (hasNameService(service) && service.validateNameServiceDomainFormat(address)) ||
          service.validateAddress(address)
        ) {
          transformedAddresses.push({ address, blockchain: service.name })
          return
        }
      }
    })

    return { name: contact.name ?? t('hooks:useBackupOrMigrate.defaultContactName'), addresses: transformedAddresses }
  })

  return {
    accounts: transformedAccounts,
    contacts: transformedContacts,
  }
})
