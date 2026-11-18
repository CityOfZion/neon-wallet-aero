import { Fragment } from 'react'

import type { TSwapResult } from '@cityofzion/bs-multichain'
import { useTranslation } from 'react-i18next'
import { match, P } from 'ts-pattern'

import { Accordion } from '@renderer/components/Accordion'
import { BlockchainIcon } from '@renderer/components/BlockchainIcon'
import { Button } from '@renderer/components/Button'
import { Details } from '@renderer/components/Details'
import { Separator } from '@renderer/components/Separator'
import { Stepper } from '@renderer/components/Stepper'
import { Tooltip } from '@renderer/components/Tooltip'

import { useContactByAddressSelector } from '@renderer/hooks/useContactSelector'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { PENDING_SWAP_STATUSES } from '@renderer/hooks/useSwapOrder'

import MdRefresh from '@renderer/assets/images/md-refresh.svg?react'
import TbCircleX from '@renderer/assets/images/tb-circle-x.svg?react'
import TbExternalLink from '@renderer/assets/images/tb-external-link.svg?react'
import TbMessage from '@renderer/assets/images/tb-message.svg?react'
import TbReceipt from '@renderer/assets/images/tb-receipt.svg?react'
import TbRosetteDiscountCheck from '@renderer/assets/images/tb-rosette-discount-check.svg?react'
import TbUsers from '@renderer/assets/images/tb-users.svg?react'

import { rendererApi } from '@shared/message-api/renderer'

const STEPS_BY_STATUS: Record<TSwapResult['status'], number> = {
  confirming: 2,
  exchanging: 3,
  finished: 4,
  failed: 2,
  refunded: 2,
}

type TProps = {
  orderId: string
  swapResult: TSwapResult
}

