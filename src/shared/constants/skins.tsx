import type { ReactNode } from 'react'

import { NEON_ICONS_URL } from '@shared/constants/urls'
import type { TBlockchainServiceKey } from '@shared/types/blockchain'

type TAccountLocalSkin = {
  blockchain: TBlockchainServiceKey
  collectionHash: string
  component: ReactNode
}

export const ACCOUNT_COLOR_SKINS = ['green', 'blue', 'lightBlue', 'magenta', 'yellow', 'purple', 'orange']

export const ACCOUNT_LOCAL_SKINS: Map<string, TAccountLocalSkin> = new Map([
  [
    'coz-face-december-2024',
    {
      blockchain: 'neo3',
      collectionHash: '0x76a8f8a7a901b29a33013b469949f4b08db15756',
      component: <img src={`${NEON_ICONS_URL}/skins/coz-face-december-2024.png`} alt="" />,
    },
  ],
  [
    'neo-christmas-2024',
    {
      blockchain: 'neox',
      collectionHash: '0x6e8789d940928e656ea47941ed93b0596dd40056',
      component: <img src={`${NEON_ICONS_URL}/skins/neo-christmas-2024.png`} alt="" />,
    },
  ],
])

export const LOCAL_SKINS = ACCOUNT_LOCAL_SKINS
