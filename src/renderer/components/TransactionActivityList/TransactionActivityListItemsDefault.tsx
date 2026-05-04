import { Fragment } from 'react'

import type { TTransactionDefault } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

import { Separator } from '@renderer/components/Separator'

import { AccountHelper } from '@renderer/helpers/AccountHelper'
import { StringHelper } from '@renderer/helpers/StringHelper'

import { useAccountsMapSelector } from '@renderer/hooks/useAccountSelector'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'

import { TransactionActivityListItemsColumn } from './TransactionActivityListItemsColumn'
import { TransactionActivityListItemsColumnDataAddress } from './TransactionActivityListItemsColumnDataAddress'
import { TransactionActivityListItemsColumnNftImage } from './TransactionActivityListItemsColumnNftImage'
import { TransactionActivityListTooltip } from './TransactionActivityListTooltip'

type TProps = {
  transaction: TTransactionDefault<TBlockchainServiceKey>
}

export const TransactionActivityListItemsDefault = ({ transaction }: TProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'transactionActivityList.items' })
  const { t: tCommonGeneral } = useTranslation('common', { keyPrefix: 'general' })
  const { accountsMap } = useAccountsMapSelector()

  if (transaction.events.length === 0) return null

  const blockchain = transaction.blockchain

  return (
    <ul className="flex w-full flex-col">
      {transaction.events.map((event, index) => {
        const { amount, to, toUrl, from, fromUrl } = event

        let hash: string | undefined
        if (event.eventType === 'nft') {
          hash = event.nft?.hash
        } else if (event.eventType === 'token') {
          hash = event.token?.hash
        }

        const fromAccount = from
          ? accountsMap.get(AccountHelper.buildAccountKey({ address: from, blockchain }))
          : undefined
        const toAccount = to ? accountsMap.get(AccountHelper.buildAccountKey({ address: to, blockchain })) : undefined

        return (
          <li
            key={`${event.eventType}-${hash}-${event.methodName}-${transaction.blockchain}-${index}`}
            className="group/item flex h-14 max-h-14 min-h-14 w-full flex-col justify-center"
          >
            <div className="flex h-13.75 max-h-13.75 min-h-13.75 grow items-center gap-x-2 overflow-x-auto overflow-y-hidden px-2 whitespace-nowrap">
              <TransactionActivityListItemsColumn
                label={t('columns.fromLabel')}
                data={
                  !from ? (
                    <span className="inline-block">{tCommonGeneral('emptyColumn')}</span>
                  ) : (
                    <TransactionActivityListItemsColumnDataAddress address={from} accountName={fromAccount?.name} />
                  )
                }
                url={fromUrl}
              />

              <TransactionActivityListItemsColumn
                label={t('columns.toLabel')}
                data={
                  !to ? (
                    <span className="inline-block">{tCommonGeneral('emptyColumn')}</span>
                  ) : (
                    <TransactionActivityListItemsColumnDataAddress address={to} accountName={toAccount?.name} />
                  )
                }
                url={toUrl}
              />

              <TransactionActivityListItemsColumn
                label={t('columns.amountLabel')}
                data={
                  !amount ? (
                    <span className="inline-block">{tCommonGeneral('emptyColumn')}</span>
                  ) : (
                    <TransactionActivityListTooltip data={amount}>
                      <span className="inline-block truncate">{amount}</span>
                    </TransactionActivityListTooltip>
                  )
                }
              />

              {match(event)
                .with({ eventType: 'nft' }, matchedEvent => {
                  const { nft } = matchedEvent

                  return (
                    <Fragment>
                      {!!nft?.hash && (
                        <TransactionActivityListItemsColumn
                          label={t('columns.tokenHashLabel')}
                          data={
                            <TransactionActivityListTooltip data={nft.hash}>
                              <span className="inline-block">{StringHelper.truncateMiddle(nft.hash, 8)}</span>
                            </TransactionActivityListTooltip>
                          }
                          url={nft.explorerUri}
                        />
                      )}

                      {!!nft?.name && (
                        <TransactionActivityListItemsColumn
                          label={t('columns.nameLabel')}
                          data={nft.name}
                          url={nft.explorerUri}
                        />
                      )}

                      {!!nft?.collection?.name && (
                        <TransactionActivityListItemsColumn
                          label={t('columns.collectionLabel')}
                          data={nft.collection.name}
                          url={nft.collection.url}
                        />
                      )}

                      {nft && <TransactionActivityListItemsColumnNftImage nft={nft} />}
                    </Fragment>
                  )
                })
                .with({ eventType: 'token' }, matchedEvent => {
                  const { token } = matchedEvent
                  const tokenSymbol = token?.symbol || ''
                  const tokenName = token?.name || ''
                  const hasTokenLabel = !!tokenSymbol || !!tokenName

                  return (
                    <TransactionActivityListItemsColumn
                      label={t('columns.tokenLabel')}
                      data={
                        !hasTokenLabel ? (
                          <span className="inline-block">{tCommonGeneral('emptyColumn')}</span>
                        ) : (
                          <TransactionActivityListTooltip className="uppercase" data={tokenName || tokenSymbol}>
                            <div className="inline-block truncate uppercase">{tokenSymbol || tokenName}</div>
                          </TransactionActivityListTooltip>
                        )
                      }
                    />
                  )
                })
                .otherwise(matchedEvent => (
                  <Fragment>
                    {!!matchedEvent.data &&
                      Object.entries(matchedEvent.data).map(([key, value]) => (
                        <TransactionActivityListItemsColumn
                          labelClassName="capitalize"
                          key={t(`columnsByKey.${key}`, { defaultValue: key })}
                          label={key}
                          data={!value ? tCommonGeneral('emptyColumn') : value}
                        />
                      ))}
                  </Fragment>
                ))}
            </div>

            <Separator containerClassName="group-last/item:hidden" />
          </li>
        )
      })}
    </ul>
  )
}
