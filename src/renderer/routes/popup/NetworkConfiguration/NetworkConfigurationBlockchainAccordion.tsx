import { useTranslation } from 'react-i18next'

import { Accordion } from '@renderer/components/Accordion'
import { BlockchainIcon } from '@renderer/components/BlockchainIcon'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'

import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { useSelectedNetworkSelector } from '@renderer/hooks/useSettingsSelector'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'

import { NetworkConfigurationBlockchainButton } from './NetworkConfigurationBlockchainButton'

type TProps = {
  blockchain: TBlockchainServiceKey
}

export const NetworkConfigurationBlockchainAccordion = ({ blockchain }: TProps) => {
  const { t } = useTranslation('pages', { keyPrefix: 'networkConfiguration' })
  const { t: tCommonBlockchain } = useTranslation('common', { keyPrefix: 'blockchain' })
  const { modalNavigateWrapper } = useModalNavigate()
  const { network } = useSelectedNetworkSelector(blockchain)

  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]

  return (
    <Accordion.Item value={blockchain}>
      <Accordion.Trigger>
        <div className="flex items-center gap-2.5">
          <div className="flex size-4 items-center justify-center">
            <BlockchainIcon blockchain={blockchain} className="text-blue" />
          </div>
          <span className="text-sm text-white">{tCommonBlockchain(blockchain)}</span>
        </div>
      </Accordion.Trigger>

      <Accordion.Content className="pb-2">
        <NetworkConfigurationBlockchainButton
          label={t('currentNetwork')}
          subLabel={network.name}
          onClick={modalNavigateWrapper('network-selection', {
            state: {
              blockchain,
            },
          })}
        />

        <NetworkConfigurationBlockchainButton
          className="border-none"
          label={t('nodeSelection')}
          subLabel={network.url}
          disabled={service.rpcNetworkUrls.length <= 1}
          onClick={modalNavigateWrapper('network-node-selection', {
            state: {
              blockchain,
            },
          })}
        />
      </Accordion.Content>
    </Accordion.Item>
  )
}
