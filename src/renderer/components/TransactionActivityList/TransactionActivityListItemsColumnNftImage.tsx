import type { TNftResponse } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { TransactionActivityListItemsColumn } from './TransactionActivityListItemsColumn'
import { TransactionActivityListTooltip } from './TransactionActivityListTooltip'

type TProps = {
  nft: TNftResponse
  className?: string
}

export const TransactionActivityListItemsColumnNftImage = ({ nft, className }: TProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'transactionActivityList.items' })

  if (!nft.image) return null

  const nftName = nft.name
  const nftImageLabel = nftName ? t('nftImageAltWithNameLabel', { name: nftName }) : t('nftImageAltLabel')

  return (
    <TransactionActivityListItemsColumn
      className={StyleHelper.mergeStyles(
        'mt-0.5 mr-0 mb-0 ml-auto flex w-18 max-w-18 min-w-18 grow items-end justify-center',
        className
      )}
      data={
        <TransactionActivityListTooltip data={nftImageLabel}>
          <div>
            <img
              className="pointer-events-none max-h-8 w-full max-w-16 rounded-sm select-none"
              src={nft.image}
              alt={nftImageLabel}
            />
          </div>
        </TransactionActivityListTooltip>
      }
      url={nft.explorerUri}
    />
  )
}
