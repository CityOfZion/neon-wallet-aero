import { useEffect, useMemo, useRef, useState } from 'react'

import { useVirtualizer } from '@tanstack/react-virtual'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { RemoveScroll } from 'react-remove-scroll'
import { match } from 'ts-pattern'

import { StringHelper } from '@renderer/helpers/StringHelper'
import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { useAccountsWithWalletSelector } from '@renderer/hooks/useAccountSelector'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import type { TAccount, TAccountType, TAccountWithWallet } from '@shared/types/store'

import { BlockchainIcon } from './BlockchainIcon'
import { Command } from './Command'
import { Loader } from './Loader'
import { Popover, type TPopoverContentProps } from './Popover'
import { Separator } from './Separator'
import { Tooltip } from './Tooltip'

type TPlacement = 'overlap' | 'dropdownEnd'

const placementProps: Record<TPlacement, Pick<TPopoverContentProps, 'align' | 'sideOffset'>> = {
  overlap: { align: 'end', sideOffset: -48 },
  dropdownEnd: { align: 'end', sideOffset: 8 },
}

type TProps<N extends TBlockchainServiceKey> = {
  selectedAccount?: TAccount<N> | null
  selectedAccountTruncateLength?: number
  onSelect: (account: TAccount<N>) => void
  children?: JSX.Element
  blockchains?: N[]
  disabled?: boolean
  withoutIndicator?: boolean
  loading?: boolean
  placeholder?: string
  triggerClassName?: string
  contentClassName?: string
  accountTypes?: TAccountType[]
  placement?: TPlacement
}

export const GreyAccountSelect = <N extends TBlockchainServiceKey>({
  onSelect,
  selectedAccount,
  selectedAccountTruncateLength,
  blockchains,
  children,
  disabled = false,
  loading = false,
  placeholder,
  triggerClassName,
  contentClassName,
  accountTypes = ['standard', 'hardware'],
  placement = 'dropdownEnd',
}: TProps<N>) => {
  const { accountsWithWallet } = useAccountsWithWalletSelector()
  const { t } = useTranslation('components', { keyPrefix: 'greyAccountSelect' })

  const [filter, setFilter] = useState('')
  const [open, setOpen] = useState(false)

  const ref = useRef<HTMLDivElement>(null)

  const filteredAccounts = useMemo(() => {
    let filtered = accountsWithWallet.filter(account => (accountTypes ? accountTypes.includes(account.type) : true))

    if (blockchains) {
      filtered = filtered.filter(account => blockchains.includes(account.blockchain as N))
    }

    return filtered
  }, [accountsWithWallet, blockchains, accountTypes])

  const isDisabled = loading || disabled || filteredAccounts.length === 0

  const filteredAccountsByText = useMemo(() => {
    const newFilter = filter.toLowerCase().trim()
    if (!newFilter) return filteredAccounts

    return filteredAccounts.filter(
      account =>
        account.name.toLowerCase().includes(newFilter) ||
        account.address.toLowerCase().includes(newFilter) ||
        account.blockchain.toLowerCase().includes(newFilter) ||
        account.wallet.name.toLowerCase().includes(newFilter)
    )
  }, [filter, filteredAccounts])

  const rowVirtualizer = useVirtualizer({
    count: filteredAccountsByText.length,
    getScrollElement: () => ref.current,
    estimateSize: () => 50,
  })

  const handleAccountSelection = (account: TAccountWithWallet) => {
    onSelect(account as unknown as TAccount<N>)
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
      {children ? (
        <Popover.Trigger asChild disabled={isDisabled}>
          {children}
        </Popover.Trigger>
      ) : (
        <Popover.Trigger
          disabled={isDisabled}
          aria-disabled={isDisabled}
          className={StyleHelper.mergeStyles(
            'bg-asphalt aria-expanded:bg-asphalt aria-[disabled=false]:hover:bg-asphalt/60 flex h-12 w-32 max-w-36 min-w-32 items-center justify-center px-2 text-sm aria-[disabled=false]:hover:cursor-pointer',
            {
              'aria-[disabled=false]:hover:bg-asphalt/60': !selectedAccount && !open && !isDisabled,
              'bg-gray-300/15 aria-[disabled=false]:hover:bg-gray-300/30': !isDisabled && !open && selectedAccount,
              'opacity-50': isDisabled,
            },
            triggerClassName
          )}
        >
          {match({ loading, hasSelectedAccount: !!selectedAccount })
            .with({ loading: true }, () => <Loader />)
            .with({ hasSelectedAccount: true }, () => (
              <div className="flex min-w-0 items-center gap-x-2 whitespace-nowrap">
                <BlockchainIcon blockchain={selectedAccount!.blockchain} />

                <span className="text-start text-white">
                  {StringHelper.truncateMiddle(selectedAccount!.address, selectedAccountTruncateLength || 8)}
                </span>
              </div>
            ))
            .otherwise(() => (
              <span className="text-neon w-full text-center font-medium">{placeholder || t('placeholder')}</span>
            ))}
        </Popover.Trigger>
      )}

      <Popover.Content
        side="bottom"
        className={StyleHelper.mergeStyles('w-48 max-w-48 min-w-48 bg-transparent', contentClassName)}
        {...placementProps[placement]}
      >
        <RemoveScroll>
          <Command.Root shouldFilter={false}>
            <Command.Input value={filter} onValueChange={setFilter} />

            <Command.List ref={ref} className="max-h-44 overflow-y-auto">
              <Command.Empty>{t('empty')}</Command.Empty>

              <Command.Group className="relative w-full" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
                {rowVirtualizer.getVirtualItems().map(virtualItem => {
                  const account = filteredAccountsByText[virtualItem.index]

                  return (
                    <Command.Item
                      key={virtualItem.key}
                      value={`${account.id}-${virtualItem.key}`}
                      onSelect={() => handleAccountSelection(account)}
                      className="group/item absolute top-0 left-0 w-full cursor-pointer flex-col"
                      style={{
                        height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                    >
                      <span className="flex size-full items-center gap-2.5 px-2">
                        <BlockchainIcon
                          className="min-size-4 max-size-4 size-4 text-gray-100"
                          blockchain={account.blockchain}
                        />

                        <span className="flex min-w-0 grow flex-col gap-0.5">
                          <Tooltip title={account.address}>
                            <span className="w-fit text-sm text-white">
                              {StringHelper.truncateMiddle(account.address, 8)}
                            </span>
                          </Tooltip>

                          <span className="text-1xs truncate text-left text-gray-100">
                            {`${account.name} | ${account.wallet.name}`}
                          </span>
                        </span>
                      </span>

                      <Separator className="group-last/item:hidden" />
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
