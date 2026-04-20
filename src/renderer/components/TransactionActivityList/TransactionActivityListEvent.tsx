import { Fragment } from 'react'

import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

import TbDiamond from '@renderer/assets/images/tb-diamond.svg?react'

import type { TUseTransactionsTransactionEvent } from '@shared/types/hooks'

import { TransactionActivityListEventColumn } from './TransactionActivityListEventColumn'
import { TransactionActivityListEventColumnDataAddress } from './TransactionActivityListEventColumnDataAddress'
import { TransactionActivityListTooltip } from './TransactionActivityListTooltip'

type TProps = {
  event: TUseTransactionsTransactionEvent
}

export const TransactionActivityListEvent = ({ event }: TProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'transactionActivityList.event' })
  const { t: tCommon } = useTranslation('common')

  const { amount, to, toUrl, toAccount, from, fromUrl, fromAccount } = event
  const toName = toAccount?.name
  const fromName = fromAccount?.name

  return (
    <div className="flex h-13 max-h-13 min-h-13 grow items-center gap-x-2 overflow-x-auto overflow-y-hidden px-2 whitespace-nowrap">
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
          const { nft } = matchedEvent
          const nftName = nft?.name
          const nftImageLabel = nftName ? t('nftImageAltWithNameLabel', { name: nftName }) : t('nftImageAltLabel')

          return (
            <Fragment>
              {!!nft?.hash && <TransactionActivityListEventColumn label={t('columns.tokenIdLabel')} data={nft.hash} />}

              {!!nftName && (
                <TransactionActivityListEventColumn
                  label={t('columns.nameLabel')}
                  data={nftName}
                  url={nft.explorerUri}
                />
              )}

              {!!nft?.collection?.name && (
                <TransactionActivityListEventColumn
                  label={t('columns.collectionNameLabel')}
                  data={nft.collection.name}
                />
              )}

              {!!nft?.image && (
                <TransactionActivityListEventColumn
                  className="mt-2"
                  data={
                    <TransactionActivityListTooltip data={nftImageLabel}>
                      <TbDiamond aria-hidden />
                    </TransactionActivityListTooltip>
                  }
                  url={nft.explorerUri}
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

          return (
            <TransactionActivityListEventColumn
              label={t('columns.tokenLabel')}
              data={
                !hasTokenLabel ? (
                  <span className="inline-block">{tCommon('general.emptyColumn')}</span>
                ) : (
                  <TransactionActivityListTooltip className="uppercase" data={tokenName || tokenSymbol}>
                    <div className="inline-block truncate uppercase">{tokenSymbol || tokenName}</div>
                  </TransactionActivityListTooltip>
                )
              }
            />
          )
        })}
    </div>
  )
}
