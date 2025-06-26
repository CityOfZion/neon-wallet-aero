import { Fragment } from 'react'
import { BSBigNumberHelper } from '@cityofzion/blockchain-service'

import { BlockchainIcon } from '../BlockchainIcon'
import { Tooltip } from '../Tooltip'

import { TGreyTokenSelectToken } from '.'

type TProps = {
  token: TGreyTokenSelectToken
}

export const GreyTokenSelectItem = ({ token }: TProps) => {
  return (
    <Fragment>
      {/* TODO: Replace by token icon  */}
      <BlockchainIcon
        blockchain={token.blockchain ?? 'neo3'}
        className="text-green mt-1 h-3.5 min-h-3.5 w-3.5 min-w-3.5"
      />
      <Tooltip title={token.network ? `${token.symbol} | ${token.network}` : ''}>
        <span className="flex min-w-0 flex-grow items-center gap-1">
          <span className="text-left text-sm text-white uppercase">{token.symbol}</span>
          {token.network && <span className="truncate text-sm text-gray-100 uppercase">{` | ${token.network}`}</span>}
        </span>
      </Tooltip>

      {token.amount && (
        <span className="text-1xs text-neon">
          {BSBigNumberHelper.format(token.amount, { decimals: token.decimals })}
        </span>
      )}
    </Fragment>
  )
}
