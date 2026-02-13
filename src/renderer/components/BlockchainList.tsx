import { useTranslation } from 'react-i18next'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { StyleHelper } from '@renderer/helpers/StyleHelper'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'

import { BlockchainIcon } from './BlockchainIcon'
import { Checkbox } from './Checkbox'

type TProps = {
  selectedBlockchains?: TBlockchainServiceKey[]
  isMulti?: boolean
  className?: string
  onSelect: (blockchains: TBlockchainServiceKey[]) => void
}

export const BlockchainList = ({ onSelect, selectedBlockchains = [], isMulti = false, className }: TProps) => {
  const { t: tCommonBlockchain } = useTranslation('common', { keyPrefix: 'blockchain' })

  const handleSelect = (blockchain: TBlockchainServiceKey) => {
    if (isMulti) {
      onSelect(
        selectedBlockchains.includes(blockchain)
          ? selectedBlockchains.filter(selectedBlockchain => selectedBlockchain !== blockchain)
          : [...selectedBlockchains, blockchain]
      )
      return
    }

    onSelect([blockchain])
  }

  return (
    <ul className={StyleHelper.mergeStyles('flex h-0 grow flex-col gap-2 overflow-auto text-sm', className)}>
      {BlockchainServiceHelper.blockchainNames.map(blockchain => {
        const isSelected = selectedBlockchains.includes(blockchain)

        return (
          <li key={blockchain} className="bg-asphalt flex grow items-center rounded border-none">
            <label className="flex w-full cursor-pointer items-center gap-2.5 px-6 py-4">
              <BlockchainIcon blockchain={blockchain} className="text-gray-100" />
              <span className="flex grow">{tCommonBlockchain(blockchain)}</span>
              <Checkbox
                value={blockchain}
                onCheckedChange={() => handleSelect(blockchain)}
                checked={isSelected}
                className="rounded-sm"
              />
            </label>
          </li>
        )
      })}
    </ul>
  )
}
