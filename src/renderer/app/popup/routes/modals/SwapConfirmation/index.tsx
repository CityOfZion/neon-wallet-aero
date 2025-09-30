import { useTranslation } from 'react-i18next'
import { ActionStep } from '@renderer/components/ActionStep'
import { Button } from '@renderer/components/Button'
import { Separator } from '@renderer/components/Separator'
import { StringHelper } from '@renderer/helpers/StringHelper'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { useAppDispatch } from '@renderer/hooks/useRedux'
import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'
import { utilityReducerActions } from '@renderer/store/reducers/UtilityReducer'
import { TModalState } from '@shared/types/modal'

import TbArrowLeft from '@renderer/assets/images/tb-arrow-left.svg?react'
import VscCircleFilled from '@renderer/assets/images/vsc-circle-filled.svg?react'

export const SwapConfirmationModal = () => {
  const { swapRecord, swapOrchestrator } = useModalState<TModalState<'swap-confirmation'>>()
  const { t } = useTranslation('modals', { keyPrefix: 'swapConfirmationModal' })
  const { modalEraseWrapper, modalNavigate } = useModalNavigate()
  const dispatch = useAppDispatch()

  const handleConfirm = async () => {
    if (!swapOrchestrator) return

    try {
      const swapResponse = await swapOrchestrator.swap()

      swapRecord.swapId = swapResponse.id
      swapRecord.txFrom = swapResponse.txFrom
      swapRecord.log = swapResponse.log
    } catch (error: any) {
      console.error(error)
    } finally {
      if (!swapRecord.txFrom) swapRecord.swapStatus = 'refunded'

      dispatch(utilityReducerActions.persistSwapRecord(swapRecord))

      modalNavigate('swap-details', {
        state: {
          swapRecord,
        },
        replace: true,
      })
    }
  }

  return (
    <BottomModalLayout heading={t('heading')} className="overflow-y-auto">
      <div className="flex h-full flex-col justify-between gap-3">
        <div className="flex flex-col text-sm">
          <p className="my-4 text-center">{t('description')}</p>
          <div className="flex w-full flex-col items-center rounded bg-gray-300/15 px-4">
            <div className="flex min-h-14 w-full flex-grow items-center justify-center gap-3 text-lg font-semibold">
              <p>{t('swapFromTo', { tokenFrom: swapRecord.tokenFrom.symbol, tokenTo: swapRecord.tokenTo.symbol })}</p>
            </div>

            <Separator />

            <ActionStep
              title={t('accountFrom')}
              leftIcon={<VscCircleFilled aria-hidden={true} className="h-2 w-2 text-gray-300" />}
            >
              <div className="text-blue flex flex-col text-right">
                {StringHelper.truncateMiddle(swapRecord.account.name, 15)} (
                {StringHelper.truncateMiddle(swapRecord.account.address, 15)})
              </div>
            </ActionStep>

            <Separator />

            <ActionStep
              title={t('accountTo')}
              leftIcon={<VscCircleFilled aria-hidden={true} className="h-2 w-2 text-gray-300" />}
            >
              <div className="text-blue flex flex-col">
                <p className="truncate">{StringHelper.truncateMiddle(swapRecord.addressTo, 15)}</p>
              </div>
            </ActionStep>

            <Separator />

            <ActionStep
              title={t('amountToSend')}
              leftIcon={<VscCircleFilled aria-hidden={true} className="h-2 w-2 text-gray-300" />}
            >
              <div className="text-blue flex flex-col">
                <p className="truncate">{swapRecord.amountFrom}</p>
              </div>
            </ActionStep>

            <Separator />

            <ActionStep
              title={t('amountToReceive')}
              leftIcon={<VscCircleFilled aria-hidden={true} className="h-2 w-2 text-gray-300" />}
            >
              <div className="text-blue flex flex-col">
                <p className="truncate">{swapRecord.amountTo}</p>
              </div>
            </ActionStep>
          </div>
        </div>

        <div className="flex gap-2.5">
          <Button
            variant="card"
            label={t('cancelButtonLabel')}
            colorSchema="error"
            type="button"
            onClick={modalEraseWrapper('bottom')}
          />
          <Button
            className="w-full"
            variant="card"
            label={t('confirmButtonLabel')}
            leftIcon={<TbArrowLeft aria-hidden className="rotate-180" />}
            iconsOnEdge={false}
            onClick={handleConfirm}
          />
        </div>
      </div>
    </BottomModalLayout>
  )
}
