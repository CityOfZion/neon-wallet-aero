import { BSBigNumberHelper } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'
import { Details } from '@renderer/components/Details'

import { CurrencyHelper } from '@renderer/helpers/CurrencyHelper'
import { ExchangeHelper } from '@renderer/helpers/ExchangeHelper'

import { useExchange } from '@renderer/hooks/useExchange'
import { useModalState } from '@renderer/hooks/useModalRouter'
import { usePressOnce } from '@renderer/hooks/usePressOnce'
import { useCurrencySelector } from '@renderer/hooks/useSettingsSelector'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import MdCheck from '@renderer/assets/images/md-check.svg?react'
import TbArrowRight from '@renderer/assets/images/tb-arrow-right.svg?react'
import TbReceipt from '@renderer/assets/images/tb-receipt.svg?react'
import TbReplace2 from '@renderer/assets/images/tb-replace-2.svg?react'

import type { TModalState } from '@shared/types/modal'

export const Neo3NeoXBridgeConfirmationModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'neo3NeoXBridgeConfirmation' })
  const {
    accountToUse,
    addressToReceive,
    amountToReceive,
    amountToUse,
    onConfirm,
    tokenToReceive,
    tokenToUse,
    fromService,
  } = useModalState<TModalState<'neo3-neox-bridge-confirmation'>>()

  const { currency } = useCurrencySelector()

  const tokenExchange = useExchange(
    tokenToReceive
      ? [
          {
            blockchain: tokenToReceive.blockchain,
            tokens: [tokenToReceive],
          },
        ]
      : []
  )

  const [isConfirming, startConfirm] = usePressOnce(async () => {
    await onConfirm()
  })

  if (!accountToUse || !tokenToUse || !tokenToReceive || !fromService || !amountToReceive || !amountToUse) {
    return null
  }

  const tokenToReceiveFiatPrice =
    tokenExchange && tokenToReceive
      ? ExchangeHelper.getExchangeConvertedPrice(tokenToReceive.hash, tokenToReceive.blockchain, tokenExchange.data)
      : 0

  const amountToReceiveFiatPrice = BSBigNumberHelper.fromNumber(amountToReceive)
    .times(tokenToReceiveFiatPrice)
    .toString()

  const formattedTokenToReceiveFiat = CurrencyHelper.format(amountToReceiveFiatPrice, { currency })

  return (
    <BottomModalLayout heading={t('title')}>
      <div className="flex flex-grow flex-col items-center justify-between gap-6">
        <TbReplace2 aria-hidden className="text-blue size-21" />

        <p className="text-sm font-bold">{t('description')}</p>

        <Details.Root>
          <Details.Header leftElement={<TbReceipt aria-hidden />}>{t('transactionDetailsHeaderLabel')}</Details.Header>

          <Details.Body>
            <Details.Panel>
              <Details.Item label={t('bridgeDetailsItemLabel')}>
                <Details.Token symbol={tokenToUse.symbol} blockchain={tokenToUse.blockchain} className="w-fit" />

                <TbArrowRight aria-hidden className="text-orange min-size-6" />

                <Details.Token
                  symbol={tokenToReceive.symbol}
                  blockchain={tokenToReceive.blockchain}
                  className="w-fit"
                />
              </Details.Item>
            </Details.Panel>

            <Details.Panel label={t('fromDetailsPanelLabel')}>
              <Details.Item label={t('fromAddressDetailsItemLabel')}>{accountToUse.address}</Details.Item>

              <Details.Item label={t('fromTokenDetailsItemLabel')} rightElement={formattedTokenToReceiveFiat}>
                <Details.Token symbol={tokenToUse.symbol} blockchain={tokenToUse.blockchain} amount={amountToUse} />
              </Details.Item>
            </Details.Panel>

            <Details.Panel label={t('toDetailsPanelLabel')}>
              <Details.Item label={t('toAddressDetailsItemLabel')}>{addressToReceive}</Details.Item>

              <Details.Item label={t('toTokenDetailsItemLabel')} rightElement={formattedTokenToReceiveFiat}>
                <Details.Token
                  symbol={tokenToReceive.symbol}
                  blockchain={tokenToReceive.blockchain}
                  amount={amountToReceive}
                />
              </Details.Item>
            </Details.Panel>
          </Details.Body>
        </Details.Root>

        <Button
          variant="card"
          className="w-full"
          leftIcon={<MdCheck aria-hidden />}
          iconsOnEdge={false}
          label={t('confirmButtonLabel')}
          loading={isConfirming}
          onClick={startConfirm}
        />
      </div>
    </BottomModalLayout>
  )
}

export default Neo3NeoXBridgeConfirmationModal
