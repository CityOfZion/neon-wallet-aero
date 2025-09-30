import { useRef } from 'react'
import { useBalance } from '@renderer/hooks/useBalances'
import { useVirtualization } from '@renderer/hooks/useVirtualization'
import { IAccountState } from '@shared/types/store'
import { match } from 'ts-pattern'

import { Separator } from '../Separator'

import { TokenListEmpty } from './TokenListEmpty'
import { TokenListItem } from './TokenListItem'
import { TokenListSkeleton } from './TokenListSkeleton'

type TProps = {
  selectedAccount: IAccountState
}

export const TokenList = ({ selectedAccount }: TProps) => {
  const { isLoading, data: balance } = useBalance(selectedAccount)

  const tokenBalances = balance?.tokensBalances ?? []

  const contentRef = useRef<HTMLUListElement>(null)

  const virtualizer = useVirtualization({
    contentRef,
    count: tokenBalances.length,
    estimateSize: () => 62,
    gap: 8,
    overscan: 5,
  })

  return match({ isLoading, tokenBalances })
    .with({ isLoading: true }, () => <TokenListSkeleton />)
    .with({ tokenBalances: [] }, () => <TokenListEmpty />)
    .otherwise(() => (
      <ul className="flex min-w-0 flex-col gap-1" ref={contentRef}>
        {virtualizer.getVirtualItems().map(virtualItem => {
          const tokenBalance = tokenBalances[virtualItem.index]

          return (
            <li
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <TokenListItem tokenBalance={tokenBalance} />

              {virtualItem.index + 1 !== tokenBalances.length && <Separator />}
            </li>
          )
        })}
      </ul>
    ))
}
