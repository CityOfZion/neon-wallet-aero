import { useState } from 'react'

import { useTranslation } from 'react-i18next'

import { BlockchainIcon } from '@renderer/components/BlockchainIcon'
import { Button } from '@renderer/components/Button'
import { Checkbox } from '@renderer/components/Checkbox'
import { Separator } from '@renderer/components/Separator'

import { AccountHelper } from '@renderer/helpers/AccountHelper'

import { useAccountUtils } from '@renderer/hooks/useAccountUtils'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import type { TUseImportNep6Account } from '@shared/types/hooks'
import type { TModalState } from '@shared/types/modal'

export const MigrateFromNeon2Step3Modal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'migrateWallets.step3' })
  const { content, onDecrypt } = useModalState<TModalState<'migrate-from-neon2-3'>>()
  const { modalNavigateWrapper } = useModalNavigate()
  const { doesAccountExist } = useAccountUtils()

  const [accounts, setAccounts] = useState<TUseImportNep6Account[]>([])

  const selectableAccounts = content.accounts.filter(account => !doesAccountExist(account))

  const handleToggleAccount = (account: TUseImportNep6Account) => {
    setAccounts(previousAccounts => {
      const index = previousAccounts.findIndex(AccountHelper.predicate(account))

      if (index === -1) {
        return [...previousAccounts, account]
      }

      return previousAccounts.filter(AccountHelper.predicateNot(account))
    })
  }

  const isDisabled = selectableAccounts.length === 0

  const areAllAccountsSelected =
    !isDisabled && selectableAccounts.every(account => accounts.some(AccountHelper.predicate(account)))

  const handleToggleAllAccounts = () => {
    setAccounts(areAllAccountsSelected ? [] : selectableAccounts)
  }

  return (
    <BottomModalLayout heading={t('title')}>
      <p className="text-center text-white">{t('selectTitle')}</p>

      <div className="flex flex-1 flex-col items-center justify-between px-4">
        <div className="mt-8 flex w-full justify-between">
          <p className="font-bold text-gray-100 uppercase">{t('selectLabel')}</p>

          <Button
            label={areAllAccountsSelected ? t('deselectAllButtonLabel') : t('selectAllButtonLabel')}
            variant="text-slim"
            flat
            onClick={handleToggleAllAccounts}
            disabled={isDisabled}
          />
        </div>

        <ul className="mt-1 flex min-h-0 w-full grow flex-col overflow-y-auto pr-2">
          {content.accounts.map((account, index) => {
            const isExistingAccount = doesAccountExist(account)
            const isChecked = accounts.some(AccountHelper.predicate(account))

            return (
              <li key={account.address} className="flex w-full flex-col">
                <label className="flex items-center justify-between py-4">
                  <div className="flex items-center">
                    <BlockchainIcon className="mr-2" blockchain={account.blockchain} />

                    <div className="flex flex-col gap-1">
                      <div className="flex gap-2">
                        <span className="text-sm text-white">{account.label}</span>
                        {isExistingAccount && (
                          <span className="text-green text-sm italic">{t('alreadyImportedLabel')}</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-300">{account.address}</span>
                    </div>
                  </div>

                  <Checkbox
                    onClick={handleToggleAccount.bind(null, account)}
                    checked={isChecked}
                    disabled={isExistingAccount}
                  />
                </label>

                {index < content.accounts.length - 1 && <Separator />}
              </li>
            )
          })}
        </ul>

        <span className="text-blue my-3.5 text-center text-sm font-bold">
          {t('selectedQuantity', {
            selected: accounts.length,
            count: content.accounts.length,
          })}
        </span>
      </div>
      <Button
        label={t('buttonLabel')}
        variant="card"
        disabled={accounts.length <= 0}
        onClick={modalNavigateWrapper('migrate-from-neon2-4', {
          state: { accounts, content, onDecrypt },
        })}
      />
    </BottomModalLayout>
  )
}

export default MigrateFromNeon2Step3Modal
