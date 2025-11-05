import { useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'
import { Input } from '@renderer/components/Input'
import { Separator } from '@renderer/components/Separator'

import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { useActions } from '@renderer/hooks/useActions'
import { useBlockchainActions } from '@renderer/hooks/useBlockchainActions'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { useWalletByIdSelector } from '@renderer/hooks/useWalletSelector'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import MdCheck from '@renderer/assets/images/md-check.svg?react'
import TbTrash from '@renderer/assets/images/tb-trash.svg?react'
import TbWallet from '@renderer/assets/images/tb-wallet.svg?react'

import type { TModalState } from '@shared/types/modal'

type TActionsData = {
  walletName: string
}

export const WalletEditModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'walletEdit' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'general' })
  const { walletId } = useModalState<TModalState<'wallet-edit'>>()
  const { modalNavigateWrapper, modalNavigate } = useModalNavigate()
  const { editWallet } = useBlockchainActions()
  const { wallet } = useWalletByIdSelector(walletId)

  const { actionData, actionState, setData, setError, handleAct } = useActions<TActionsData>({
    walletName: wallet!.name,
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const walletName = event.target.value
    setData({ walletName })

    if (walletName.trim().length === 0) {
      setError('walletName', t('errors.walletNameEmpty'))
    }
  }

  const handleSubmit = async () => {
    if (!walletId || !wallet) return

    await editWallet({ wallet, data: { name: actionData.walletName.trim() } })

    ToastHelper.success({ message: t('messages.walletNameUpdated') })

    modalNavigate(-2)
  }

  return (
    <BottomModalLayout heading={t('title')}>
      <div className="bg-asphalt flex items-center gap-4 rounded px-3.5 py-2">
        <TbWallet className="text-blue size-6" aria-hidden />
        <h3 className="text-blue text-sm">{t('subtitle')}</h3>
      </div>

      <form className="mt-6 flex flex-1 flex-col gap-y-4 px-4" onSubmit={handleAct(handleSubmit)}>
        <Input
          contentClassName="bg-asphalt"
          maxLength={20}
          value={actionData.walletName}
          errorMessage={actionState.errors.walletName}
          autoFocus
          label={t('walletNameLabel')}
          onChange={handleChange}
          clearable
        />

        <div className="mt-auto mb-6 flex w-full items-center gap-3">
          <Button label={tCommon('cancel')} variant="card" colorSchema="gray" onClick={modalNavigateWrapper(-1)} />

          <Button
            label={tCommon('save')}
            variant="card"
            colorSchema="neon"
            type="submit"
            leftIcon={<MdCheck aria-hidden />}
            iconsOnEdge={false}
            className="w-full"
            disabled={!actionState.isValid}
          />
        </div>
      </form>

      <Separator className="mt-auto mb-2" />

      <div className="mt-2 flex flex-col gap-y-4 px-4">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-bold text-gray-300 uppercase">{t('deleteWalletLabel')}</p>
          <p className="text-sm">{t('deleteWalletDescription')}</p>
        </div>

        <Button
          label={t('deleteWalletButtonLabel')}
          variant="outlined"
          colorSchema="error"
          leftIcon={<TbTrash aria-hidden />}
          iconsOnEdge={false}
          onClick={modalNavigateWrapper('wallet-deletion', {
            state: {
              wallet: wallet!,
            },
          })}
        />
      </div>
    </BottomModalLayout>
  )
}

export default WalletEditModal
