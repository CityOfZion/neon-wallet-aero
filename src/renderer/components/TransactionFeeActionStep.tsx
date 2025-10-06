import { useTranslation } from 'react-i18next'
import { BlockchainService } from '@cityofzion/blockchain-service'
import { ExchangeHelper } from '@renderer/helpers/ExchangeHelper'
import { NumberHelper } from '@renderer/helpers/NumberHelper'
import { StyleHelper } from '@renderer/helpers/StyleHelper'
import { useExchange } from '@renderer/hooks/useExchange'
import { useCurrencySelector } from '@renderer/hooks/useSettingsSelector'
import { TBlockchainServiceKey } from '@shared/types/blockchain'

import { ActionStep } from './ActionStep'
import { Loader } from './Loader'

import TbReceipt from '@renderer/assets/images/tb-receipt.svg?react'

type TProps = {
  fee?: string
  isCalculatingFee: boolean
  service?: BlockchainService<TBlockchainServiceKey>
  className?: string
  titleClassName?: string
  textClassName?: string
  fiatClassName?: string
}

export const TransactionFeeActionStep = ({
  fee,
  isCalculatingFee,
  service,
  className,
  titleClassName,
  textClassName,
}: TProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'transactionFeeActionStep' })
  const { currency } = useCurrencySelector()

  const exchange = useExchange(service ? [{ blockchain: service.name, tokens: [service.feeToken] }] : [])

  const feeTokenConvertedPrice =
    exchange && service
      ? ExchangeHelper.getExchangeConvertedPrice(service.feeToken.hash, service.name, exchange.data)
      : 0

  const feeNumber = !service || !fee ? 0 : fee
  const fiatFee = NumberHelper.number(feeNumber) * feeTokenConvertedPrice

  return (
    <div className="mt-2 flex w-full flex-col rounded bg-gray-300/15 px-4">
      <ActionStep
        title={t('title')}
        leftIcon={<TbReceipt aria-hidden={true} className="h-6 min-h-6 w-6 min-w-6" />}
        className={StyleHelper.mergeStyles('min-h-11 font-bold', className)}
        titleClassName={StyleHelper.mergeStyles('text-sm whitespace-nowrap mr-3 !overflow-visible', titleClassName)}
      >
        {isCalculatingFee ? (
          <Loader className="h-4 w-4" containerClassName="w-min items-center" />
        ) : (
          <div className={StyleHelper.mergeStyles('flex flex-col items-center gap-3 text-sm', textClassName)}>
            <span className="mt-0.5 text-right leading-4 font-normal uppercase">
              {feeNumber ?? '0.00'} {service?.feeToken.symbol}
              {service ? <span className="text-gray-100">{` | ${service.name}`}</span> : null}
            </span>
          </div>
        )}
      </ActionStep>

      <div className="flex w-full justify-between pb-3 pl-6">
        <span className="text-xs text-gray-200 italic">{t('value')}</span>
        <span className="text-xs text-gray-100 italic">{NumberHelper.currency(fiatFee, currency)}</span>
      </div>
    </div>
  )
}
