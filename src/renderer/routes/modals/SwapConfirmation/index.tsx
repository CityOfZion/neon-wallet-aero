import { useTranslation } from 'react-i18next'

import { BlockchainIcon } from '@renderer/components/BlockchainIcon'
import { Button } from '@renderer/components/Button'
import { Details } from '@renderer/components/Details'
import { Tooltip } from '@renderer/components/Tooltip'

import { CurrencyHelper } from '@renderer/helpers/CurrencyHelper'
import { AppError } from '@renderer/helpers/ErrorHelper'
import { LoggerHelper } from '@renderer/helpers/LoggerHelper'
import { StringHelper } from '@renderer/helpers/StringHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { useConfirmAction } from '@renderer/hooks/useConfirmAction'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { useAppDispatch } from '@renderer/hooks/useRedux'
import { useCurrencySelector } from '@renderer/hooks/useSettingsSelector'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import TbArrowLeft from '@renderer/assets/images/tb-arrow-left.svg?react'
import TbCheck from '@renderer/assets/images/tb-check.svg?react'
import TbReceipt from '@renderer/assets/images/tb-receipt.svg?react'
import TbTransform from '@renderer/assets/images/tb-transform.svg?react'

import { utilityReducerActions } from '@renderer/store/reducers/utility'
import type { TModalState } from '@shared/types/modal'

