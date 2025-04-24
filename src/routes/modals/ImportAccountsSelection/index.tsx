import { useTranslation } from 'react-i18next'
import { Account } from '@cityofzion/blockchain-service'
import { match } from 'ts-pattern'

import { useModalState } from '@/hooks/useModalRouter'
import { BottomModalLayout } from '@/layouts/BottomModalLayout'
import { TBlockchainServiceKey } from '@/types/blockchain'
import { TModalState } from '@/types/modal'

import { ImportAccountsSelectionKey } from './ImportAccountsSelectionKey'
import { ImportAccountsSelectionMnemonic } from './ImportAccountsSelectionMnemonic'
import { ImportAccountsSelectionWatch } from './ImportAccountsSelectionWatch'

export type TBlockchainAccounts = Partial<Record<TBlockchainServiceKey, Account<TBlockchainServiceKey>[]>>

export const ImportAccountsSelectionModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'importAccountsSelectionModal' })
  const { value, type } = useModalState<TModalState<'import-accounts-selection'>>()

  return (
    <BottomModalLayout heading={t('title')} className="overflow-y-auto">
      <h2 className="mt-2 mb-5 text-center">{t('subtitle')}</h2>

      {match(type)
        .with('mnemonic', () => <ImportAccountsSelectionMnemonic value={value} />)
        .with('key', () => <ImportAccountsSelectionKey value={value} />)
        .otherwise(() => (
          <ImportAccountsSelectionWatch value={value} />
        ))}
    </BottomModalLayout>
  )
}
