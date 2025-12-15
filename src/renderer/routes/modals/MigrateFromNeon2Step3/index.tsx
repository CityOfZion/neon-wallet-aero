import { useState } from 'react'

import { useTranslation } from 'react-i18next'

import { BlockchainIcon } from '@renderer/components/BlockchainIcon'
import { Button } from '@renderer/components/Button'
import { Checkbox } from '@renderer/components/Checkbox'
import { Separator } from '@renderer/components/Separator'

import { useAccountUtils } from '@renderer/hooks/useAccountUtils'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import type { TUseNeonMigrateFromNeon2Schema } from '@renderer/hooks/useNeonMigrate'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import type { TModalState } from '@shared/types/modal'

export const MigrateFromNeon2Step3Modal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'migrateWallets.step3' })
  const { content, onDecrypt } = useModalState<TModalState<'migrate-from-neon2-3'>>()
  const { modalNavigateWrapper } = useModalNavigate()
  const { doesAccountExist } = useAccountUtils()

  const [selectedAccountsToMigrate, setSelectedAccountsToMigrate] = useState<TUseNeonMigrateFromNeon2Schema[]>([])

  const handleSelect = (account: TUseNeonMigrateFromNeon2Schema) => {
    setSelectedAccountsToMigrate(prev => {
      const index = prev.findIndex(prevAccount => prevAccount.address === account.address)

      if (index === -1) {
        return [...prev, account]
      }

      return prev.filter(prevAccount => prevAccount.address !== account.address)
    })
  }

  const handleSelectAll = () => {
    const filteredContent = content.accounts.filter(account => {
      return !doesAccountExist(account)
    })

    setSelectedAccountsToMigrate(filteredContent)
  }

  return (
    <BottomModalLayout heading={t('title')}>
      <p className="text-center text-white">{t('selectTitle')}</p>

      <div className="flex flex-1 flex-col items-center justify-between px-4">
        <div className="mt-8 flex w-full justify-between">
          <p className="font-bold text-gray-100 uppercase">{t('selectLabel')}</p>

          <Button label={t('selectAllButtonLabel')} variant="text-slim" flat onClick={handleSelectAll} />
        </div>

        <ul className="mt-1 flex min-h-0 w-full flex-grow flex-col overflow-y-auto pr-2">
          {content.accounts.map((account, index) => {
            const isExistingAccount = doesAccountExist(account)
            const isChecked = selectedAccountsToMigrate.some(selectAccount => selectAccount.address === account.address)

            return (
              <li key={account.address} className="flex w-full flex-col">
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center">
                    <BlockchainIcon className="mr-2" blockchain={account.blockchain} type="gray" />

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
                    onClick={handleSelect.bind(null, account)}
                    checked={isChecked}
                    disabled={isExistingAccount}
                  />
                </div>

                {index < content.accounts.length - 1 && <Separator />}
              </li>
            )
          })}
        </ul>

        <span className="text-blue my-3.5 text-center text-sm font-bold">
          {t('selectedQuantity', { selected: selectedAccountsToMigrate.length, total: content.accounts.length })}
        </span>
      </div>
      <Button
        label={t('buttonLabel')}
        variant="card"
        disabled={selectedAccountsToMigrate.length <= 0}
        onClick={modalNavigateWrapper('migrate-from-neon2-4', {
          state: { selectedAccountsToMigrate, content, onDecrypt },
        })}
      />
    </BottomModalLayout>
  )
}

export default MigrateFromNeon2Step3Modal
