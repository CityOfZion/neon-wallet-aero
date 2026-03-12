import { useEffect } from 'react'

import { hasLedger } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'

const HardwareWalletManagerSetup = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'private.hardwareWalletManagerSetup' })

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
