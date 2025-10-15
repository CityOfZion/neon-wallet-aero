import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button } from '@renderer/components/Button'

import { useAccountsByWalletIdSelector } from '@renderer/hooks/useAccountSelector'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import NeonWalletIcon from '@renderer/assets/images/neon-wallet-icon.svg?react'
import TbEye from '@renderer/assets/images/tb-eye.svg?react'

import type { TModalState } from '@shared/types/modal'

export const CreateWalletStep4Modal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'createWalletStep4Modal' })
  const { selectedWallet } = useModalState<TModalState<'create-wallet-4'>>()
  const { accountsByWalletId } = useAccountsByWalletIdSelector(selectedWallet.id)
  const { modalErase } = useModalNavigate()
  const navigate = useNavigate()

  const handlePressContinue = () => {
    const wallet = selectedWallet
    navigate('/wallets', { state: { account: accountsByWalletId[0], wallet }, replace: true })
    modalErase('bottom')
  }

  return (
    <BottomModalLayout heading={t('title')} hideBackButton className="overflow-y-auto">
      <div className="flex flex-col items-center px-3.5 pb-5">
        <NeonWalletIcon className="text-neon my-6 w-[4.4rem]" aria-hidden />
        <h3 className="pb-2.5 text-lg">{t('subtitle')}</h3>
        <p className="max-w-[14.5rem] pb-3.5 text-center text-sm text-white">{t('proudOwnerText')}</p>
        <p className="text-center text-xs text-gray-100">{t('rememberSecretPhraseText')}</p>
      </div>

      <div className="mt-auto flex gap-2.5 px-3.5">
        <Button
          className="w-full"
          variant="card"
          label={t('viewNewWalletButtonLabel')}
          leftIcon={<TbEye aria-hidden className="w-5" />}
          iconsOnEdge={false}
          onClick={handlePressContinue}
        />
      </div>
    </BottomModalLayout>
  )
}

export default CreateWalletStep4Modal