export const SwapConfirmationModal = () => {
  const { swapRecord, swapOrchestrator } = useModalState<TModalState<'swap-confirmation'>>()
  const { t } = useTranslation('modals', { keyPrefix: 'swapConfirmation' })
  const { currency } = useCurrencySelector()
  const { confirmAction } = useConfirmAction()

  const { modalNavigate } = useModalNavigate()
  const dispatch = useAppDispatch()

  const handleConfirm = async () => {
    if (!swapOrchestrator) return

    try {
      await confirmAction({ account: swapRecord.account })

      const swapResponse = await swapOrchestrator.swap()

      dispatch(
        utilityReducerActions.persistSwapRecord({
          ...swapRecord,
          swapId: swapResponse.id,
          txFrom: swapResponse.txFrom,
          log: swapResponse.log,
          swapStatus: swapResponse.txFrom ? swapRecord.swapStatus : 'refunded',
        })
      )

      modalNavigate('swap-details', { state: { swapRecord }, replace: true })
    } catch (error: any) {
      LoggerHelper.sentry(error, { where: 'SwapConfirmation', operation: 'submitSwap' })
      ToastHelper.error({ message: AppError.wrap(error).message })
    }
  }

  return (
    <BottomModalLayout heading={t('heading')} className="overflow-y-auto px-4">
      <div className="flex h-full flex-col justify-between gap-3">
        <div className="flex flex-col text-sm">
          <div className="flex w-full justify-center pb-8">
            <TbTransform aria-hidden className="text-blue size-20" />
          </div>

          <p className="my-4 text-left">{t('description')}</p>

          <Details.Root className="my-6">
            <Details.Header leftElement={<TbReceipt aria-hidden className="text-blue min-size-4 size-4" />}>
              {t('transactionDetails')}
            </Details.Header>

            <Details.Body>
              <Details.Panel>
                <Details.Item className="px-0 py-3">
                  <div className="flex flex-col">
                    <div className="flex w-full flex-grow flex-col justify-center gap-3 px-2.5 pb-3 text-sm">
                      <p className="text-xs text-gray-100 uppercase">{t('youWantToSwap')}</p>
                      <div className="flex items-center text-sm">
                        <BlockchainIcon
                          className="mr-2.5 text-gray-300"
                          blockchain={swapRecord.tokenFrom.blockchain!}
                        />

                        <div className="flex shrink flex-wrap">
                          <span className="mr-1 whitespace-nowrap text-white uppercase">
                            {swapRecord.tokenFrom.symbol}
                          </span>
                          <span className="whitespace-nowrap text-gray-300 capitalize">{`| ${swapRecord.tokenFrom.blockchain}`}</span>
                        </div>

                        <TbArrowLeft aria-hidden className="text-orange mx-3.5 rotate-180" />

                        <BlockchainIcon className="mr-2.5 text-gray-300" blockchain={swapRecord.tokenTo.blockchain!} />

                        <div className="flex shrink flex-wrap">
                          <span className="mr-1 whitespace-nowrap text-white uppercase">
                            {swapRecord.tokenTo.symbol}
                          </span>
                          <span className="whitespace-nowrap text-gray-300 capitalize">{`| ${swapRecord.tokenTo.blockchain}`}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-blue my-3 w-full bg-gray-300/15 pb-1 pl-2.5 text-sm">{t('swapFrom')}</p>

                    <div className="flex min-h-14 w-full flex-grow flex-col justify-center gap-3 px-2.5 py-3 text-sm">
                      <p className="text-xs text-gray-100 uppercase">{t('sendingAddress')}</p>
                      <p className="text-sm break-all">{swapRecord.account.address}</p>
                    </div>
                  </div>
                </Details.Item>

                <Details.Item className="px-0 py-3">
                  <div className="flex flex-col">
                    <div className="flex min-h-14 w-full flex-grow flex-col justify-center gap-3 px-2.5 py-3 text-sm">
                      <div className="flex justify-between">
                        <p className="text-xs text-gray-100 uppercase">{t('amount')}</p>

                        <p className="text-sm text-gray-100">
                          {CurrencyHelper.format(swapRecord.amountFrom, { currency })}
                        </p>
                      </div>

                      <div className="flex justify-between">
                        <div className="flex items-center text-sm">
                          <BlockchainIcon
                            className="mr-2.5 text-gray-300"
                            blockchain={swapRecord.tokenFrom.blockchain!}
                          />

                          <div className="flex shrink flex-wrap">
                            <span className="mr-1 whitespace-nowrap text-white uppercase">
                              {swapRecord.tokenFrom.name}
                            </span>
                            <span className="whitespace-nowrap text-gray-300 capitalize">{`| ${swapRecord.tokenFrom.blockchain}`}</span>
                          </div>
                        </div>

                        <p className="text-sm text-white">{swapRecord.amountFrom}</p>
                      </div>
                    </div>

                    <p className="text-blue my-3 w-full bg-gray-300/15 pb-1 pl-2.5 text-sm">{t('swapTo')}</p>

                    <div className="flex min-h-14 w-full flex-grow flex-col justify-center gap-3 px-2.5 py-3 text-sm">
                      <p className="text-xs text-gray-100 uppercase">{t('receivingAddress')}</p>
                      <p className="text-sm break-all">{swapRecord.addressTo}</p>
                    </div>
                  </div>
                </Details.Item>

                <Details.Item className="px-0 py-3">
                  <div className="flex w-full flex-col">
                    <div className="flex min-h-14 w-full flex-grow flex-col justify-center gap-3 px-2.5 py-3 text-sm">
                      <div className="flex justify-between">
                        <p className="text-xs text-gray-100 uppercase">{t('amount')}</p>

                        <p className="text-sm text-gray-100">
                          {CurrencyHelper.format(swapRecord.amountTo, { currency })}
                        </p>
                      </div>

                      <div className="flex justify-between">
                        <div className="flex items-center text-sm">
                          <BlockchainIcon
                            className="mr-2.5 text-gray-300"
                            blockchain={swapRecord.tokenTo.blockchain!}
                          />

                          <div className="flex shrink flex-wrap">
                            <span className="mr-1 whitespace-nowrap text-white uppercase">
                              {swapRecord.tokenTo.name}
                            </span>
                            <span className="whitespace-nowrap text-gray-300 capitalize">{`| ${swapRecord.tokenTo.blockchain}`}</span>
                          </div>
                        </div>

                        <Tooltip title={swapRecord.amountTo}>
                          <p className="text-sm text-white">{StringHelper.truncate(swapRecord.amountTo, 15)}</p>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </Details.Item>
              </Details.Panel>
            </Details.Body>
          </Details.Root>
        </div>

        <Button
          className="w-full pb-8"
          variant="card"
          label={t('confirmButtonLabel')}
          leftIcon={<TbCheck aria-hidden />}
          iconsOnEdge={false}
          onClick={handleConfirm}
        />
      </div>
    </BottomModalLayout>
  )
}

export default SwapConfirmationModal
