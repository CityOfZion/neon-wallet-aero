import { Fragment, useMemo, useState } from 'react'

import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

import { StringHelper } from '@renderer/helpers/StringHelper'
import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { useAccountsWithWalletSelector } from '@renderer/hooks/useAccountSelector'
import { useWalletsSelector } from '@renderer/hooks/useWalletSelector'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import type { TAccount, TAccountType } from '@shared/types/store'

import { BlockchainIcon } from './BlockchainIcon'
import { Loader } from './Loader'
import { Select } from './Select'

type TProps = {
  selectedAccount?: TAccount | null
  onSelect: (account: TAccount) => void
  children?: JSX.Element
  blockchains?: TBlockchainServiceKey[]
  disabled?: boolean
  withoutIndicator?: boolean
  loading?: boolean
  placeholder?: string
  triggerClassName?: string
  accountTypes?: TAccountType[]
}

export const GreyAccountSelect = ({
  onSelect,
  selectedAccount,
  blockchains,
  children,
  disabled = false,
  withoutIndicator,
  loading,
  triggerClassName,
  accountTypes = ['standard', 'hardware'],
}: TProps) => {
  const { accountsWithWallet } = useAccountsWithWalletSelector()
  const { walletsRef } = useWalletsSelector()
  const { t } = useTranslation('components', { keyPrefix: 'greyAccountSelect' })

  const [open, setOpen] = useState(false)

  const filteredAccounts = useMemo(() => {
    let filtered = accountsWithWallet.filter(account => (accountTypes ? accountTypes.includes(account.type) : true))

    if (blockchains) {
      filtered = filtered.filter(account => blockchains.includes(account.blockchain))
    }

    return filtered
  }, [accountsWithWallet, blockchains, accountTypes])

  const isDisabled = loading || disabled || filteredAccounts.length === 0

  const handleChangeValue = (value: string) => {
    const account = accountsWithWallet.find(account => account.id === value)
    if (!account) return

    onSelect(account)
    setOpen(false)
  }

  return (
    <Select.Root open={open} onOpenChange={setOpen} value={selectedAccount?.id || ''} onValueChange={handleChangeValue}>
      {children ? (
        <Select.RawTrigger asChild disabled={isDisabled}>
          {children}
        </Select.RawTrigger>
      ) : (
        <Select.Trigger
          disabled={isDisabled}
          className={StyleHelper.mergeStyles(
            'bg-asphalt aria-expanded:bg-asphalt aria-[disabled=false]:hover:bg-asphalt/60 flex h-12 w-32 max-w-36 min-w-32 items-center justify-center px-2 aria-[disabled=false]:hover:cursor-pointer',
            {
              'aria-[disabled=false]:hover:bg-asphalt/60': !selectedAccount && !open && !isDisabled,
              'bg-gray-300/15 aria-[disabled=false]:hover:bg-gray-300/30': !isDisabled && !open && selectedAccount,
              'opacity-50': isDisabled,
            },
            triggerClassName
          )}
        >
          {match({ loading, isSelectedAccount: !!selectedAccount })
            .with({ loading: true }, () => <Loader />)
            .with({ isSelectedAccount: true }, () => (
              <div className="flex min-w-0 items-center gap-x-2 whitespace-nowrap">
                <BlockchainIcon blockchain={selectedAccount!.blockchain} type="gray" />

                <span className="text-start text-white">
                  {StringHelper.truncateMiddle(selectedAccount!.address, 8)}
                </span>
              </div>
            ))
            .otherwise(() => (
              <span className="text-neon w-full text-center font-medium">{t('placeholder')}</span>
            ))}
        </Select.Trigger>
      )}

      <Select.Content align="end" side="bottom" className="max-h-54 max-w-48" isTriggerWidth={false}>
        {match(filteredAccounts.length)
          .with(0, () => <p className="py-2.5 text-center text-xs text-gray-100">{t('empty')}</p>)
          .otherwise(() =>
            filteredAccounts.map((account, index) => {
              const wallet = walletsRef.current?.find(wallet => wallet.id === account.idWallet)

              return (
                <Fragment key={`grey-account-select-item-${account.id}`}>
                  <Select.Item value={account.id} className="justify-start gap-2.5">
                    <BlockchainIcon
                      className="min-size-4 max-size-4 size-4"
                      blockchain={account.blockchain}
                      type="gray"
                    />

                    <div className="flex min-w-0 flex-grow flex-col gap-0.5">
                      <Select.ItemText>{StringHelper.truncateMiddle(account.address, 8)}</Select.ItemText>

                      <span className="text-1xs truncate text-left text-gray-100">
                        {`${account.name} | ${wallet?.name}`}
                      </span>
                    </div>

                    {!withoutIndicator && <Select.ItemRadialIndicator />}
                  </Select.Item>

                  {index + 1 !== filteredAccounts.length && <Select.Separator />}
                </Fragment>
              )
            })
          )}
      </Select.Content>
    </Select.Root>
  )
}
