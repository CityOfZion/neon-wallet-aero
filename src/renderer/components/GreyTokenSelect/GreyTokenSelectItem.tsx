import { Fragment, useEffect, useState } from 'react'
import { BSBigNumberHelper } from '@cityofzion/blockchain-service'
import defaultTokenLogo from '@renderer/assets/images/default-token-logo.png'
import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { Tooltip } from '../Tooltip'

import { TGreyTokenSelectToken } from '.'

type TProps = {
  token: TGreyTokenSelectToken
  textClassName?: string
}

export const GreyTokenSelectItem = ({ token, textClassName }: TProps) => {
  const [img, setImg] = useState(token.imageUrl ?? defaultTokenLogo)

  const network = token.network || token.blockchain

  useEffect(() => {
    setImg(token.imageUrl ?? defaultTokenLogo)
  }, [token])

  return (
    <Fragment>
      <img
        src={img}
        alt={token.symbol}
        className="h-4 w-4 rounded-full"
        onError={() => {
          setImg(defaultTokenLogo)
          // eslint-disable-next-line react-hooks/immutability
          token.imageUrl = defaultTokenLogo
        }}
      />

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
