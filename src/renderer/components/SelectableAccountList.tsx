import { BlockchainIcon } from '@renderer/components/BlockchainIcon'
import { Separator } from '@renderer/components/Separator'

import { StringHelper } from '@renderer/helpers/StringHelper'
import { StyleHelper } from '@renderer/helpers/StyleHelper'

import TbChevronRight from '@renderer/assets/images/tb-chevron-right.svg?react'

import type { IAccountState } from '@shared/types/store'

type TProps = {
  accounts: IAccountState[]
  selectedAccountId?: string
  onSelectAccount: (account: IAccountState) => void
  showArrow?: boolean
  className?: string
}

export const SelectableAccountList = ({
  accounts,
  selectedAccountId,
  onSelectAccount,
  showArrow = true,
  className = '',
}: TProps) => {
  return (
    <ul className={StyleHelper.mergeStyles('my-2.5 min-h-0 overflow-y-auto rounded', className)}>
      {accounts.map((account, index, array) => (
        <li key={account.id}>
          <button
            aria-selected={selectedAccountId === account.id}
            onClick={() => onSelectAccount(account)}
            className="flex w-full cursor-pointer items-center justify-between gap-2.5 px-2.5 py-3.5 transition-colors hover:bg-gray-300/15 aria-selected:bg-gray-300/15 aria-selected:hover:bg-gray-300/30"
          >
            <div className="min-w-0 text-left">
              <div className="flex min-w-0 items-center gap-5">
                <BlockchainIcon blockchain={account.blockchain} className="h-4 min-h-4 w-4 min-w-4 text-gray-100" />
                <p className="truncate text-sm text-white">{account.name}</p>
              </div>

              <p className="mt-0.5 ml-9 truncate text-xs text-gray-400">
                {StringHelper.truncateMiddle(account.address, 10)}
              </p>
            </div>

            {showArrow && (
              <TbChevronRight aria-hidden className="h-6 max-h-6 min-h-6 w-6 max-w-6 min-w-6 text-gray-300" />
            )}
          </button>

          {index + 1 !== array.length && <Separator />}
        </li>
      ))}
    </ul>
  )
}
