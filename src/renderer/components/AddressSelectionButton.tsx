import { StringHelper } from '@renderer/helpers/StringHelper'
import { StyleHelper } from '@renderer/helpers/StyleHelper'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'

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
      label={hasAddress ? StringHelper.truncateMiddle(address, 8) : placeholder}
      variant="card"
      colorSchema="white"
      className={StyleHelper.mergeStyles(
        'bg-asphalt flex h-12 w-32 max-w-36 min-w-32 items-center gap-2 rounded px-2 not-disabled:hover:bg-gray-300/30',
        {
          'opacity-50': disabled,
          'not-disabled:bg-gray-300/20': !disabled && hasAddress,
        }
      )}
      textClassName={StyleHelper.mergeStyles({ 'grow-0': hasAddress })}
      iconsOnEdge
      disabled={disabled}
      clickableProps={{
        className: StyleHelper.mergeStyles(
          'aria-disabled:bg-transparent justify-start aria-[disabled=false]:bg-transparent aria-[disabled=false]:hover:bg-transparent aria-disabled:text-neon aria-disabled:cursor-default w-full px-0 gap-x-2',
          {
            'aria-[disabled=false]:text-neon': !hasAddress,
          }
        ),
      }}
      leftIcon={
        showIcon ? (
          <BlockchainIcon blockchain={blockchain} className="h-4 max-h-4 min-h-4 w-4 max-w-4 min-w-4" />
        ) : undefined
      }
      onClick={onClick}
    />
  )
}
