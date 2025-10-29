import { useTranslation } from 'react-i18next'

import { Banner } from '@renderer/components/Banner'
import { Button } from '@renderer/components/Button'
import { Separator } from '@renderer/components/Separator'

import { useAccountsByWalletIdSelector } from '@renderer/hooks/useAccountSelector'
import { useBlockchainActions } from '@renderer/hooks/useBlockchainActions'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { usePressOnce } from '@renderer/hooks/usePressOnce'
import { useAppDispatch } from '@renderer/hooks/useRedux'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import TbTrash from '@renderer/assets/images/tb-trash.svg?react'
import TbWallet from '@renderer/assets/images/tb-wallet.svg?react'

import { settingsReducerActions } from '@renderer/store/reducers/settings'
import type { TModalState } from '@shared/types/modal'

export const AccountDeletionModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'accountDeletion' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'general' })
  const { account, wallet } = useModalState<TModalState<'account-deletion'>>()
  const { accountsByWalletId } = useAccountsByWalletIdSelector(wallet.id)
  const { modalNavigateWrapper, modalErase } = useModalNavigate()
  const { deleteAccount } = useBlockchainActions()
  const dispatch = useAppDispatch()

  const [isDeleting, startDelete] = usePressOnce(async () => {
    await deleteAccount(account)

    const remainingAccounts = accountsByWalletId.filter(acc => acc.id !== account.id)

    dispatch(settingsReducerActions.setSelectedAccount(remainingAccounts[0]))
    modalErase('bottom')
  })

  return (
    <BottomModalLayout heading={t('title')}>
      <div className="bg-asphalt flex items-center gap-4 rounded px-3.5 py-2">
        <TbWallet className="text-blue h-6 max-h-6 min-h-6 w-6 max-w-6 min-w-6" aria-hidden />
        <p className="text-blue truncate text-sm">{wallet.name}</p>
      </div>

      <div className="my-4 flex flex-grow flex-col items-center justify-around px-4">
        <p className="text-xl">{t('subtitle')}</p>

        <div className="w-full rounded bg-gray-300/15 px-4 py-3 text-center">
          <p className="truncate text-sm font-medium text-white">{account.name}</p>
        </div>
        <p className="text-xs text-gray-100">{t('description')}</p>

        <Banner className="mt-4" type="error" message={t('deleteAccountWarningLabel')} textClassName="p-4" />

        <Separator />

        <p className="text-sm">{t('deleteAccountConfirmationLabel')}</p>
      </div>

      <div className="flex w-full gap-3 px-4">
        <Button label={tCommon('cancel')} variant="card" colorSchema="gray" onClick={modalNavigateWrapper(-1)} />
        <Button
          label={t('deleteAccountButtonLabel')}
          variant="outlined"
          colorSchema="error"
          className="w-full"
          leftIcon={<TbTrash aria-hidden />}
          iconsOnEdge={false}
          onClick={startDelete()}
          disabled={isDeleting}
        />
      </div>
    </BottomModalLayout>
  )
}

export default AccountDeletionModal
