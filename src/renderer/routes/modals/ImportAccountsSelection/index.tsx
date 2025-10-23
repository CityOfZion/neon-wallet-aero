import type { TBSAccount } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

import { useModalState } from '@renderer/hooks/useModalRouter'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import type { TModalState } from '@shared/types/modal'

import { ImportAccountsSelectionAddress } from './ImportAccountsSelectionAddress'
import { ImportAccountsSelectionKey } from './ImportAccountsSelectionKey'
import { ImportAccountsSelectionMnemonic } from './ImportAccountsSelectionMnemonic'

export type TBlockchainAccounts = Partial<Record<TBlockchainServiceKey, TBSAccount<TBlockchainServiceKey>[]>>

export const ImportAccountsSelectionModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'importAccountsSelection' })
  const { value, type, onSubmit } = useModalState<TModalState<'import-accounts-selection'>>()

  return (
    <BottomModalLayout heading={t('title')} className="overflow-y-auto">
      <h2 className="mt-2 mb-5 text-center">{t('subtitle')}</h2>

      {match(type)
        .with('mnemonic', () => <ImportAccountsSelectionMnemonic value={value} onSubmit={onSubmit} />)
        .with('key', () => <ImportAccountsSelectionKey value={value} onSubmit={onSubmit} />)
        .otherwise(() => (
          <ImportAccountsSelectionAddress value={value} onSubmit={onSubmit} />
        ))}
    </BottomModalLayout>
  )
}

export default ImportAccountsSelectionModal
