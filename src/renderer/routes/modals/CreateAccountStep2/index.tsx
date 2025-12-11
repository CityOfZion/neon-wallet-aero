import { Fragment } from 'react/jsx-runtime'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { BlockchainIcon } from '@renderer/components/BlockchainIcon'
import { Button } from '@renderer/components/Button'
import { Radio } from '@renderer/components/Radio'
import { Separator } from '@renderer/components/Separator'

import { AppError } from '@renderer/helpers/ErrorHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { useActions } from '@renderer/hooks/useActions'
import { useBlockchainActions } from '@renderer/hooks/useBlockchainActions'
import { useAddAccountHardwareWallet } from '@renderer/hooks/useHardwareWallet'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import TbCheck from '@renderer/assets/images/tb-check.svg?react'

import { blockchainNames } from '@renderer/libs/blockchain-service'
import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import type { TModalState } from '@shared/types/modal'
import type { IAccountState, IWalletState } from '@shared/types/store'

import { CreateAccountStep2Accordion } from './CreateAccountStep2Accordion'

type TActionsData = {
  selectedBlockchain?: TBlockchainServiceKey
  selectedWallet?: IWalletState
}

export const CreateAccountStep2Modal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'createAccountStep2' })
  const { t: tCommonBlockchain } = useTranslation('common', { keyPrefix: 'blockchain' })
  const { accountName } = useModalState<TModalState<'create-account-2'>>()
  const { modalErase, modalNavigateWrapper } = useModalNavigate()
  const { createStandardAccount } = useBlockchainActions()
  const { addHardwareAccount } = useAddAccountHardwareWallet()
  const navigate = useNavigate()

  const {
    actionData: { selectedBlockchain, selectedWallet },
    actionState,
    setData,
    handleAct,
  } = useActions<TActionsData>({ selectedBlockchain: undefined, selectedWallet: undefined })

  const isDisabled =
    actionState.isActing || !selectedWallet || (selectedWallet.type !== 'hardware' && !selectedBlockchain)

  const handleSelectBlockchain = (blockchain: TBlockchainServiceKey) => {
    setData({ selectedBlockchain: blockchain })
  }

  const handleSubmit = async () => {
    if (isDisabled) return

    try {
      const trimmedAccountName = accountName.trim()
      let account: IAccountState

      if (selectedWallet.type === 'standard') {
        account = await createStandardAccount({
          wallet: selectedWallet,
          blockchain: selectedBlockchain!,
          name: trimmedAccountName,
        })
      } else {
        account = await addHardwareAccount(selectedWallet, trimmedAccountName)
      }

      navigate('/wallets', { state: { account, wallet: selectedWallet }, replace: true })
      modalErase('bottom')
    } catch (error) {
      console.error(error)
      ToastHelper.error({ message: AppError.wrap(error, t('errors.createAccount')).message })
      modalErase('bottom')
    }
  }

  const handleWallets = (wallet: IWalletState) => {
    setData({ selectedWallet: wallet })
  }

  return (
    <BottomModalLayout heading={t('title')} className="overflow-y-auto">
      <form className="mt-2 flex flex-grow flex-col px-3.5" onSubmit={handleAct(handleSubmit)}>
        <p className="mb-2 block text-xs font-bold text-gray-100 uppercase">{t('selectWalletLabel')}</p>

        <CreateAccountStep2Accordion onSelect={handleWallets} selectedWallet={selectedWallet} />

        {selectedWallet?.type !== 'hardware' && (
          <Fragment>
            <Separator className="my-5" />

            <p className="mb-2 block text-xs font-bold text-gray-100 uppercase">{t('selectBlockchainLabel')}</p>

            <Radio.Group
              className="flex flex-col gap-y-2"
              required
              value={selectedBlockchain}
              onValueChange={handleSelectBlockchain}
            >
              {blockchainNames.map((blockchain, index) => (
                <Radio.Item
                  key={`${blockchain}-${index}`}
                  className="bg-asphalt h-12 rounded px-1"
                  withSeparator={false}
                  value={blockchain}
                >
                  <BlockchainIcon blockchain={blockchain} className="text-gray-100" />

                  <span className="flex-grow text-left">{tCommonBlockchain(blockchain)}</span>

                  <Radio.Indicator />
                </Radio.Item>
              ))}
            </Radio.Group>
          </Fragment>
        )}

        <div className="mt-auto flex gap-2.5 pt-6">
          <Button
            variant="card"
            label={t('cancelButtonLabel')}
            colorSchema="gray"
            type="button"
            onClick={modalNavigateWrapper(-1)}
          />

          <Button
            className="w-full"
            variant="card"
            label={t('createAccountButtonLabel')}
            leftIcon={<TbCheck aria-hidden className="w-5" />}
            iconsOnEdge={false}
            disabled={isDisabled}
          />
        </div>
      </form>
    </BottomModalLayout>
  )
}

export default CreateAccountStep2Modal
