import { useTranslation } from 'react-i18next'

import { Separator } from '@renderer/components/Separator'

import { StringHelper } from '@renderer/helpers/StringHelper'

import type { TUseTransactionsTransactionUtxo } from '@shared/types/hooks'

import { TransactionActivityListItemsColumn } from './TransactionActivityListItemsColumn'
import { TransactionActivityListItemsColumnNftImage } from './TransactionActivityListItemsColumnNftImage'
import { TransactionActivityListItemsUtxoInputOutput } from './TransactionActivityListItemsUtxoInputOutput'
import { TransactionActivityListTooltip } from './TransactionActivityListTooltip'

type TProps = {
  transaction: TUseTransactionsTransactionUtxo
}

export const TransactionActivityListItemsUtxo = ({ transaction: { blockchain, inputs, outputs, nfts } }: TProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'transactionActivityList.items' })
  const { t: tCommonGeneral } = useTranslation('common', { keyPrefix: 'general' })

  const hasInputs = inputs.length > 0
  const hasOutputs = outputs.length > 0
  const hasNfts = nfts.length > 0

  if (!hasInputs && !hasOutputs && !hasNfts) return null

  return (
    <div className="flex w-full flex-col">
      {(hasInputs || hasOutputs) && (
        <div className="grid h-fit grow grid-cols-2 px-2">
          {hasInputs && (
            <ul className="col-start-1 col-end-1 flex flex-col">
              {inputs.map((input, index) => (
                <TransactionActivityListItemsUtxoInputOutput
                  key={`${input.address}-${input.amount}-${blockchain}-${index}`}
                  input={input}
                  blockchain={blockchain}
                  index={index}
                  contentClassName="pr-2"
                />
              ))}
            </ul>
          )}

          {hasOutputs && (
            <ul className="col-start-2 col-end-2 flex flex-col">
              {outputs.map((output, index) => (
                <TransactionActivityListItemsUtxoInputOutput
                  key={`${output.address}-${output.amount}-${blockchain}-${index}`}
                  output={output}
                  blockchain={blockchain}
                  index={index}
                  contentClassName="pl-2"
                />
              ))}
            </ul>
          )}
        </div>
      )}

      {hasNfts && (
        <ul className="flex w-full flex-col">
          {nfts.map(nft => {
            const { hash, name, explorerUri, collection } = nft

            return (
              <li key={hash} className="flex h-14 max-h-14 min-h-14 w-full flex-col items-center">
                <div className="flex h-13.75 max-h-13.75 min-h-13.75 w-full grow items-center justify-between gap-x-2 bg-gray-700/60 px-2">
                  <TransactionActivityListItemsColumn
                    label={t('columns.tokenHashLabel')}
                    data={
                      <TransactionActivityListTooltip data={hash}>
                        <span className="inline-block">{StringHelper.truncateMiddle(hash, 8)}</span>
                      </TransactionActivityListTooltip>
                    }
                    url={explorerUri}
                  />

                  <TransactionActivityListItemsColumn label={t('columns.nameLabel')} data={name} url={explorerUri} />

                  <TransactionActivityListItemsColumn
                    label={t('columns.collectionLabel')}
                    data={collection?.name || tCommonGeneral('emptyColumn')}
                    url={collection?.url}
                  />

                  <TransactionActivityListItemsColumnNftImage nft={nft} className="ml-0 grow-0" />
                </div>

                <Separator className="bg-gray-600" />
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
