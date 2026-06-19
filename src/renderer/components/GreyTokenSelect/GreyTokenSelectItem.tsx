import { Fragment, useEffect, useState } from 'react'

import { BSBigHumanAmount } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'

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
  const { t: tCommonBlockchain } = useTranslation('common', { keyPrefix: 'blockchain' })
  const { network } = token
  const blockchainName = blockchain ? tCommonBlockchain(blockchain) : network
  const defaultImageUrl = `${ConstantsHelper.neonIconsUrl}/tokens/${blockchain || network}/${token.hash}.png`

  const [img, setImg] = useState(defaultImageUrl)

  const formattedAmount = new BSBigHumanAmount(token.amount, token.decimals).toFormatted()

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
        <Tooltip
          title={blockchainName ? `${token.symbol} | ${blockchainName}` : ''}
          contentProps={{ className: 'uppercase' }}
        >
          <span
            className={StyleHelper.mergeStyles(
              'inline-block min-w-0 truncate text-left text-sm whitespace-nowrap uppercase',
              textClassName
            )}
          >
            <span className="text-white">{StringHelper.truncate(token.symbol, 4)}</span>
            {blockchainName && <span className="text-gray-100">{` | ${blockchainName}`}</span>}
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
