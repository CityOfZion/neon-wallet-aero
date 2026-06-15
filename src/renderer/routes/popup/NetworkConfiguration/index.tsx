import { useTranslation } from 'react-i18next'

import { Accordion } from '@renderer/components/Accordion'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'

import { SettingsLayout } from '@renderer/layouts/SettingsLayout'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'

import { NetworkConfigurationBlockchainAccordion } from './NetworkConfigurationBlockchainAccordion'

export const NetworkConfigurationPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'networkConfiguration' })

  return (
    <SettingsLayout title={t('title')}>
      <p className="mb-7 text-sm">{t('connectedNetworksLabel')}</p>

      <Accordion.Root type="multiple" defaultValue={['neo3']} className="pb-8">
        {BlockchainServiceHelper.blockchainNames.map(blockchain => (
          <NetworkConfigurationBlockchainAccordion
            key={`blockchain-network-${blockchain}`}
            blockchain={blockchain as TBlockchainServiceKey}
          />
        ))}
      </Accordion.Root>
    </SettingsLayout>
  )
}

export default NetworkConfigurationPage
