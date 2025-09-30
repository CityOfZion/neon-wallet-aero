import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@renderer/components/Button'
import { Checkbox } from '@renderer/components/Checkbox'
import { Loader } from '@renderer/components/Loader'
import { Radio } from '@renderer/components/Radio'
import { Separator } from '@renderer/components/Separator'
import { StyleHelper } from '@renderer/helpers/StyleHelper'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { useNetworkActions } from '@renderer/hooks/useNetworkActions'
import { useNodes } from '@renderer/hooks/useNodes'
import { useSelectedNetworkSelector } from '@renderer/hooks/useSettingsSelector'
import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'
import { TModalState } from '@shared/types/modal'
import { match, P } from 'ts-pattern'

import TbCheck from '@renderer/assets/images/tb-check.svg?react'
import TbRefresh from '@renderer/assets/images/tb-refresh.svg?react'

export const NetworkNodeSelectionModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'networkNodeSelection' })
  const { t: commonT } = useTranslation('common', { keyPrefix: 'general' })
  const { blockchain } = useModalState<TModalState<'network-node-selection'>>()
  const { modalNavigate, modalNavigateWrapper } = useModalNavigate()
  const { network } = useSelectedNetworkSelector(blockchain)
  const { setNetworkNode } = useNetworkActions()
  const nodesQuery = useNodes(blockchain)

  const [selectedUrl, setSelectedUrl] = useState(network.url)
  const [isAutomatic, setIsAutomatic] = useState(network.isAutomatic ?? false)

  const handleIsAutomaticChange = (value: boolean) => {
    const firstNode = nodesQuery.data?.nodes.find(node => node.height !== undefined && node.latency !== undefined)
    if (firstNode) setSelectedUrl(firstNode.url)

    setIsAutomatic(value)
  }

  const handleSave = async () => {
    modalNavigate(-1)
    setNetworkNode(blockchain, selectedUrl, isAutomatic)
  }

  const handleSelectRadioItem = (selectedValue: string) => {
    setIsAutomatic(false)
    setSelectedUrl(selectedValue)
  }

  return (
    <BottomModalLayout heading={t('title')}>
      <div className="flex h-full flex-col text-sm">
        <div className="mb-4 flex flex-shrink-0 flex-col gap-y-4">
          <p>{t('description')}</p>
          <p className="text-xs font-bold text-gray-100 uppercase">{t('listLabel')}</p>
        </div>

        <div className="bg-asphalt mb-2 flex flex-shrink-0 justify-between px-4 py-4">
          <Button
            label={t('refreshButtonLabel')}
            leftIcon={<TbRefresh aria-hidden={true} className="text-neon" />}
            variant="text-slim"
            flat
            colorSchema="white"
            clickableProps={{ className: 'text-sm' }}
            onClick={() => nodesQuery.refetch()}
          />

          <div className="flex gap-2.5">
            <label className="font-medium" htmlFor="isAutomatic">
              {t('selectAutomaticallyLabel')}
            </label>
            <Checkbox
              id="isAutomatic"
              checked={isAutomatic}
              onCheckedChange={handleIsAutomaticChange}
              disabled={nodesQuery.isLoading}
            />
          </div>
        </div>

        <div className="min-h-0 flex-grow overflow-auto">
          {nodesQuery.isLoading ? (
            <Loader className="mt-4" />
          ) : (
            <Radio.Group value={selectedUrl} onValueChange={handleSelectRadioItem}>
              {nodesQuery.data?.nodes.map((node, index, array) => (
                <Radio.Item key={node.url} value={node.url} className="h-15" withSeparator={index !== array.length - 1}>
                  <div className="flex min-w-0 flex-grow items-center gap-4">
                    <div className="flex flex-col items-center justify-center gap-0.5">
                      <div className="flex h-4 w-4 items-center justify-center">
                        <div
                          className={StyleHelper.mergeStyles(
                            'h-1.5 min-h-1.5 w-1.5 min-w-1.5 rounded-full',
                            match(node.latency)
                              .with(undefined, () => 'bg-gray-300')
                              .with(
                                P.when(value => value < 400),
                                () => 'bg-green'
                              )
                              .with(
                                P.when(value => value < 800),
                                () => 'bg-orange'
                              )
                              .otherwise(() => 'bg-pink')
                          )}
                        />
                      </div>

                      <p className="min-w-12 text-gray-300">
                        {typeof node.latency === 'number' ? t('latency', { latency: node.latency }) : '--'}
                      </p>
                    </div>

                    <div className="flex-start flex min-w-0 flex-grow flex-col gap-0.5">
                      <p className="block w-full truncate text-left">{node.url}</p>

                      <p className="text-left text-gray-300">{t('blockHeight', { height: node.height ?? '--' })}</p>
                    </div>
                  </div>

                  <Radio.Indicator />
                </Radio.Item>
              ))}
            </Radio.Group>
          )}
        </div>

        <div className="flex flex-shrink-0 flex-col gap-y-5">
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
              disabled={!selectedUrl}
              onClick={handleSave}
              variant="card"
              leftIcon={<TbCheck aria-hidden />}
              iconsOnEdge={false}
            />
          </div>
        </div>
      </div>
    </BottomModalLayout>
  )
}
