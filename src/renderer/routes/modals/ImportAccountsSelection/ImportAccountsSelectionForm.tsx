import { useMemo } from 'react'

import type { TBSAccount } from '@cityofzion/blockchain-service'
import type { FormEvent, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

import { Button } from '@renderer/components/Button'
import { Loader } from '@renderer/components/Loader'

import { AccountHelper } from '@renderer/helpers/AccountHelper'

import TbFileImport from '@renderer/assets/images/tb-file-import.svg?react'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'

import type { TBlockchainAccounts } from '.'
import { ImportAccountsSelectionAccordion } from './ImportAccountsSelectionAccordion'

export type TImportAccountsSelectionFormProps = {
  isMounting: boolean
  isSubmitting: boolean
  isDisabled: boolean
  blockchainAccounts: TBlockchainAccounts
  selectedAccounts: TBSAccount<TBlockchainServiceKey>[]
  onSelect(newSelectedAccounts: TBSAccount<TBlockchainServiceKey>[]): void
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
  const { t } = useTranslation('modals', { keyPrefix: 'importAccountsSelection.form' })

  const selectableAccounts = useMemo(() => Object.values(blockchainAccounts).flat(), [blockchainAccounts])
  const hasBlockchainAccounts = selectableAccounts.length > 0

  const areAllAccountsSelected = selectableAccounts.every(account =>
    selectedAccounts.some(AccountHelper.predicate(account))
  )

  const handleToggleAllAccounts = () => {
    onSelect(areAllAccountsSelected ? [] : selectableAccounts)
  }

  return match({ isMounting, hasBlockchainAccounts })
    .with({ isMounting: true }, () => <Loader containerClassName="mt-6" className="size-8" />)
    .with({ hasBlockchainAccounts: false }, () => (
      <p className="mt-4 px-8 text-center text-sm text-gray-100">{t('notFoundLabel')}</p>
    ))
    .otherwise(() => (
      <form className="flex grow flex-col gap-y-4" onSubmit={onSubmit}>
        <Button
          className="self-end"
          type="button"
          label={areAllAccountsSelected ? t('deselectAllButtonLabel') : t('selectAllButtonLabel')}
          variant="text-slim"
          flat
          onClick={handleToggleAllAccounts}
        />

        <ImportAccountsSelectionAccordion
          blockchainAccounts={blockchainAccounts}
          selectedAccounts={selectedAccounts}
          onSelect={onSelect}
        />

        {children}

        <div className="mt-6 flex grow flex-col justify-end">
          <Button
            label={t('submitButtonLabel')}
            type="submit"
            disabled={isDisabled}
            loading={isSubmitting}
            iconsOnEdge={false}
            leftIcon={<TbFileImport aria-hidden />}
          />
        </div>
      </form>
    ))
}
