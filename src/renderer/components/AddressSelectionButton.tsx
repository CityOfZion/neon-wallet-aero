import { StringHelper } from '@renderer/helpers/StringHelper'
import { StyleHelper } from '@renderer/helpers/StyleHelper'
import { TBlockchainServiceKey } from '@shared/types/blockchain'

import { BlockchainIcon } from './BlockchainIcon'
import { Button } from './Button'

type TProps = {
  blockchain?: TBlockchainServiceKey
  address?: string | null
  disabled?: boolean
  placeholder: string
  onClick?: () => void
}

export const AddressSelectionButton = ({ blockchain, address, disabled, placeholder, onClick }: TProps) => {
  const hasAddress = !!address
  const showIcon = !disabled && hasAddress && blockchain

  return (
    <Button
      clickableProps={{
        className: StyleHelper.mergeStyles(
          'aria-disabled:bg-transparent aria-[disabled=false]:bg-transparent aria-[disabled=false]:hover:bg-transparent w-32 aria-disabled:text-neon aria-disabled:cursor-default px-1',
          {
            'aria-[disabled=false]:text-neon': !hasAddress,
          }
        ),
      }}
      className={StyleHelper.mergeStyles(
        'bg-asphalt flex h-12 w-32 items-center gap-2 rounded px-2 not-disabled:hover:bg-gray-300/30',
        {
          'opacity-50': disabled,
          'not-disabled:bg-gray-300/20': !disabled && hasAddress,
        }
      )}
      leftIcon={showIcon ? <BlockchainIcon blockchain={blockchain} className="h-4 min-h-4 w-4 min-w-4" /> : undefined}
      iconsOnEdge
      variant="card"
      disabled={disabled}
      onClick={onClick}
      colorSchema="white"
      label={hasAddress ? StringHelper.truncateMiddle(address, 8) : placeholder}
    />
  )
}
