import { useState } from 'react'

import { hasWalletConnect } from '@cityofzion/blockchain-service'
import { WalletKitHelper } from '@cityofzion/bs-multichain'
import { useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'
import { Radio } from '@renderer/components/Radio'
import { Separator } from '@renderer/components/Separator'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { useAppDispatch } from '@renderer/hooks/useRedux'
import { useSelectedNetworkSelector } from '@renderer/hooks/useSettingsSelector'
import { invalidateWalletConnectSessions } from '@renderer/hooks/useWalletConnectSessions'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import TbCheck from '@renderer/assets/images/tb-check.svg?react'

import { settingsReducerActions } from '@renderer/store/reducers/settings'
import { rendererApi } from '@shared/message-api/renderer'
import type { TNetwork } from '@shared/types/blockchain'
import type { TModalState } from '@shared/types/modal'

export const NetworkSelectionModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'networkSelection' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'general' })
  const dispatch = useAppDispatch()
  const { blockchain } = useModalState<TModalState<'network-selection'>>()
  const { network } = useSelectedNetworkSelector(blockchain)
  const { modalNavigate, modalNavigateWrapper } = useModalNavigate()

  const [selectedNetwork, setSelectedNetwork] = useState<TNetwork>(network)

  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]

  const onSelectRadioItem = (selectedValue: string) => {
    const network = service.availableNetworks.find(network => network.id === selectedValue)
    if (!network) return

    setSelectedNetwork(network)
  }

  const handleSave = async () => {
    if (hasWalletConnect(service)) {
      const sessions = await rendererApi.send('wallet-connect:get-sessions')
      const filteredSessions = WalletKitHelper.filterSessions(Object.values(sessions), {
        chains: [service.walletConnectService.chain],
      })

      Promise.allSettled(
        filteredSessions.map(session =>
          rendererApi.send('wallet-connect:disconnect', {
            topic: session.topic,
            reason: WalletKitHelper.getError('USER_DISCONNECTED'),
          })
        )
      ).then(() => invalidateWalletConnectSessions())
    }

    dispatch(settingsReducerActions.setSelectedNetwork({ blockchain, network: selectedNetwork }))
    modalNavigate(-1)
  }

  return (
    <BottomModalLayout heading={t('title')}>
      <div className="min-h-0 flex-grow overflow-auto">
        <p className="mb-5 block px-4 text-sm text-gray-300">{t('selectNetwork')}</p>

        <Radio.Group value={selectedNetwork.id} onValueChange={onSelectRadioItem}>
          {service.availableNetworks.map((network, index, array) => (
            <Radio.Item key={network.id} value={network.id} withSeparator={index !== array.length - 1}>
              <div className="flex items-center gap-4 text-sm">
                <div
                  className={StyleHelper.mergeStyles('min-size-1.5 size-1.5 rounded-full', {
                    'bg-purple': network.type === 'testnet',
                    'bg-neon': network.type === 'mainnet',
                  })}
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
            label={tCommon('cancel')}
            variant="card"
            colorSchema="gray"
          />

          <Button
            className="w-full"
            label={tCommon('save')}
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

export default NetworkSelectionModal
