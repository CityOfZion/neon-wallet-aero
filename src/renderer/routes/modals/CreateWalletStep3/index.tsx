import { useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'
import { Input } from '@renderer/components/Input'

import { useActions } from '@renderer/hooks/useActions'
import { useBlockchainActions } from '@renderer/hooks/useBlockchainActions'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import MdiNumeric3Box from '@renderer/assets/images/mdi-numeric-3-box.svg?react'
import TbArrowLeft from '@renderer/assets/images/tb-arrow-left.svg?react'
import TbWand from '@renderer/assets/images/tb-wand.svg?react'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import type { TModalState } from '@shared/types/modal'

type TFormData = {
  walletName: string
}

export const CreateWalletStep3Modal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'createWalletStep3' })
  const { t: tCommon } = useTranslation('common')
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

  const handleSelectBlockchains = async (blockchains: TBlockchainServiceKey[]) => {
    const wallet = await createWallet({
      name: actionData.walletName.trim(),
      mnemonic: mnemonic.join(' '),
    })

    const promises = blockchains.map(blockchain =>
      createStandardAccount({
        wallet,
        blockchain,
        name: tCommon('account.defaultName', { accountNumber: 1 }),
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

  const handlePressContinue = () => {
    modalNavigate('blockchain-selection', {
      state: {
        heading: t('blockchainSelectionModalTitle'),
        description: t('blockchainSelectionModalDescription'),
        isMulti: true,
        submitButtonProps: {
          label: t('createNewWalletButtonLabel'),
          iconsOnEdge: false,
          leftIcon: <TbWand aria-hidden className="size-5" />,
        },
        onSelect: handleSelectBlockchains,
      },
    })
  }

  return (
    <BottomModalLayout heading={t('title')}>
      <form className="flex w-full grow flex-col justify-between" onSubmit={handleAct(handlePressContinue)}>
        <div className="min-h-0 overflow-y-auto">
          <div className="flex items-center gap-4 pt-2 pb-5">
            <MdiNumeric3Box className="text-blue size-6" aria-hidden />
            <h3 className="text-lg">{t('subtitle')}</h3>
          </div>

          <div className="mb-5 border-b border-gray-100/30 pb-5">
            <p className="text-sm text-gray-100">{t('walletNameText')}</p>
          </div>

          <div className="flex flex-col items-center rounded py-2">
            <Input
              name="name"
              id="name"
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

        <div className="mt-auto flex gap-2.5">
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
            label={t('nextButtonLabel')}
            rightIcon={<TbArrowLeft aria-hidden className="rotate-180" />}
            iconsOnEdge={false}
            type="submit"
            disabled={actionState.isActing || !actionState.isValid}
          />
        </div>
      </form>
    </BottomModalLayout>
  )
}

export default CreateWalletStep3Modal
