import { Fragment, useEffect, useRef, useState } from 'react'

import { SimpleSwapService } from '@cityofzion/bs-multichain'
import { useTranslation } from 'react-i18next'
import { match, P } from 'ts-pattern'

import { Accordion } from '@renderer/components/Accordion'
import { BlockchainIcon } from '@renderer/components/BlockchainIcon'
import { Button } from '@renderer/components/Button'
import { Details } from '@renderer/components/Details'
import { Link } from '@renderer/components/Link'
import { Separator } from '@renderer/components/Separator'
import type { TStepperCurrentState } from '@renderer/components/Stepper'
import { Stepper } from '@renderer/components/Stepper'
import { Tooltip } from '@renderer/components/Tooltip'

import { ConstantsHelper } from '@renderer/helpers/ConstantsHelper'

import { useContactByAddressSelector } from '@renderer/hooks/useContactSelector'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { useAppDispatch } from '@renderer/hooks/useRedux'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import MdRefresh from '@renderer/assets/images/md-refresh.svg?react'
import TbCircleX from '@renderer/assets/images/tb-circle-x.svg?react'
import TbExternalLink from '@renderer/assets/images/tb-external-link.svg?react'
import TbLifebuoy from '@renderer/assets/images/tb-lifebuoy.svg?react'
import TbReceipt from '@renderer/assets/images/tb-receipt.svg?react'
import TbRosetteDiscountCheck from '@renderer/assets/images/tb-rosette-discount-check.svg?react'
import TbUsers from '@renderer/assets/images/tb-users.svg?react'

import { utilityReducerActions } from '@renderer/store/reducers/utility'
import type { TModalState } from '@shared/types/modal'
import type { TSwapRecord } from '@shared/types/store'

const SWAP_SERVICE = new SimpleSwapService()

const STEPS_BY_STATUS: Record<TSwapRecord['swapStatus'], number> = {
  confirming: 2,
  exchanging: 3,
  finished: 4,
  failed: 2,
  refunded: 2,
}

