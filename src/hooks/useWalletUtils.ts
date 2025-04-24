import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { EncryptionHelper } from '@/helpers/EncryptionHelper'
import { useLoginSessionSelector } from '@/hooks/useAuthSelector'
import { useWalletsSelector } from '@/hooks/useWalletSelector'

export const useWalletUtils = () => {
  const { t } = useTranslation('hooks', { keyPrefix: 'useWalletUtils' })
  const { walletsRef } = useWalletsSelector()
  const { loginSessionRef } = useLoginSessionSelector()

  const doesMnemonicExist = useCallback(
    async (mnemonic: string) => {
      if (!loginSessionRef.current) throw new Error(t('beLoggedInError'))

      for (const wallet of walletsRef.current) {
        if (!wallet.encryptedMnemonic) continue

        const walletMnemonic = await EncryptionHelper.decrypt(
          wallet.encryptedMnemonic,
          loginSessionRef.current.encryptedPassword
        )

        if (walletMnemonic === mnemonic) return true
      }

      return false
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [walletsRef, loginSessionRef]
  )

  return { doesMnemonicExist }
}
