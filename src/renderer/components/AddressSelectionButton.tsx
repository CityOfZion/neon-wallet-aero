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
      variant="text"
      colorSchema="neon"
      className={StyleHelper.mergeStyles(
        'bg-asphalt aria-[disabled=false]:hover:bg-asphalt/60 flex h-12 w-32 max-w-36 min-w-32 items-center gap-2 rounded',
        {
          'opacity-50': disabled,
          'bg-gray-300/15 aria-[disabled=false]:hover:bg-gray-300/30': !disabled && hasAddress,
        }
      )}
      textClassName={StyleHelper.mergeStyles({ 'grow-0 text-white': hasAddress })}
      iconsOnEdge
      disabled={disabled}
      leftIcon={
        showIcon ? (
          <BlockchainIcon blockchain={blockchain} className="size-4 max-h-4 min-h-4 max-w-4 min-w-4" />
        ) : undefined
      }
      onClick={onClick}
    />
  )
}
