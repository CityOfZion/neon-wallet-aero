import { StringHelper } from '@renderer/helpers/StringHelper'

import MdCheck from '@renderer/assets/images/md-check.svg?react'

import type { TAccount } from '@shared/types/store'

type TProps = {
  accounts: TAccount[]
}

export const MigrateFromNeon2SuccessContent = ({ accounts }: TProps) => (
  <ul className="mt-7 flex min-h-0 w-full flex-col gap-1.5 overflow-auto">
    {accounts.map(account => (
      <li key={account.id} className="flex items-center gap-x-2 rounded bg-gray-300/15 px-5 py-2">
        <div className="flex min-w-0 grow flex-col gap-1">
          <p className="text-sm text-white">{account.name}</p>
          <p className="text-xs whitespace-nowrap text-gray-300">{StringHelper.truncateMiddle(account.address, 42)}</p>
        </div>
        <MdCheck aria-hidden className="text-green min-size-4.5 max-size-4.5 size-4.5" />
      </li>
    ))}
  </ul>
)
