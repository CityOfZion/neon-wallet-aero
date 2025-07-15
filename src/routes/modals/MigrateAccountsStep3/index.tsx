import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { BlockchainIcon } from '@/components/BlockchainIcon'
import { Button } from '@/components/Button'
import { Checkbox } from '@/components/Checkbox'
import { Separator } from '@/components/Separator'
import { useAccountUtils } from '@/hooks/useAccountUtils'
import { useModalNavigate, useModalState } from '@/hooks/useModalRouter'
import { TUseNeonMigrateAccountsSchema } from '@/hooks/useNeonMigrate'
import { BottomModalLayout } from '@/layouts/BottomModalLayout'
import { TModalState } from '@/types/modal'

export const MigrateAccountsStep3Modal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'migrateWallets.step3' })
  const { content, onDecrypt } = useModalState<TModalState<'migrate-accounts-3'>>()
  const { modalNavigateWrapper } = useModalNavigate()
  const { doesAccountExist } = useAccountUtils()

  const [selectedAccountsToMigrate, setSelectedAccountsToMigrate] = useState<TUseNeonMigrateAccountsSchema[]>([])

  const handleSelect = (account: TUseNeonMigrateAccountsSchema) => {
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
    <BottomModalLayout heading={t('title')} className="px-4">
      <p className="text-center text-white">{t('selectTitle')}</p>

      <div className="flex flex-1 flex-col items-center justify-between px-4">
        <div className="mt-8 flex w-full justify-between">
          <p className="font-bold text-gray-100 uppercase">{t('selectLabel')}</p>

          <Button label={t('selectAllButtonLabel')} variant="text-slim" flat onClick={handleSelectAll} />
        </div>

        <div className="mt-1 flex min-h-0 w-full flex-grow flex-col overflow-y-auto pr-2">
          {content.accounts.map((account, index) => {
            const isExistingAccount = doesAccountExist(account)
            const isChecked = selectedAccountsToMigrate.some(selectAccount => selectAccount.address === account.address)

            return (
              <Fragment key={account.address}>
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
                    checked={isExistingAccount || isChecked}
                    disabled={isExistingAccount}
                  />
                </div>

                {index < content.accounts.length - 1 && <Separator />}
              </Fragment>
            )
          })}
        </div>

        <span className="text-blue my-3.5 text-center text-sm font-bold">
          {t('selectedQuantity', { selected: selectedAccountsToMigrate.length, total: content.accounts.length })}
        </span>
      </div>
      <Button
        label={t('buttonLabel')}
        disabled={selectedAccountsToMigrate.length <= 0}
        onClick={modalNavigateWrapper('migrate-accounts-4', {
          state: { selectedAccountsToMigrate, content, onDecrypt },
        })}
      />
    </BottomModalLayout>
  )
}
