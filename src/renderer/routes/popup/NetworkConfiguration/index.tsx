import type { TBSServiceName } from '@cityofzion/bs-multichain'
import { useTranslation } from 'react-i18next'

import { Accordion } from '@renderer/components/Accordion'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'

import { SettingsLayout } from '@renderer/layouts/SettingsLayout'

import { NetworkConfigurationBlockchainAccordion } from './NetworkConfigurationBlockchainAccordion'

export const NetworkConfigurationPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'networkConfiguration' })

  return (
    <SettingsLayout title={t('title')}>
      <Accordion.Root type="multiple" defaultValue={['neo3']} className="pb-8">
        {BlockchainServiceHelper.blockchainNames.map(blockchain => (
          <NetworkConfigurationBlockchainAccordion
            key={`blockchain-network-${blockchain}`}
            blockchain={blockchain as TBSServiceName}
          />
        ))}
      </Accordion.Root>
    </SettingsLayout>
  )
}

export default NetworkConfigurationPage
