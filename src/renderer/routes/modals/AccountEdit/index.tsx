import { useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'
import { Separator } from '@renderer/components/Separator'

import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import TbTrash from '@renderer/assets/images/tb-trash.svg?react'

import type { TModalState } from '@shared/types/modal'

export const AccountEditModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'accountEdit' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'general' })
  const { account, wallet } = useModalState<TModalState<'account-edit'>>()
  const { modalNavigateWrapper } = useModalNavigate()

  return (
    <BottomModalLayout heading={t('title')}>
      <p>
        {account?.name} @ {wallet?.name} (Temp)
      </p>
      <Separator />

      <p className="text-sm text-gray-300 uppercase">{t('deleteAccountLabel')}</p>
      <div className="flex w-full gap-3 px-4">
        <Button label={tCommon('cancel')} variant="card" colorSchema="gray" onClick={modalNavigateWrapper(-1)} />
        <Button
          label={t('deleteAccountButtonLabel')}
          variant="outlined"
          colorSchema="error"
          className="w-full"
          leftIcon={<TbTrash aria-hidden />}
          iconsOnEdge={false}
          onClick={modalNavigateWrapper('account-deletion', {
            state: {
              account,
              wallet,
            },
          })}
        />
      </div>
    </BottomModalLayout>
  )
}

export default AccountEditModal
