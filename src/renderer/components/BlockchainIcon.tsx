import React from 'react'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { ICONS_BY_BLOCKCHAIN } from '@shared/constants/blockchain'
import type { TBlockchainServiceKey } from '@shared/types/blockchain'

type Props = React.SVGProps<SVGSVGElement> & {
  blockchain: TBlockchainServiceKey
}

export const BlockchainIcon = React.memo(({ blockchain, ...props }: Props) => {
  const Component = ICONS_BY_BLOCKCHAIN[blockchain]

  return (
    <Component
      {...props}
      className={StyleHelper.mergeStyles('h-4 w-4 object-contain text-gray-100', props.className)}
    />
  )
})
