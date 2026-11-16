import { useState, useSyncExternalStore } from 'react'

import { BSUtilsHelper } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { BlockchainIcon } from '@renderer/components/BlockchainIcon'
import { Button } from '@renderer/components/Button'
import { Details } from '@renderer/components/Details'
import { Tooltip } from '@renderer/components/Tooltip'

import { LoggerHelper } from '@renderer/helpers/LoggerHelper'
import { StringHelper } from '@renderer/helpers/StringHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { useConfirmAction } from '@renderer/hooks/useConfirmAction'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { useWalletByIdSelector } from '@renderer/hooks/useWalletSelector'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import TbArrowLeft from '@renderer/assets/images/tb-arrow-left.svg?react'
import TbCheck from '@renderer/assets/images/tb-check.svg?react'
import TbReceipt from '@renderer/assets/images/tb-receipt.svg?react'
import TbTransform from '@renderer/assets/images/tb-transform.svg?react'

import { AppError } from '@shared/helpers/ErrorHelper'
import type { TModalState } from '@shared/types/modal'

export const SwapConfirmationModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'swapConfirmation' })
  const { t: tCommonBlockchain } = useTranslation('common', { keyPrefix: 'blockchain' })
  const { account, swapOrchestrator } = useModalState<TModalState<'swap-confirmation'>>()
  const { wallet } = useWalletByIdSelector(account.idWallet)
  const { confirmAction } = useConfirmAction()
  const { modalNavigate } = useModalNavigate()

  const navigate = useNavigate()

  const [isConfirming, setIsConfirming] = useState(false)

  const state = useSyncExternalStore(swapOrchestrator.store.subscribe, swapOrchestrator.store.getState)

  const tokenToUse = state.tokenToUse.value
  const tokenToReceive = state.tokenToReceive.value
  const amountToUse = state.amountToUse.value
  const amountToReceive = state.quote.value?.amountToReceive
  const addressToReceive = state.addressToReceive.value

  const handleConfirm = async () => {
    setIsConfirming(true)

    try {
      await confirmAction({ account })

      const { swapId: orderId } = await swapOrchestrator.createOrder()

      swapOrchestrator
        .executeOrder()
        .then(swapResult => {
          if (swapResult.status !== 'failed') return

          LoggerHelper.sentry(new Error(swapResult.log), { where: 'SwapConfirmation', operation: 'executeOrder' })
          ToastHelper.error({ message: AppError.wrap(new Error(swapResult.log)).message })
        })
        .catch(error => {
          LoggerHelper.sentry(error, { where: 'SwapConfirmation', operation: 'executeOrder' })
          ToastHelper.error({ message: AppError.wrap(error).message })
        })

      modalNavigate('swap-details', { state: { orderId }, replace: true })

      BSUtilsHelper.wait(1000).then(() => {
        navigate('/wallets', { state: { wallet, account, tab: 'transactions' }, replace: true })
      })
    } catch (error) {
      LoggerHelper.sentry(error, { where: 'SwapConfirmation', operation: 'submitSwap' })
      ToastHelper.error({ message: AppError.wrap(error).message })
    } finally {
      setIsConfirming(false)
    }
  }

  if (!tokenToUse || !tokenToReceive || !amountToUse || !amountToReceive || !addressToReceive) return null

  return (
    <BottomModalLayout heading={t('heading')}>
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col text-sm">
          <div className="flex w-full justify-center pb-8">
            <TbTransform aria-hidden className="text-blue size-20" />
          </div>

          <p className="text-left">{t('description')}</p>

          <Details.Root className="my-6 pt-4 pb-0">
            <Details.Header
              className="mb-2"
              leftElement={<TbReceipt aria-hidden className="text-blue min-size-4 size-4" />}
            >
              {t('transactionDetails')}
            </Details.Header>

            <Details.Body>
              <Details.Panel>
                <Details.Item className="px-0 py-3">
                  <div className="flex w-full flex-col">
                    <div className="flex w-full grow flex-col justify-center gap-3 px-2.5 pb-3 text-sm">
                      <p className="text-xs text-gray-100 uppercase">{t('youWantToSwap')}</p>
                      <div className="flex items-center text-sm">
                        <BlockchainIcon className="mr-2.5 text-gray-300" blockchain={tokenToUse.blockchain!} />

                        <div className="shrink uppercase">
                          <span className="whitespace-nowrap text-white">{tokenToUse.symbol}</span>
                          {tokenToUse.blockchain && (
                            <span className="whitespace-nowrap text-gray-300">{` | ${tCommonBlockchain(tokenToUse.blockchain)}`}</span>
                          )}
                        </div>

                        <TbArrowLeft aria-hidden className="text-orange mx-3.5 rotate-180" />

                        <BlockchainIcon className="mr-2.5 text-gray-300" blockchain={tokenToReceive.blockchain!} />

                        <div className="shrink uppercase">
                          <span className="whitespace-nowrap text-white">{tokenToReceive.symbol}</span>
                          {tokenToReceive.blockchain && (
                            <span className="whitespace-nowrap text-gray-300">{` | ${tCommonBlockchain(tokenToReceive.blockchain)}`}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-blue my-3 w-full bg-gray-300/15 px-2.5 py-1 text-sm">{t('swapFrom')}</p>

                    <div className="flex min-h-14 w-full grow flex-col justify-center gap-3 px-2.5 py-3 text-sm">
                      <p className="text-xs text-gray-100 uppercase">{t('sendingAddress')}</p>
                      <p className="text-sm break-all">{account.address}</p>
                    </div>
                  </div>
                </Details.Item>

                <Details.Item className="px-0 py-3">
                  <div className="flex w-full flex-col">
                    <div className="flex min-h-14 w-full grow flex-col justify-center gap-3 px-2.5 py-3 text-sm">
                      <p className="text-xs text-gray-100 uppercase">{t('amount')}</p>

                      <div className="flex justify-between">
                        <div className="flex items-center text-sm">
                          <BlockchainIcon className="mr-2.5 text-gray-300" blockchain={tokenToUse.blockchain!} />

                          <div className="shrink uppercase">
                            <span className="whitespace-nowrap text-white">{tokenToUse.name}</span>
                            {tokenToUse.blockchain && (
                              <span className="whitespace-nowrap text-gray-300">{` | ${tCommonBlockchain(tokenToUse.blockchain)}`}</span>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-white">{amountToUse}</p>
                      </div>
                    </div>

                    <p className="text-blue my-3 w-full bg-gray-300/15 px-2.5 py-1 text-sm">{t('swapTo')}</p>

                    <div className="flex min-h-14 w-full grow flex-col justify-center gap-3 px-2.5 py-3 text-sm">
                      <p className="text-xs text-gray-100 uppercase">{t('receivingAddress')}</p>
                      <p className="text-sm break-all">{addressToReceive}</p>
                    </div>
                  </div>
                </Details.Item>

                <Details.Item className="px-0 py-3">
                  <div className="flex w-full flex-col">
                    <div className="flex min-h-14 w-full grow flex-col justify-center gap-3 px-2.5 py-3 text-sm">
                      <p className="text-xs text-gray-100 uppercase">{t('amount')}</p>

                      <div className="flex justify-between">
                        <div className="flex items-center text-sm">
                          <BlockchainIcon className="mr-2.5 text-gray-300" blockchain={tokenToReceive.blockchain!} />

                          <div className="shrink uppercase">
                            <span className="whitespace-nowrap text-white">{tokenToReceive.name}</span>
                            {tokenToReceive.blockchain && (
                              <span className="whitespace-nowrap text-gray-300">{` | ${tCommonBlockchain(tokenToReceive.blockchain)}`}</span>
                            )}
                          </div>
                        </div>

                        <Tooltip title={amountToReceive}>
                          <p className="text-sm text-white">{StringHelper.truncate(amountToReceive, 15)}</p>
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
          loading={isConfirming}
          disabled={isConfirming}
        />
      </div>
    </BottomModalLayout>
  )
}

export default SwapConfirmationModal