export const SwapDetailsModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'swapDetails' })
  const { t: tCommonBlockchain } = useTranslation('common', { keyPrefix: 'blockchain' })
  const modalState = useModalState<TModalState<'swap-details'>>()
  const { modalNavigateWrapper, modalNavigate } = useModalNavigate()

  const [swapRecord, setSwapRecord] = useState<TSwapRecord>(modalState.swapRecord)

  const dispatch = useAppDispatch()

  const timeoutRef = useRef<NodeJS.Timeout>(undefined)

  const { contact } = useContactByAddressSelector(
    swapRecord && swapRecord.tokenTo?.blockchain
      ? { address: swapRecord.addressTo, blockchain: swapRecord.tokenTo.blockchain! }
      : undefined
  )

  const handleGoToSwapLog = () => {
    modalNavigate('swap-details-log', { state: { swapRecord: swapRecord! } })
  }

  useEffect(() => {
    const getStatus = async () => {
      if (!swapRecord) {
        clearTimeout(timeoutRef.current)
        modalNavigate(-1)
        return
      }

      if (!swapRecord.swapId || !['confirming', 'exchanging'].includes(swapRecord.swapStatus)) return

      try {
        const response = await SWAP_SERVICE.getStatus(swapRecord.swapId)
        const { status, log } = response
        let { txFrom, txTo } = response

        if (!txFrom) txFrom = swapRecord.txFrom
        if (!txTo) txTo = swapRecord.txTo

        const updatedSwapRecord: TSwapRecord = { ...swapRecord, txFrom, txTo, swapStatus: status, log }

        setSwapRecord(updatedSwapRecord)
        dispatch(utilityReducerActions.persistSwapRecord(updatedSwapRecord))

        if (status === 'finished') {
          clearTimeout(timeoutRef.current)
          return
        }
      } catch {
        // Empty block
      }

      timeoutRef.current = setTimeout(getStatus, 2000)
    }

    timeoutRef.current = setTimeout(getStatus, 100)

    return () => {
      clearTimeout(timeoutRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!swapRecord) return null

  return (
    <BottomModalLayout heading={t('title')}>
      <div className="flex w-full flex-col items-center">
        <div className="flex size-28 items-center p-2">
          {swapRecord.swapStatus === 'failed' || swapRecord.swapStatus === 'refunded' ? (
            <TbCircleX aria-hidden className="text-pink size-20 stroke-1" />
          ) : (
            <TbRosetteDiscountCheck aria-hidden className="text-blue size-20 stroke-1" />
          )}
        </div>

        <Accordion.Root type="multiple" className="w-full" defaultChecked>
          <Accordion.Item value="details">
            <Details.Root>
              <Details.Header leftElement={<TbReceipt aria-hidden className="min-size-4 size-4" />}>
                {t('detailsHeaderLabel')}
              </Details.Header>

              <Details.Body>
                <Stepper
                  className="mt-4 mb-10 px-14"
                  steps={t('statusPanelSteps', { returnObjects: true })}
                  currentStep={STEPS_BY_STATUS[swapRecord.swapStatus]}
                  currentState={match({ swapStatus: swapRecord.swapStatus, txFrom: swapRecord.txFrom })
                    .returnType<TStepperCurrentState>()
                    .with({ swapStatus: P.union('failed', 'refunded') }, () => 'error')
                    .with({ txFrom: P.nullish }, () => 'error')
                    .otherwise(() => 'success')}
                  theme="neon"
                />

                <Accordion.Trigger className="flex items-center justify-between border-none bg-gray-300/15 px-3.5 py-0.5 text-xs">
                  <p className="text-neon">{t('routingPanelLabel')}</p>
                </Accordion.Trigger>
              </Details.Body>
            </Details.Root>

            <Accordion.Content asChild>
              <Details.Root className="mt-5">
                <Details.Body>
                  <Details.Panel label={t('routingPanelTransactionFromLabel')}>
                    {swapRecord.txFrom && swapRecord.tokenFrom.blockchain && (
                      <Fragment>
                        <Details.Item label={t('sentPanelTokenLabel')} contentClassName="flex w-full justify-between">
                          <div className="flex items-center text-sm">
                            <BlockchainIcon blockchain={swapRecord.tokenFrom.blockchain} />

                            <span className="whitespace-nowrap text-gray-300">
                              {` | ${tCommonBlockchain(swapRecord.tokenFrom.blockchain)}`}
                            </span>
                          </div>

                          <p className="text-sm">{swapRecord.amountFrom}</p>
                        </Details.Item>

                        <Separator />
                      </Fragment>
                    )}

                    <Details.Item label={t('sentPanelAddressLabel')}>
                      <p className="text-sm break-all">{swapRecord.account.address}</p>
                    </Details.Item>

                    {swapRecord.txFrom &&
                      (swapRecord.txTo ||
                        (swapRecord.swapStatus !== 'refunded' &&
                          swapRecord.swapStatus !== 'failed' &&
                          !swapRecord.txTo)) && (
                        <Details.Panel label={t('routingPanelTransactionToLabel')}>
                          <Details.Item label={t('receivePanelTokenLabel')}>
                            {match({ txTo: swapRecord.txTo })
                              .with({ txTo: P.string }, () => (
                                <div className="flex w-full items-center justify-between gap-2.5 text-sm">
                                  {swapRecord.tokenTo.blockchain && (
                                    <div className="flex items-center gap-2.5 text-sm">
                                      <BlockchainIcon blockchain={swapRecord.tokenTo.blockchain} />

                                      <div className="flex shrink flex-wrap">
                                        <span className="whitespace-nowrap text-white uppercase">
                                          {swapRecord.tokenTo.symbol}
                                        </span>
                                        <span className="whitespace-nowrap text-gray-300">
                                          {` | ${tCommonBlockchain(swapRecord.tokenTo.blockchain)}`}
                                        </span>
                                      </div>
                                    </div>
                                  )}

                                  <p className="text-sm">{swapRecord.amountTo}</p>
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
                            <p className="text-sm break-all">{swapRecord.addressTo}</p>

                            {swapRecord.tokenTo && swapRecord.tokenTo.blockchain && (
                              <Tooltip
                                title={contact ? `${t('contactSavedTooltipLabel', { name: contact.name })}` : ''}
                              >
                                <Button
                                  clickableProps={{ className: 'px-0' }}
                                  leftIcon={<TbUsers aria-hidden />}
                                  variant="text"
                                  disabled={!!contact}
                                  label={t('saveContactButtonLabel')}
                                  onClick={modalNavigateWrapper('save-contact', {
                                    state: {
                                      addresses: [
                                        { address: swapRecord.addressTo, blockchain: swapRecord.tokenTo.blockchain },
                                      ],
                                    },
                                  })}
                                />
                              </Tooltip>
                            )}
                          </Details.Item>

                          {swapRecord.extraIdTo && (
                            <Details.Item label={t('extraIdToLabel')}>
                              <p className="text-sm break-all">{swapRecord.extraIdTo}</p>
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

        <div className="mt-8 flex w-full items-center gap-2">
          <Button
            label={t('swapLogButtonLabel')}
            className="w-40"
            variant="card"
            iconsOnEdge={false}
            onClick={handleGoToSwapLog}
            rightIcon={<TbExternalLink aria-hidden />}
          />

          <Link
            label={t('helpButtonLabel')}
            className="grow"
            target="_blank"
            to={ConstantsHelper.cozDiscordUrl}
            variant="card"
            iconsOnEdge={false}
            leftIcon={<TbLifebuoy aria-hidden />}
          />
        </div>
      </div>
    </BottomModalLayout>
  )
}

export default SwapDetailsModal
