import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'
import type zod from 'zod'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { EncryptionHelper } from '@renderer/helpers/EncryptionHelper'
import { AppError } from '@renderer/helpers/ErrorHelper'
import { FileHelper } from '@renderer/helpers/FileHelper'
import { NeonBackupHelper } from '@renderer/helpers/NeonBackupHelper'

import { utilityReducerActions } from '@renderer/store/reducers/utility'
import { neonBackupContentSchema, neonBackupDataSchema } from '@shared/schemas/neon-backup'
import type { TAccountsToImport, TCreateWalletAndAccountParam } from '@shared/types/blockchain'
import type {
  TUseNeonBackupAccount,
  TUseNeonBackupData,
  TUseNeonBackupDataSchema,
  TUseNeonBackupGeneratedData,
} from '@shared/types/hooks'
import type { TContact, TContactAddress, TSwapRecord } from '@shared/types/store'

import { useAccountsSelector } from './useAccountSelector'
import { useAccountUtils } from './useAccountUtils'
import { useLoginSessionSelector } from './useAuthSelector'
import { useBlockchainActions } from './useBlockchainActions'
import { useContactsSelector } from './useContactSelector'
import { useAppDispatch } from './useRedux'
import { useWalletsSelector } from './useWalletSelector'

export const useNeonImportBackup = () => {
  const { t } = useTranslation('hooks', { keyPrefix: 'useNeonImportBackup' })
  const dispatch = useAppDispatch()
  const { createWallet, importAccounts, saveContacts } = useBlockchainActions()
  const { doesAccountExist } = useAccountUtils()

  const validateAndParseFile = async (
    filePath: string,
    fileContent: string
  ): Promise<TUseNeonBackupData | undefined> => {
    try {
      if (filePath.endsWith(NeonBackupHelper.fileExtension)) {
        const backupFile = JSON.parse(fileContent)
        const validatedFile = await neonBackupContentSchema.parseAsync(backupFile)

        if (validatedFile.version !== NeonBackupHelper.backupVersion) {
          return undefined
        }

        return { type: 'backup', content: validatedFile }
      }
    } catch {
      /* empty */
    }

    return undefined
  }

  const handleTryDecryptData = async (
    data: TUseNeonBackupData,
    password: string
  ): Promise<TUseNeonBackupDataSchema> => {
    try {
      const decrypted = EncryptionHelper.decryptBackupOrMigrate(data.content.data, password)
      const parsedData = JSON.parse(decrypted)

      return await neonBackupDataSchema.parseAsync(parsedData)
    } catch (error) {
      throw new AppError(t('errors.wrongPassword'), error)
    }
  }

  const handleGenerateData = (data: zod.infer<typeof neonBackupDataSchema>): TUseNeonBackupGeneratedData => {
    const contactsToCreate: TContact[] = []
    const swapRecordsToCreate: TSwapRecord[] = []
    const walletsToCreate: TCreateWalletAndAccountParam[] = []

    data.swapRecords?.forEach(swap => {
      const account = NeonBackupHelper.fixAccountProperties(swap.account)
      if (!account) return

      swapRecordsToCreate.push({
        addressTo: swap.addressTo,
        extraIdTo: swap.extraIdTo,
        amountFrom: swap.amountFrom,
        amountTo: swap.amountTo,
        fee: swap.fee,
        swapId: swap.swapId,
        swapProvider: swap.swapProvider,
        tokenFrom: swap.tokenFrom,
        tokenTo: swap.tokenTo,
        txFrom: swap.txFrom,
        swapStatus: swap.swapStatus,
        txTo: swap.txTo,
        account,
      })
    })

    data.contacts.forEach(contact => {
      const addresses: TContactAddress[] = []

      contact.addresses.forEach(address => {
        if (!BlockchainServiceHelper.doesBlockchainSupported(address.blockchain)) return
        addresses.push({ address: address.address, blockchain: address.blockchain })
      })

      contactsToCreate.push({
        id: contact.id,
        name: contact.name,
        addresses,
      })
    })

    data.wallets.map(backupWallet => {
      const accountsToImport: TAccountsToImport = []

      backupWallet.accounts.forEach(backupAccount => {
        const fixedAccount = NeonBackupHelper.fixAccountProperties(backupAccount)
        if (!fixedAccount || doesAccountExist(fixedAccount)) return

        accountsToImport.push({ ...fixedAccount, key: backupAccount.key })
      })

      if (accountsToImport.length === 0) return

      const fixedWallet = NeonBackupHelper.fixWalletProperties(backupWallet)

      walletsToCreate.push({
        ...fixedWallet,
        backupStatus: 'successful',
        mnemonic: backupWallet.mnemonic,
        accounts: accountsToImport,
      })
    })

    return {
      wallets: walletsToCreate,
      contacts: contactsToCreate,
      swapRecords: swapRecordsToCreate,
    }
  }

  const handleImportBackupData = async (generatedData: TUseNeonBackupGeneratedData) => {
    try {
      generatedData.swapRecords?.forEach(swap => {
        dispatch(utilityReducerActions.persistSwapRecord(swap))
      })

      if (generatedData.contacts) await saveContacts(generatedData.contacts)

      const promises = generatedData.wallets.map(async walletData => {
        const newWallet = await createWallet(walletData)
        await importAccounts({ wallet: newWallet, accounts: walletData.accounts })
      })

      await Promise.allSettled(promises)
    } catch (error) {
      throw new AppError(t('errors.importData'), error)
    }
  }
  return {
    validateAndParseFile,
    handleImportBackupData,
    handleTryDecryptData,
    handleGenerateData,
  }
}

