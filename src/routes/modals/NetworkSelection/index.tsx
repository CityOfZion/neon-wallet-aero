import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/Button'
import { Radio } from '@/components/Radio'
import { Separator } from '@/components/Separator'
import { NETWORK_OPTIONS_BY_BLOCKCHAIN } from '@/constants/networks'
import { NetworkHelper } from '@/helpers/NetworkHelper'
import { useModalNavigate, useModalState } from '@/hooks/useModalRouter'
import { useNetworkActions } from '@/hooks/useNetworkActions'
import { useSelectedNetworkSelector } from '@/hooks/useSettingsSelector'
import { BottomModalLayout } from '@/layouts/BottomModalLayout'
import { TBlockchainServiceKey, TNetwork } from '@/types/blockchain'
import { TModalState } from '@/types/modal'

import TbCheck from '@/assets/images/tb-check.svg?react'

export const NetworkSelectionModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'networkSelection' })
  const { t: commonT } = useTranslation('common', { keyPrefix: 'general' })
  const { blockchain } = useModalState<TModalState<'network-selection'>>()
  const { network } = useSelectedNetworkSelector(blockchain)
  const { modalNavigate, modalNavigateWrapper } = useModalNavigate()
  const { setNetwork } = useNetworkActions()

  const [selectedNetwork, setSelectedNetwork] = useState<TNetwork<TBlockchainServiceKey>>(network)

  const options = NETWORK_OPTIONS_BY_BLOCKCHAIN[blockchain].all

  const onSelectRadioItem = (selectedValue: string) => {
    const network = options.find(network => network.id === selectedValue)
    if (!network) return

    setSelectedNetwork(network)
  }

  const handleSave = () => {
    modalNavigate(-1)
    setNetwork(blockchain, selectedNetwork)
  }

  return (
    <BottomModalLayout heading={t('title')}>
      <div className="min-h-0 flex-grow overflow-auto">
        <p className="mb-5 block px-4 text-sm text-gray-300">{t('selectNetwork')}</p>

        <Radio.Group value={selectedNetwork.id} onValueChange={onSelectRadioItem}>
          {options.map((network, index, array) => (
            <Radio.Item key={network.id} value={network.id} withSeparator={index !== array.length - 1}>
              <div className="flex items-center gap-4">
                <div
                  className={`h-1.5 min-h-1.5 w-1.5 min-w-1.5 rounded-full ${NetworkHelper.getBackgroundColorByNetwork(network, blockchain)}`}
                />
                <label>{network.name}</label>
              </div>

              <Radio.Indicator />
            </Radio.Item>
          ))}
        </Radio.Group>
      </div>

      <div className="flex flex-col gap-y-5">
        <Separator />

        <div className="flex gap-x-3">
          <Button
            className="w-30"
            onClick={modalNavigateWrapper(-1)}
            label={commonT('cancel')}
            variant="card"
            colorSchema="gray"
          />

          <Button
            className="w-full"
            label={commonT('save')}
            onClick={handleSave}
            variant="card"
            leftIcon={<TbCheck aria-hidden />}
            iconsOnEdge={false}
          />
        </div>
      </div>
    </BottomModalLayout>
  )
}
