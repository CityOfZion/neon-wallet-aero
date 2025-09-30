import { useTranslation } from 'react-i18next'
import { Button } from '@renderer/components/Button'
import { Input } from '@renderer/components/Input'
import { useActions } from '@renderer/hooks/useActions'
import { useBlockchainActions } from '@renderer/hooks/useBlockchainActions'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'
import { blockchainNames } from '@renderer/libs/blockchainService'
import { TModalState } from '@shared/types/modal'

import MdiNumeric3Box from '@renderer/assets/images/mdi-numeric-3-box.svg?react'
import TbWand from '@renderer/assets/images/tb-wand.svg?react'

type TFormData = {
  walletName: string
}

export const CreateWalletStep3Modal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'createWalletStep3Modal' })
  const { t: commonT } = useTranslation('common')
  const { mnemonic } = useModalState<TModalState<'create-wallet-3'>>()
  const { modalNavigate, modalEraseWrapper } = useModalNavigate()
  const { createWallet, createStandardAccount } = useBlockchainActions()

  const { actionData, actionState, setData, setError, handleAct } = useActions<TFormData>({ walletName: '' })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const walletName = event.target.value
    setData({ walletName })
    if (walletName.trim().length === 0) {
      setError('walletName', t('errors.walletNameEmpty'))
    }
  }
  const handlePressContinue = async () => {
    const wallet = await createWallet({
      name: actionData.walletName.trim(),
      mnemonic: mnemonic.join(' '),
    })

    const promises = blockchainNames.map(blockchain =>
      createStandardAccount({
        wallet,
        blockchain,
        name: commonT('account.defaultName', { accountNumber: 1 }),
      })
    )

    await Promise.allSettled(promises)

    modalNavigate('create-wallet-4', {
      replace: true,
      state: {
        selectedWallet: wallet,
      },
    })
  }

  return (
    <BottomModalLayout heading={t('title')}>
      <form className="flex w-full flex-grow flex-col justify-between" onSubmit={handleAct(handlePressContinue)}>
        <div className="min-h-0 overflow-y-auto">
          <div className="flex items-center gap-4 px-3.5 pt-2 pb-5">
            <MdiNumeric3Box className="text-blue h-6 w-6" aria-hidden />
            <h3 className="text-lg">{t('subtitle')}</h3>
          </div>

          <div className="mx-3.5 mb-5 border-b border-gray-100/30 pb-5">
            <p className="text-sm text-gray-100">{t('walletNameText')}</p>
          </div>

          <div className="flex flex-col items-center rounded px-3.5 py-2">
            <Input
              maxLength={20}
              value={actionData.walletName}
              errorMessage={actionState.errors.walletName}
              autoFocus
              label={t('walletNameLabel')}
              onChange={handleChange}
              clearable
            />
          </div>
        </div>

        <div className="mt-auto flex gap-2.5 px-3.5">
          <Button
            variant="card"
            label={t('cancelButtonLabel')}
            colorSchema="gray"
            type="button"
            onClick={modalEraseWrapper('bottom')}
          />
          <Button
            className="w-full"
            variant="card"
            label={t('createNewWalletButtonLabel')}
            leftIcon={<TbWand aria-hidden className="w-5" />}
            iconsOnEdge={false}
            type="submit"
            disabled={actionState.isActing || !actionState.isValid}
            loading={actionState.isActing}
          />
        </div>
      </form>
    </BottomModalLayout>
  )
}
