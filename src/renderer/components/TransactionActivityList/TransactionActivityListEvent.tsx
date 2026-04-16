import { Fragment } from 'react'

import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

import TbDiamond from '@renderer/assets/images/tb-diamond.svg?react'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import type { TUseTransactionsTransactionEvent } from '@shared/types/hooks'

import { TransactionActivityListEventColumn } from './TransactionActivityListEventColumn'
import { TransactionActivityListEventColumnDataAddress } from './TransactionActivityListEventColumnDataAddress'
import { TransactionActivityListTooltip } from './TransactionActivityListTooltip'

type TProps = {
  blockchain: TBlockchainServiceKey
  event: TUseTransactionsTransactionEvent
}

export const TransactionActivityListEvent = ({ event, blockchain }: TProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'transactionActivityList.event' })
  const { t: tCommon } = useTranslation('common')

  const { amount, to, toUrl, toAccount, from, fromUrl, fromAccount } = event

  const toName = toAccount?.name
  const fromName = fromAccount?.name

  return (
    <div className="flex h-13 max-h-13 min-h-13 flex-grow items-center gap-x-2 overflow-x-auto overflow-y-hidden px-2 whitespace-nowrap">
      <TransactionActivityListEventColumn
        label={t('columns.fromLabel')}
        data={
          !from ? (
            <span className="inline-block">{tCommon('general.emptyColumn')}</span>
          ) : (
            <TransactionActivityListEventColumnDataAddress address={from} addressName={fromName} />
          )
        }
        url={fromUrl}
      />

      <TransactionActivityListEventColumn
        label={t('columns.toLabel')}
        data={
          !to ? (
            <span className="inline-block">{tCommon('general.emptyColumn')}</span>
          ) : (
            <TransactionActivityListEventColumnDataAddress address={to} addressName={toName} />
          )
        }
        url={toUrl}
      />

      <TransactionActivityListEventColumn
        label={t('columns.amountLabel')}
        data={
          !amount ? (
            <span className="inline-block">{tCommon('general.emptyColumn')}</span>
          ) : (
            <TransactionActivityListTooltip data={amount}>
              <span className="inline-block max-w-20 truncate">{amount}</span>
            </TransactionActivityListTooltip>
          )
        }
      />

      {match(event)
        .with({ eventType: 'nft' }, matchedEvent => {
          const { tokenHash, nftImageUrl, nftUrl, name, collectionName } = matchedEvent
          const nftImageLabel = name ? t('nftImageAltWithNameLabel', { name }) : t('nftImageAltLabel')

          return (
            <Fragment>
              {!!tokenHash && <TransactionActivityListEventColumn label={t('columns.tokenIdLabel')} data={tokenHash} />}

              {!!collectionName && (
                <TransactionActivityListEventColumn label={t('columns.collectionNameLabel')} data={collectionName} />
              )}

              {!!name && <TransactionActivityListEventColumn label={t('columns.nameLabel')} data={name} url={nftUrl} />}

              {!!nftImageUrl && (
                <TransactionActivityListEventColumn
                  className="mt-2"
                  data={
                    <TransactionActivityListTooltip data={nftImageLabel}>
                      <TbDiamond aria-hidden />
                    </TransactionActivityListTooltip>
                  }
                  url={nftUrl}
                />
              )}
            </Fragment>
          )
        })
        .otherwise(matchedEvent => {
          const { token } = matchedEvent
          const tokenSymbol = token?.symbol || ''
          const tokenName = token?.name || ''
          const hasTokenLabel = !!tokenSymbol || !!tokenName
          const blockchainName = tCommon(`blockchain.${blockchain}`)

          return (
            <TransactionActivityListEventColumn
              label={t('columns.tokenLabel')}
              data={
                !hasTokenLabel ? (
                  <span className="inline-block">{tCommon('general.emptyColumn')}</span>
                ) : (
                  <TransactionActivityListTooltip
                    className="uppercase"
                    data={`${tokenName || tokenSymbol} | ${blockchainName}`}
                  >
                    <div className="inline-block truncate uppercase">
                      {tokenSymbol || tokenName}
                      <span className="text-gray-300"> | {blockchainName}</span>
                    </div>
                  </TransactionActivityListTooltip>
                )
              }
            />
          )
        })}
    </div>
  )
}