export const useNeonCreateBackup = () => {
  const { t } = useTranslation('hooks', { keyPrefix: 'useNeonBackup' })
  const { t: tCommon } = useTranslation('common')
  const { loginSessionRef } = useLoginSessionSelector()
  const { wallets } = useWalletsSelector()
  const { accounts } = useAccountsSelector()
  const { contacts } = useContactsSelector()
  const { editWallet } = useBlockchainActions()

  const handleCreateBackupFormat = async () => {
    if (!loginSessionRef.current) {
      throw new AppError(tCommon('errors.noLoginSession'))
    }

    const encryptedPassword = loginSessionRef.current.encryptedPassword

    const backupFile: zod.infer<typeof neonBackupDataSchema> = {
      wallets: [],
      contacts: [],
    }

    backupFile.contacts = contacts.map(contact => ({
      id: contact.id,
      name: contact.name,
      addresses: contact.addresses.map(address => ({ address: address.address, blockchain: address.blockchain })),
    }))

    const backupAccountsByWalletId = new Map<string, TUseNeonBackupAccount[]>()

    const accountPromises = accounts.map(async account => {
      let key: string | undefined

      if (account.encryptedKey) {
        key = await EncryptionHelper.decrypt(account.encryptedKey, encryptedPassword)
      }

      const backupAccount: TUseNeonBackupAccount = {
        id: account.id,
        idWallet: account.idWallet,
        address: account.address,
        blockchain: account.blockchain,
        name: account.name,
        order: account.order,
        type: account.type,
        key: key || undefined,
        skin: { type: 'color', id: 'green' },
      }

      const walletAccounts = backupAccountsByWalletId.get(backupAccount.idWallet) || []
      backupAccountsByWalletId.set(backupAccount.idWallet, [...walletAccounts, backupAccount])
    })

    await Promise.all(accountPromises)

    const promises = wallets.map(async wallet => {
      let mnemonic: string | undefined

      if (wallet.encryptedMnemonic) {
        mnemonic = await EncryptionHelper.decrypt(wallet.encryptedMnemonic, encryptedPassword)
      }

      const walletAccounts = backupAccountsByWalletId.get(wallet.id) || []

      backupFile.wallets.push({
        id: wallet.id,
        name: wallet.name,
        type: wallet.type,
        mnemonic: mnemonic || undefined,
        accounts: walletAccounts,
      })
    })

    await Promise.all(promises)

    return backupFile
  }

  const handleCreateBackup = async (password: string) => {
    try {
      const backupFileData = await handleCreateBackupFormat()
      const backupFileDataString = JSON.stringify(backupFileData)

      const backupFileDataStringEncrypted = EncryptionHelper.encryptBackupOrMigrate(backupFileDataString, password)

      const backupFile: zod.infer<typeof neonBackupContentSchema> = {
        version: NeonBackupHelper.backupVersion,
        data: backupFileDataStringEncrypted,
      }

      backupFileData.wallets.forEach(({ id }) => {
        const wallet = wallets.find(wallet => wallet.id === id)

        if (wallet) {
          editWallet({ wallet, data: { backupStatus: 'successful' } })
        }
      })

      const fileName = `NEON-backup-${format(new Date(), 'yyyy-MM-dd')}.${NeonBackupHelper.fileExtension}`

      FileHelper.download(JSON.stringify(backupFile), { type: 'application/json' }, fileName)
    } catch (error) {
      throw new AppError(t('errors.backupError'), error)
    }
  }

  return {
    handleCreateBackup,
  }
}
