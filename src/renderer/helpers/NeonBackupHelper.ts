import type { TUseNeonBackupAccount, TUseNeonBackupWallet } from '@shared/types/hooks'
import type { IAccountState, IWalletState, TAccountType } from '@shared/types/store'

import { BlockchainServiceHelper } from './BlockchainServiceHelper'

export class NeonBackupHelper {
  static readonly fileExtension = 'neonbkp.json'
  static readonly deprecatedFileExtension = 'neonbkp'
  static readonly backupVersion = 1

  static fixAccountProperties = (
    backupAccount: TUseNeonBackupAccount
  ): Omit<IAccountState, 'encryptedKey'> | undefined => {
    if (!BlockchainServiceHelper.doesBlockchainSupported(backupAccount.blockchain)) return

    const type: TAccountType =
      backupAccount.type === 'ledger' || backupAccount.type === 'hardware' ? 'watch' : backupAccount.type

    return {
      address: backupAccount.address,
      blockchain: backupAccount.blockchain,
      id: backupAccount.id,
      idWallet: backupAccount.idWallet,
      name: backupAccount.name,
      order: backupAccount.order,
      type,
    }
  }

  static fixWalletProperties = (
    backupWallet: TUseNeonBackupWallet
  ): Omit<IWalletState, 'accounts' | 'encryptedMnemonic' | 'backupStatus'> => {
    const type = backupWallet.type === 'ledger' ? 'hardware' : backupWallet.type

    return {
      id: backupWallet.id,
      name: backupWallet.name,
      type,
    }
  }
}
