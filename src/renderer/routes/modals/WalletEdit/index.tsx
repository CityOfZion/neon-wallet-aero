import { useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'
import { Separator } from '@renderer/components/Separator'

import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import TbTrash from '@renderer/assets/images/tb-trash.svg?react'

import type { TModalState } from '@shared/types/modal'

export const WalletEditModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'walletEdit' })
  const { t: commonT } = useTranslation('common', { keyPrefix: 'general' })
  const { wallet } = useModalState<TModalState<'wallet-edit'>>()
  const { modalNavigateWrapper } = useModalNavigate()

  return (
    <BottomModalLayout heading={t('title')}>
      <p>{wallet?.name} (Temp)</p>
      <Separator />

      <p className="text-sm text-gray-300 uppercase">{t('deleteWalletLabel')}</p>
      <div className="flex w-full gap-3 px-4">
        <Button label={commonT('cancel')} variant="card" colorSchema="gray" onClick={modalNavigateWrapper(-1)} />
        <Button
          label={t('deleteWalletButtonLabel')}
          variant="outlined"
          colorSchema="error"
          className="w-full"
          leftIcon={<TbTrash aria-hidden />}
          iconsOnEdge={false}
          onClick={modalNavigateWrapper('wallet-deletion', {
            state: {
              wallet,
            },
          })}
        />
      </div>
    </BottomModalLayout>
  )
}

export default WalletEditModal
