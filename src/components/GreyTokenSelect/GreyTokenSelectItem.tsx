import { Fragment, useEffect, useState } from 'react'
import { BSBigNumberHelper } from '@cityofzion/blockchain-service'

import defaultTokenLogo from '@/assets/images/default-token-logo.png'

import { Tooltip } from '../Tooltip'

import { TGreyTokenSelectToken } from '.'

type TProps = {
  token: TGreyTokenSelectToken
}

export const GreyTokenSelectItem = ({ token }: TProps) => {
  const [img, setImg] = useState(token.imageUrl ?? defaultTokenLogo)

  useEffect(() => {
    setImg(token.imageUrl ?? defaultTokenLogo)
  }, [token])

  return (
    <Fragment>
      <img
        src={img}
        className="h-4 w-4 rounded-full"
        onError={() => {
          setImg(defaultTokenLogo)
          token.imageUrl = defaultTokenLogo
        }}
        alt={token.symbol}
      />

      <Tooltip title={token.network ? `${token.symbol} | ${token.network}` : ''}>
        <span className="flex flex-grow items-center gap-1">
          <span className="text-left text-sm text-white uppercase">{token.symbol}</span>
          {token.network && <span className="truncate text-sm text-gray-100 uppercase">{` | ${token.network}`}</span>}
        </span>
      </Tooltip>

      {token.amount && (
        <span className="text-1xs text-neon truncate">
          {BSBigNumberHelper.format(token.amount, { decimals: token.decimals })}
        </span>
      )}
    </Fragment>
  )
}
