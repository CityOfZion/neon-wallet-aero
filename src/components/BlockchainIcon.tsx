import React from 'react'

import { ICONS_BY_BLOCKCHAIN } from '@/constants/blockchain'
import { StyleHelper } from '@/helpers/StyleHelper'
import { TBlockchainServiceKey } from '@/types/blockchain'

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
