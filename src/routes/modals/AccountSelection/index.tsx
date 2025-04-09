import { useTranslation } from 'react-i18next'

import { BlockchainIcon } from '@/components/BlockchainIcon'
import { Button } from '@/components/Button'
import { Separator } from '@/components/Separator'
import { StringHelper } from '@/helpers/StringHelper'
import { useAccountsByWalletIdSelector } from '@/hooks/useAccountSelector'
import { useModalNavigate, useModalState } from '@/hooks/useModalRouter'
import { BottomModalLayout } from '@/layouts/BottomModalLayout'
import { TModalState } from '@/types/modal'
import { IAccountState } from '@/types/store'

import TbChevronRight from '@/assets/images/tb-chevron-right.svg?react'
import TbPlus from '@/assets/images/tb-plus.svg?react'
import TbReorder from '@/assets/images/tb-reorder.svg?react'
import TbWallet from '@/assets/images/tb-wallet.svg?react'

export const AccountSelectionModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'accountSelectionModal' })
  const {
    wallet,
    selectedAccount,
    onSelect,
    shouldGoBackOnSelect = true,
  } = useModalState<TModalState<'account-selection'>>()
  const { modalNavigate } = useModalNavigate()
  const { accountsByWalletId } = useAccountsByWalletIdSelector(wallet.id)

  const handleSelect = (account: IAccountState) => {
    onSelect?.(account)

    if (shouldGoBackOnSelect) {
      modalNavigate(-1)
    }
  }

  return (
    <BottomModalLayout heading={t('title')}>
      <div className="bg-asphalt flex items-center gap-4 rounded px-3.5 py-2">
        <TbWallet className="text-blue h-6 min-h-6 w-6 min-w-6" aria-hidden />
        <p className="text-blue truncate text-sm">{wallet.name}</p>
      </div>

      <ul className="my-2.5 min-h-0 overflow-y-auto rounded">
        {accountsByWalletId.map((account, index, array) => (
          <li key={account.id}>
            <button
              aria-selected={selectedAccount?.id === account.id}
              onClick={handleSelect.bind(null, account)}
              className="flex w-full cursor-pointer items-center justify-between gap-2.5 px-2.5 py-3.5 transition-colors hover:bg-gray-300/15 aria-selected:bg-gray-300/15 aria-selected:hover:bg-gray-300/30"
            >
              <div>
                <div className="flex min-w-0 items-center gap-5">
                  <BlockchainIcon blockchain={account.blockchain} className="h-4 min-h-4 w-4 min-w-4 text-gray-100" />
                  <p className="truncate text-sm text-white">{account.name}</p>
                </div>

                <p className="mt-0.5 ml-9 truncate text-xs text-gray-400">
                  {StringHelper.truncateStringMiddle(account.address, 10)}
                </p>
              </div>

              <TbChevronRight aria-hidden className="h-6 min-h-6 w-6 min-w-6 text-gray-300" />
            </button>

            {index + 1 !== array.length && <Separator />}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex gap-2.5">
        <Button
          variant="card"
          label={t('reorderButtonLabel')}
          colorSchema="gray"
          leftIcon={<TbReorder aria-hidden />}
        />
        <Button
          className="w-full"
          variant="card"
          label={t('addButtonLabel')}
          leftIcon={<TbPlus aria-hidden />}
          iconsOnEdge={false}
        />
      </div>
    </BottomModalLayout>
  )
}
