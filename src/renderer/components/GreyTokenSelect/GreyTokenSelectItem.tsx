import { Fragment, useEffect, useState } from 'react'

import { BSBigNumberHelper } from '@cityofzion/blockchain-service'

import { ConstantsHelper } from '@renderer/helpers/ConstantsHelper'
import { StringHelper } from '@renderer/helpers/StringHelper'
import { StyleHelper } from '@renderer/helpers/StyleHelper'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'

import { Tooltip } from '../Tooltip'
import type { TGreyTokenSelectToken } from '.'

type TProps = {
  token: TGreyTokenSelectToken
  blockchain?: TBlockchainServiceKey
  textClassName?: string
}

const defaultTokenImageUrl = `${ConstantsHelper.neonIconsUrl}/tokens/default-token.png`

export const GreyTokenSelectItem = ({ token, blockchain, textClassName }: TProps) => {
  const network = token.network || blockchain
  const defaultImageUrl = `${ConstantsHelper.neonIconsUrl}/tokens/${blockchain || token.network}/${token.hash}.png`

  const [img, setImg] = useState(defaultImageUrl)

  const formattedAmount = BSBigNumberHelper.format(token.amount, { decimals: token.decimals })

  const handleError = () => {
    const tokenImageUrl = token.imageUrl

    setImg(!!tokenImageUrl && img !== tokenImageUrl ? tokenImageUrl : defaultTokenImageUrl)
  }

  useEffect(() => {
    setImg(defaultImageUrl)
  }, [defaultImageUrl])

  return (
    <Fragment>
      <img src={img} alt={token.symbol} className="pointer-events-none size-4 rounded-full" onError={handleError} />

      <span className="flex min-w-0 grow items-center">
        <Tooltip title={network ? `${token.symbol} | ${network}` : ''} contentProps={{ className: 'uppercase' }}>
          <span
            className={StyleHelper.mergeStyles(
              'flex w-fit min-w-0 items-center gap-x-1 text-left text-sm whitespace-nowrap uppercase',
              textClassName
            )}
          >
            <span className="text-white">{StringHelper.truncate(token.symbol, 4)}</span>
            {network && <span className="min-w-8 truncate text-gray-100">| {network}</span>}
          </span>
        </Tooltip>
      </span>

      {token.amount && (
        <Tooltip title={formattedAmount}>
          <span className="text-1xs text-neon inline-block w-fit max-w-14 truncate">{formattedAmount}</span>
        </Tooltip>
      )}
    </Fragment>
  )
}
