import { Fragment, useEffect, useState } from 'react'

import { BSBigNumberHelper } from '@cityofzion/blockchain-service'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { NEON_ICONS_URL } from '@shared/constants/urls'
import type { TBlockchainServiceKey } from '@shared/types/blockchain'

import { Tooltip } from '../Tooltip'
import type { TGreyTokenSelectToken } from '.'

type TProps = {
  token: TGreyTokenSelectToken
  blockchain?: TBlockchainServiceKey
  textClassName?: string
}

const defaultTokenImageUrl = `${NEON_ICONS_URL}/tokens/default-token.png`

export const GreyTokenSelectItem = ({ token, blockchain, textClassName }: TProps) => {
  const network = token.network || blockchain
  const defaultImageUrl = `${NEON_ICONS_URL}/tokens/${blockchain || token.network}/${token.hash}.png`

  const [img, setImg] = useState(defaultImageUrl)

  const handleError = () => {
    const tokenImageUrl = token.imageUrl

    setImg(!!tokenImageUrl && img !== tokenImageUrl ? tokenImageUrl : defaultTokenImageUrl)
  }

  useEffect(() => {
    setImg(defaultImageUrl)
  }, [defaultImageUrl])

  return (
    <Fragment>
      <img src={img} alt={token.symbol} className="h-4 w-4 rounded-full" onError={handleError} />

      <span className="flex min-w-0 flex-grow items-center">
        <Tooltip title={network ? `${token.symbol} | ${network}` : ''} contentProps={{ className: 'uppercase' }}>
          <span
            className={StyleHelper.mergeStyles(
              'flex w-fit min-w-0 items-center gap-x-1 text-left text-sm whitespace-nowrap uppercase',
              textClassName
            )}
          >
            <span className="text-white">{token.symbol}</span>
            {network && <span className="min-w-8 truncate text-gray-100">| {network}</span>}
          </span>
        </Tooltip>
      </span>

      {token.amount && (
        <span className="text-1xs text-neon truncate">
          {BSBigNumberHelper.format(token.amount, { decimals: token.decimals })}
        </span>
      )}
    </Fragment>
  )
}
