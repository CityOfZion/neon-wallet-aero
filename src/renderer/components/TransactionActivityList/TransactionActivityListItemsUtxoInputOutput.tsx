import { BSBigNumberHelper, type TTransactionUtxoInputOutput } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'

import { IconButton } from '@renderer/components/IconButton'
import { Separator } from '@renderer/components/Separator'

import { AccountHelper } from '@renderer/helpers/AccountHelper'
import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { ClipboardHelper } from '@renderer/helpers/ClipboardHelper'
import { CurrencyHelper } from '@renderer/helpers/CurrencyHelper'
import { ExchangeHelper } from '@renderer/helpers/ExchangeHelper'
import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { useAccountsMapSelector } from '@renderer/hooks/useAccountSelector'
import { useExchange } from '@renderer/hooks/useExchange'
import { useCurrencySelector } from '@renderer/hooks/useSettingsSelector'

import MdContentCopy from '@renderer/assets/images/md-content-copy.svg?react'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'

import { TransactionActivityListItemsColumn } from './TransactionActivityListItemsColumn'
import { TransactionActivityListItemsColumnDataAddress } from './TransactionActivityListItemsColumnDataAddress'
import { TransactionActivityListTooltip } from './TransactionActivityListTooltip'

type TProps = {
  input?: TTransactionUtxoInputOutput
  output?: TTransactionUtxoInputOutput
  blockchain: TBlockchainServiceKey
  index: number
  contentClassName?: string
}

export const TransactionActivityListItemsUtxoInputOutput = ({
  input,
  output,
  blockchain,
  index,
  contentClassName,
}: TProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'transactionActivityList.items' })
  const { t: tCommonGeneral } = useTranslation('common', { keyPrefix: 'general' })
  const { currency } = useCurrencySelector()
  const { accountsMap } = useAccountsMapSelector()

  const hasInput = !!input
  const { address, addressUrl, amount, token } = (hasInput ? input : output)!
  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]

  const account = address ? accountsMap.get(AccountHelper.buildAccountKey({ blockchain, address })) : undefined

  const exchange = useExchange(service ? [{ blockchain, tokens: [token] }] : [])

  const tokenConvertedPrice =
    exchange && service ? ExchangeHelper.getExchangeConvertedPrice(token.hash, blockchain, exchange.data) : 0

  const amountFiat = CurrencyHelper.format(
    BSBigNumberHelper.fromNumber(amount).multipliedBy(tokenConvertedPrice).toFixed(),
    { currency }
  )

  const amountSymbol = `${amount} ${token.symbol}`

  return (
    <li className="relative flex h-14 max-h-14 min-h-14 w-full items-center">
      {!hasInput && (
        <Separator type="vertical" className="bg-gray-600" containerClassName="relative -left-[0.5px] py-1" />
      )}

      <div
        className={StyleHelper.mergeStyles(
          'flex h-full grow flex-col justify-center truncate',
          { 'pb-3': index >= 2 },
          contentClassName
        )}
      >
        <div className="flex items-end gap-x-1">
          <TransactionActivityListItemsColumn
            label={index === 0 ? t(`columns.${hasInput ? 'fromLabel' : 'toLabel'}`) : undefined}
            data={
              !address ? (
                tCommonGeneral('emptyColumn')
              ) : (
                <TransactionActivityListItemsColumnDataAddress
                  address={address}
                  accountName={account?.name}
                  addressMaxLength={16}
                  accountNameMaxLength={18}
                  className="leading-4.25"
                />
              )
            }
            url={addressUrl}
            className="w-fit max-w-fit min-w-fit"
            labelClassName="leading-4.25"
          />

          {address && (
            <TransactionActivityListTooltip data={t('copyAddressButtonLabel')}>
              <IconButton
                aria-label={t('copyAddressButtonLabel')}
                size="xs"
                className="-mb-0.5"
                clickableProps={{ className: 'p-0.5' }}
                icon={<MdContentCopy aria-hidden className="text-neon" />}
                onClick={ClipboardHelper.write.bind(null, address)}
              />
            </TransactionActivityListTooltip>
          )}
        </div>

        <TransactionActivityListItemsColumn
          data={
            <TransactionActivityListTooltip data={`${amountSymbol} | ${amountFiat}`}>
              <span className="inline-block truncate leading-4.25">
                {amountSymbol}
                <span className="text-gray-300">{` | ${amountFiat}`}</span>
              </span>
            </TransactionActivityListTooltip>
          }
          className="w-full max-w-full min-w-full"
        />
      </div>

      {hasInput && (
        <Separator type="vertical" className="bg-gray-600" containerClassName="relative -right-[0.5px] py-1" />
      )}
    </li>
  )
}
