import { useEffect } from 'react'

import { hasLedger } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { HardwareWalletHelper } from '@renderer/helpers/HardwareWalletHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { useHardwareAccountsSelector } from '@renderer/hooks/useAccountSelector'
import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'
import { useBlockchainActions } from '@renderer/hooks/useBlockchainActions'
import { useLogin } from '@renderer/hooks/useLogin'
import { useMountUnsafe } from '@renderer/hooks/useMount'

const HardwareWalletManagerSetup = () => {
  const { loginSessionRef } = useLoginSessionSelector()
  const { editAccount } = useBlockchainActions()
  const { t } = useTranslation('pages', { keyPrefix: 'private.hardwareWalletManagerSetup' })
  const { logout } = useLogin()

  const { hardwareAccountsRef } = useHardwareAccountsSelector()

  useMountUnsafe(() => {
    const handleDisconnect = async () => {
      if (loginSessionRef.current?.type !== 'password') {
        await logout()
        return
      }

      hardwareAccountsRef.current.forEach(account => {
        editAccount({
          account,
          data: {
            type: 'watch',
          },
        })
      })
    }

    HardwareWalletHelper.onDisconnect = handleDisconnect

    return () => {
      HardwareWalletHelper.onDisconnect = undefined
    }
  })

  useEffect(() => {
    Object.values(BlockchainServiceHelper.bsAggregator.blockchainServicesByName).forEach(service => {
      if (!hasLedger(service)) return

      service.ledgerService.emitter.on('getSignatureStart', () => {
        ToastHelper.loading({ message: t('requestingPermission'), id: 'hardware-signature' })
      })

      service.ledgerService.emitter.on('getSignatureEnd', () => {
        ToastHelper.dismiss('hardware-signature')
      })
    })

    return () => {
      Object.values(BlockchainServiceHelper.bsAggregator.blockchainServicesByName).forEach(service => {
        if (!hasLedger(service)) return

        service.ledgerService.emitter.removeAllListeners('getSignatureStart')
        service.ledgerService.emitter.removeAllListeners('getSignatureEnd')
      })
    }
  }, [t])

  return null
}

export default HardwareWalletManagerSetup