export const SwapDetailsModalContent = ({ orderId, swapResult }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'swapDetails' })
  const { t: tCommonBlockchain } = useTranslation('common', { keyPrefix: 'blockchain' })
  const { modalNavigateWrapper, modalNavigate } = useModalNavigate()

  const { contact } = useContactByAddressSelector(
    swapResult.tokenTo.blockchain
      ? { address: swapResult.addressTo, blockchain: swapResult.tokenTo.blockchain }
      : undefined
  )

  const handleGoToSwapLog = () => {
    modalNavigate('swap-details-log', { state: { orderId } })
  }

  return (
    <div className="flex w-full grow flex-col items-center">
      <div className="max-size-24 min-size-24 mb-2 flex size-24 items-center justify-center">
        {swapResult.status === 'failed' || swapResult.status === 'refunded' ? (
          <TbCircleX aria-hidden className="text-pink min-size-20 max-size-20 size-20 stroke-1" />
        ) : (
          <TbRosetteDiscountCheck aria-hidden className="text-blue min-size-20 max-size-20 size-20 stroke-1" />
        )}
      </div>

      <Accordion.Root type="multiple" className="mb-6 w-full" defaultChecked>
        <Accordion.Item value="details">
          <Details.Root className="py-4">
            <Details.Header leftElement={<TbReceipt aria-hidden className="min-size-4 max-size-4 size-4" />}>
              {t('detailsHeaderLabel')}
            </Details.Header>

            <Details.Body>
              <Stepper
                className="mt-4 mb-10 px-14"
                steps={t('statusPanelSteps', { returnObjects: true })}
                currentStep={STEPS_BY_STATUS[swapResult.status]}
                currentState={
                  ['failed', 'refunded'].includes(swapResult.status) ||
                  (!PENDING_SWAP_STATUSES.includes(swapResult.status) && !swapResult.txIdFrom)
                    ? 'error'
                    : 'success'
                }
                theme="neon"
              />

              <Accordion.Trigger className="flex items-center justify-between border-none bg-gray-300/15 px-3.5 py-0.5 text-xs">
                <p className="text-neon">{t('routingPanelLabel')}</p>
              </Accordion.Trigger>
            </Details.Body>
          </Details.Root>

          <Accordion.Content asChild>
            <Details.Root className="mt-2 pt-4 pb-0">
              <Details.Body>
                <Details.Panel label={t('routingPanelTransactionFromLabel')}>
                  {swapResult.txIdFrom && swapResult.tokenFrom.blockchain && (
                    <Fragment>
                      <Details.Item label={t('sentPanelTokenLabel')} contentClassName="flex w-full justify-between">
                        <div className="flex items-center gap-2.5 text-sm">
                          <BlockchainIcon blockchain={swapResult.tokenFrom.blockchain} />

                          <div className="shrink uppercase">
                            <span className="whitespace-nowrap text-white">{swapResult.tokenFrom.symbol}</span>
                            <span className="whitespace-nowrap text-gray-300">
                              {` | ${tCommonBlockchain(swapResult.tokenFrom.blockchain)}`}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm">{swapResult.amountFrom}</p>
                      </Details.Item>

                      <Separator />
                    </Fragment>
                  )}

                  <Details.Item label={t('sentPanelAddressLabel')}>
                    <p className="text-sm break-all">{swapResult.addressFrom}</p>
                  </Details.Item>

                  {swapResult.txIdFrom &&
                    (swapResult.txIdTo ||
                      (swapResult.status !== 'refunded' && swapResult.status !== 'failed' && !swapResult.txIdTo)) && (
                      <Details.Panel label={t('routingPanelTransactionToLabel')}>
                        <Details.Item label={t('receivePanelTokenLabel')}>
                          {match({ txTo: swapResult.txIdTo })
                            .with({ txTo: P.string }, () => (
                              <div className="flex w-full items-center justify-between gap-2.5 text-sm">
                                {swapResult.tokenTo.blockchain && (
                                  <div className="flex items-center gap-2.5 text-sm">
                                    <BlockchainIcon blockchain={swapResult.tokenTo.blockchain} />

                                    <div className="shrink uppercase">
                                      <span className="whitespace-nowrap text-white">{swapResult.tokenTo.symbol}</span>
                                      <span className="whitespace-nowrap text-gray-300">
                                        {` | ${tCommonBlockchain(swapResult.tokenTo.blockchain)}`}
                                      </span>
                                    </div>
                                  </div>
                                )}

                                <p className="text-sm">{swapResult.amountTo}</p>
                              </div>
                            ))
                            .otherwise(() => (
                              <div className="text-orange flex items-center gap-1.5">
                                <span className="text-sm">{t('routingPanelTransactionToPendingLabel')}</span>

                                <MdRefresh aria-hidden className="size-6 animate-spin" />
                              </div>
                            ))}
                        </Details.Item>

                        <Separator />

                        <Details.Item
                          label={t('receivePanelAddressLabel')}
                          contentClassName="flex flex-col items-start"
                        >
                          <p className="text-sm break-all">{swapResult.addressTo}</p>

                          {swapResult.tokenTo.blockchain && (
                            <Tooltip title={contact ? t('contactSavedTooltipLabel', { name: contact.name }) : ''}>
                              <Button
                                leftIcon={<TbUsers aria-hidden />}
                                variant="text"
                                disabled={!!contact}
                                label={t('saveContactButtonLabel')}
                                onClick={modalNavigateWrapper('save-contact', {
                                  state: {
                                    addresses: [
                                      { address: swapResult.addressTo, blockchain: swapResult.tokenTo.blockchain },
                                    ],
                                  },
                                })}
                              />
                            </Tooltip>
                          )}
                        </Details.Item>

                        {swapResult.extraIdTo && (
                          <Details.Item label={t('extraIdToLabel')}>
                            <p className="text-sm break-all">{swapResult.extraIdTo}</p>
                          </Details.Item>
                        )}
                      </Details.Panel>
                    )}
                </Details.Panel>
              </Details.Body>
            </Details.Root>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>

      <div className="mt-auto flex w-full items-center gap-3">
        <Button
          label={t('swapLogButtonLabel')}
          className="w-40"
          variant="card"
          iconsOnEdge={false}
          onClick={handleGoToSwapLog}
          rightIcon={<TbExternalLink aria-hidden />}
        />

        <Button
          label={t('helpButtonLabel')}
          className="grow"
          variant="card"
          iconsOnEdge={false}
          rightIcon={<TbMessage aria-hidden />}
          onClick={() => rendererApi.send('tab:open', { href: '/live-support' })}
        />
      </div>
    </div>
  )
}
