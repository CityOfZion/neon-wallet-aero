import type { IBlockchainService } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'

import { CurrencyHelper } from '@renderer/helpers/CurrencyHelper'
import { ExchangeHelper } from '@renderer/helpers/ExchangeHelper'
import { NumberHelper } from '@renderer/helpers/NumberHelper'
import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { useExchange } from '@renderer/hooks/useExchange'
import { useCurrencySelector } from '@renderer/hooks/useSettingsSelector'

import TbReceipt from '@renderer/assets/images/tb-receipt.svg?react'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'

import { ActionStep } from './ActionStep'
import { Loader } from './Loader'

type TProps = {
  fee?: string
  isCalculatingFee: boolean
  service?: IBlockchainService<TBlockchainServiceKey>
  className?: string
  containerClassName?: string
  titleClassName?: string
  textClassName?: string
  fiatClassName?: string
}

export const TransactionFeeActionStep = ({
  fee,
  isCalculatingFee,
  service,
  className,
  containerClassName,
  titleClassName,
  textClassName,
}: TProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'transactionFeeActionStep' })
  const { t: tCommonBlockchain } = useTranslation('common', { keyPrefix: 'blockchain' })
  const { currency } = useCurrencySelector()

  const exchange = useExchange(service ? [{ blockchain: service.name, tokens: [service.feeToken] }] : [])

  const feeTokenConvertedPrice =
    exchange && service
      ? ExchangeHelper.getExchangeConvertedPrice(service.feeToken.hash, service.name, exchange.data)
      : 0

  const feeNumber = !service || !fee ? 0 : fee
  const fiatFee = NumberHelper.number(feeNumber) * feeTokenConvertedPrice

  return (
    <div
      className={StyleHelper.mergeStyles(
        'mt-2 flex w-full flex-col rounded bg-gray-300/15 px-4 pt-1',
        containerClassName
      )}
    >
      <ActionStep
        title={t('title')}
        className={StyleHelper.mergeStyles('min-h-11 font-bold', className)}
        titleClassName={StyleHelper.mergeStyles('text-sm whitespace-nowrap mr-3 overflow-visible!', titleClassName)}
        leftIcon={<TbReceipt aria-hidden className="min-size-6 max-size-6 size-6" />}
      >
        {isCalculatingFee ? (
          <Loader className="size-4" containerClassName="w-min items-center" />
        ) : (
          <div className={StyleHelper.mergeStyles('flex flex-col items-center gap-3 text-sm', textClassName)}>
            <span className="text-right leading-4 font-normal uppercase">
              {feeNumber || '0.00'} {service?.feeToken.symbol}
              {service ? <span className="text-gray-100">{` | ${tCommonBlockchain(service.name)}`}</span> : null}
            </span>
          </div>
        )}
      </ActionStep>

      <div className="flex w-full justify-between gap-x-2 pb-3 pl-6.5">
        <span className="text-xs text-gray-200 italic">{t('value')}</span>
        <span className="truncate text-xs text-gray-100 italic">{CurrencyHelper.format(fiatFee, { currency })}</span>
      </div>
    </div>
  )
}
