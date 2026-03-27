import { Fragment } from 'react'

import { useTranslation } from 'react-i18next'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { StyleHelper } from '@renderer/helpers/StyleHelper'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'

import { BlockchainIcon } from './BlockchainIcon'
import { Select } from './Select'

type TProps = {
  value?: TBlockchainServiceKey
  onSelect?: (blockchain: TBlockchainServiceKey) => void
}

export const BlockchainSelect = ({ value, onSelect }: TProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'blockchainSelect' })
  const { t: tCommonBlockchain } = useTranslation('common', { keyPrefix: 'blockchain' })

  return (
    <Select.Root value={value} onValueChange={onSelect}>
      <Select.Trigger
        className={StyleHelper.mergeStyles('bg-asphalt h-12', {
          'text-gray-300': !value,
        })}
      >
        <Select.Value placeholder={t('selectPlaceholder')}>
          {value && (
            <div className="flex items-center gap-x-2 text-sm text-gray-100">
              <BlockchainIcon blockchain={value} type="white" />
              {tCommonBlockchain(value)}
            </div>
          )}
        </Select.Value>

        <Select.Icon className="text-neon" />
      </Select.Trigger>

      <Select.Content>
        {BlockchainServiceHelper.blockchainNames.map((blockchain, index) => (
          <Fragment key={blockchain}>
            <Select.Item
              value={blockchain}
              className="flex h-10 items-center justify-start gap-x-2 text-sm text-gray-100 hover:bg-gray-300/15 focus:bg-gray-300/15"
            >
              <BlockchainIcon blockchain={blockchain} type="white" />
              <Select.ItemText>{tCommonBlockchain(blockchain)}</Select.ItemText>
            </Select.Item>

            {index + 1 !== BlockchainServiceHelper.blockchainNames.length && <Select.Separator />}
          </Fragment>
        ))}
      </Select.Content>
    </Select.Root>
  )
}
