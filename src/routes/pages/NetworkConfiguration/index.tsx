import { useTranslation } from 'react-i18next'

import { Accordion } from '@/components/Accordion'
import { SettingsLayout } from '@/layouts/Settings'
import { blockchainNames } from '@/libs/blockchainService'
import { TBlockchainServiceKey } from '@/types/blockchain'

import { NetworkConfigurationBlockchainAccordion } from './NetworkConfigurationBlockchainAccordion'

export const NetworkConfigurationPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'networkConfiguration' })

  return (
    <SettingsLayout title={t('title')}>
      <p className="mb-7 text-sm">{t('connectedNeoAndEthLabel')}</p>
      <Accordion.Root type="multiple" defaultValue={['neo3']}>
        {blockchainNames.map(blockchain => (
          <NetworkConfigurationBlockchainAccordion
            key={`blockchain-network-${blockchain}`}
            blockchain={blockchain as TBlockchainServiceKey}
          />
        ))}
      </Accordion.Root>
    </SettingsLayout>
  )
}
