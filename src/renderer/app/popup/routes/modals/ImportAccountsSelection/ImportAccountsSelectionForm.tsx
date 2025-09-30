import { FormEvent, ReactNode, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Account } from '@cityofzion/blockchain-service'
import { Button } from '@renderer/components/Button'
import { Loader } from '@renderer/components/Loader'
import { TBlockchainServiceKey } from '@shared/types/blockchain'
import { match } from 'ts-pattern'

import { ImportAccountsSelectionAccordion } from './ImportAccountsSelectionAccordion'
import { TBlockchainAccounts } from '.'

import TbFileImport from '@renderer/assets/images/tb-file-import.svg?react'

export type TImportAccountsSelectionFormProps = {
  isMounting: boolean
  isSubmitting: boolean
  isDisabled: boolean
  blockchainAccounts: TBlockchainAccounts
  selectedAccounts: Account<TBlockchainServiceKey>[]
  onSelect(newSelectedAccounts: Account<TBlockchainServiceKey>[]): void
  onSubmit(event: FormEvent | MouseEvent): void
  children?: ReactNode
}

export const ImportAccountsSelectionForm = ({
  isMounting,
  isSubmitting,
  isDisabled,
  blockchainAccounts,
  selectedAccounts,
  onSelect,
  onSubmit,
  children,
}: TImportAccountsSelectionFormProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'importAccountsSelectionModal.form' })

  const hasBlockchainAccounts = useMemo(() => Object.values(blockchainAccounts).flat().length > 0, [blockchainAccounts])

  return match({ isMounting, hasBlockchainAccounts })
    .with({ isMounting: true }, () => <Loader containerClassName="mt-6" className="h-8 w-8" />)
    .with({ hasBlockchainAccounts: false }, () => (
      <p className="mt-4 px-8 text-center text-sm text-gray-100">{t('notFoundLabel')}</p>
    ))
    .otherwise(() => (
      <form className="flex flex-grow flex-col gap-y-4" onSubmit={onSubmit}>
        <ImportAccountsSelectionAccordion
          blockchainAccounts={blockchainAccounts}
          selectedAccounts={selectedAccounts}
          onSelect={onSelect}
        />

        {children}

        <div className="mt-6 flex flex-grow flex-col justify-end">
          <Button
            label={t('submitButtonLabel')}
            type="submit"
            disabled={isDisabled}
            loading={isSubmitting}
            iconsOnEdge={false}
            leftIcon={<TbFileImport aria-hidden={true} />}
          />
        </div>
      </form>
    ))
}
