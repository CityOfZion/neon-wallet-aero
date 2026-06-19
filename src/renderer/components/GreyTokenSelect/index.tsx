import { useEffect, useMemo, useRef, useState } from 'react'

import { BSBigNumber } from '@cityofzion/blockchain-service'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useTranslation } from 'react-i18next'
import { RemoveScroll } from 'react-remove-scroll'
import { match } from 'ts-pattern'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { StyleHelper } from '@renderer/helpers/StyleHelper'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import type { TBalance } from '@shared/types/query'

import { Command } from '../Command'
import { Loader } from '../Loader'
import { Popover } from '../Popover'
import { Separator } from '../Separator'
import { GreyTokenSelectItem } from './GreyTokenSelectItem'

export type TGreyTokenSelectToken = {
  symbol: string
  imageUrl?: string
  hash?: string
  network?: string
  blockchain?: TBlockchainServiceKey
  amount?: string
  decimals?: number
}

type TProps<T extends TGreyTokenSelectToken> = {
  tokens: T[]
  selectedToken?: T
  onSelect?: (token: T) => void
  loading?: boolean
  balance?: TBalance
  disabled?: boolean
  blockchain?: TBlockchainServiceKey
  className?: string
  textClassName?: string
  sideOffset?: number
}

export const GreyTokenSelect = <T extends TGreyTokenSelectToken>({
  tokens,
  loading = false,
  selectedToken,
  onSelect,
  balance,
  disabled = false,
  blockchain,
  className,
  textClassName,
  sideOffset = -48,
}: TProps<T>) => {
  const [filter, setFilter] = useState('')
  const [open, setOpen] = useState(false)
  const { t } = useTranslation('components', { keyPrefix: 'greyTokenSelect' })

  const parentRef = useRef<HTMLDivElement>(null)

  const fallbackBlockchain = balance?.blockchain || blockchain
  const isDisabled = loading || disabled

  const filteredAndSortedTokens = useMemo(() => {
    let filtered = [...tokens]

    if (blockchain) {
      filtered = filtered.filter(token => token.blockchain === blockchain)
    }

    if (balance) {
      const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[balance.blockchain]

      filtered = filtered.map(token => {
        const tokenBalance = balance.tokensBalances.find(tokenBalance =>
          service.tokenService.predicateByHash(tokenBalance.token, token.hash!)
        )

        return {
          ...token,
          blockchain: token.blockchain || tokenBalance?.blockchain || blockchain,
          amount: tokenBalance?.amount,
        }
      })
    }

    filtered = filtered.sort((a, b) => new BSBigNumber(a.amount || 0).minus(b.amount || 0).toNumber())

    return filtered
  }, [tokens, balance, blockchain])

  const filteredTokensByText = useMemo(() => {
    let filtered = [...filteredAndSortedTokens]
    const newFilter = filter.toLowerCase().trim()

    if (newFilter)
      filtered = filteredAndSortedTokens.filter(token => token.symbol.toLowerCase().trim().includes(newFilter))

    return filtered
  }, [filter, filteredAndSortedTokens])

  const rowVirtualizer = useVirtualizer({
    count: filteredTokensByText.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
  })

  const handleClickToken = (token: T) => {
    onSelect?.(token)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) {
      setFilter('')
      return
    }

    // It is necessary to wait the popover to be opened to measure the height of the parent element
    setTimeout(() => {
      rowVirtualizer._willUpdate()
    }, 0)
  }, [open, rowVirtualizer])

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        disabled={isDisabled}
        aria-disabled={isDisabled}
        className={StyleHelper.mergeStyles(
          'bg-asphalt aria-expanded:bg-asphalt flex h-12 w-32 items-center gap-2 rounded px-2 aria-[disabled=false]:hover:cursor-pointer',
          {
            'aria-[disabled=false]:hover:bg-asphalt/60': !selectedToken && !isDisabled,
            'bg-gray-300/15 aria-[disabled=false]:hover:bg-gray-300/30': !isDisabled && selectedToken,
            'opacity-50': isDisabled,
          },
          className
        )}
      >
        {match({ loading, isTokenSelected: !!selectedToken })
          .with({ loading: true }, () => <Loader />)
          .with({ isTokenSelected: true }, () => (
            <GreyTokenSelectItem
              token={selectedToken!}
              blockchain={selectedToken!.blockchain || fallbackBlockchain}
              textClassName={textClassName}
            />
          ))
          .otherwise(() => (
            <span className="text-neon w-full text-center font-medium">{t('placeholder')}</span>
          ))}
      </Popover.Trigger>

      <Popover.Content className="w-48 max-w-48 min-w-48 bg-transparent" align="end" sideOffset={sideOffset}>
        <RemoveScroll>
          <Command.Root shouldFilter={false}>
            <Command.Input value={filter} onValueChange={setFilter} />

            <Command.List ref={parentRef} className="max-h-44">
              <Command.Empty>{t('empty')}</Command.Empty>

              <Command.Group
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                {rowVirtualizer.getVirtualItems().map(virtualItem => {
                  const row = filteredTokensByText[virtualItem.index]
                  const value = `${row.symbol}-${row.hash}-${virtualItem.key}`

                  return (
                    <Command.Item
                      key={virtualItem.key}
                      value={value}
                      onSelect={() => handleClickToken(row)}
                      className="group/item absolute top-0 left-0 h-10 w-full flex-col"
                      style={{
                        height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                    >
                      <div className="flex size-full items-center gap-2">
                        <GreyTokenSelectItem
                          token={row}
                          blockchain={row.blockchain || fallbackBlockchain}
                          textClassName={textClassName}
                        />
                      </div>

                      <Separator containerClassName="group-last/item:hidden" />
                    </Command.Item>
                  )
                })}
              </Command.Group>
            </Command.List>
          </Command.Root>
        </RemoveScroll>
      </Popover.Content>
    </Popover.Root>
  )
}
