import { useTranslation } from 'react-i18next'
import { BSBigNumberHelper } from '@cityofzion/blockchain-service'
import { Button } from '@renderer/components/Button'
import { Details } from '@renderer/components/Details'
import { ExchangeHelper } from '@renderer/helpers/ExchangeHelper'
import { NumberHelper } from '@renderer/helpers/NumberHelper'
import { useExchange } from '@renderer/hooks/useExchange'
import { useModalState } from '@renderer/hooks/useModalRouter'
import { usePressOnce } from '@renderer/hooks/usePressOnce'
import { useCurrencySelector } from '@renderer/hooks/useSettingsSelector'
import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'
import { TModalState } from '@shared/types/modal'

import MdCheck from '@renderer/assets/images/md-check.svg?react'
import TbArrowRight from '@renderer/assets/images/tb-arrow-right.svg?react'
import TbReceipt from '@renderer/assets/images/tb-receipt.svg?react'
import TbReplace2 from '@renderer/assets/images/tb-replace-2.svg?react'

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
  const { handlePress, isPressing } = usePressOnce(onConfirm)
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

  const tokenToReceiveFiatPrice =
    tokenExchange && tokenToReceive
      ? ExchangeHelper.getExchangeConvertedPrice(tokenToReceive.hash, tokenToReceive.blockchain, tokenExchange.data)
      : 0

  if (!accountToUse || !tokenToUse || !tokenToReceive || !fromService || !amountToReceive || !amountToUse) {
    return
  }

  const amountToReceiveFiatPrice = BSBigNumberHelper.fromNumber(amountToReceive)
    .times(tokenToReceiveFiatPrice)
    .toString()

  const formattedTokenToReceiveFiat = NumberHelper.currency(amountToReceiveFiatPrice, currency)

  return (
    <BottomModalLayout heading={t('title')}>
      <div className="flex flex-grow flex-col items-center justify-between gap-6 px-4">
        <TbReplace2 aria-hidden className="text-blue h-21 w-21" />

        <p className="text-sm font-bold">{t('description')}</p>

        <Details.Root>
          <Details.Header label={t('transactionDetailsHeaderLabel')} icon={<TbReceipt aria-hidden />} />
          <Details.Body>
            <Details.Panel>
              <Details.Item label={t('bridgeDetailsItemLabel')}>
                <Details.Token symbol={tokenToUse.symbol} blockchain={tokenToUse.blockchain} className="w-fit" />

                <TbArrowRight aria-hidden className="text-orange min-h-6 min-w-6" />

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
          loading={isPressing}
          onClick={handlePress()}
        />
      </div>
    </BottomModalLayout>
  )
}

export default Neo3NeoXBridgeConfirmationModal
