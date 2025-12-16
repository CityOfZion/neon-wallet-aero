import { WalletKitHelper } from '@cityofzion/bs-multichain'
import type { ChangeEvent } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'
import { Input } from '@renderer/components/Input'

import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { useActions } from '@renderer/hooks/useActions'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import NeonWalletLogo from '@renderer/assets/images/neon-wallet-full.svg?react'
import TbLink from '@renderer/assets/images/tb-link.svg?react'
import WalletConnectLogo from '@renderer/assets/images/wallet-connect.svg?react'

import { rendererApi } from '@shared/message-api/renderer'
import type { TModalState } from '@shared/types/modal'

type TFormData = {
  url: string
}

export const DappConnectionModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'dappConnection' })
  const { modalNavigate } = useModalNavigate()
  const { account } = useModalState<TModalState<'dapp-connection'>>()

  const { actionData, setData, actionState, setError, handleAct, reset } = useActions<TFormData>({
    url: '',
  })

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setData({ url: value })
  }

  const handleSubmit = async (data: TFormData) => {
    if (!WalletKitHelper.isValidURI(data.url)) {
      setError('url', t('errors.invalidUri'))
      return
    }

    try {
      const proposal = await rendererApi.send('wallet-connect:pair', data.url)
      modalNavigate('dapp-connection-request', { state: { account, proposal } })
    } catch {
      ToastHelper.error({ message: t('errors.errorToConnect') })
    } finally {
      reset()
    }
  }

  return (
    <BottomModalLayout heading={t('title')}>
      <div className="mt-5 flex w-full items-center gap-x-12 px-5">
        <NeonWalletLogo aria-hidden className="h-min w-full" />
        <WalletConnectLogo aria-hidden className="h-min w-full text-white opacity-60" />
      </div>

      <div className="mt-8 flex flex-col gap-2 px-9">
        <p className="text-center text-sm text-white">
          <Trans t={t} i18nKey="description" />
        </p>

        <p className="text-blue text-center text-xs leading-5 italic">{t('disclaimer')}</p>
      </div>

      <form className="mt-6 flex flex-grow flex-col" onSubmit={handleAct(handleSubmit)}>
        <Input
          name="url"
          id="url"
          placeholder={t('inputPlaceholder')}
          pastable
          clearable
          value={actionData.url}
          onChange={handleChange}
          errorMessage={actionState.errors.url}
        />

        <Button
          className="mt-auto"
          label={t('buttonConnectLabel')}
          leftIcon={<TbLink aria-hidden />}
          iconsOnEdge={false}
          loading={actionState.isActing}
        />
      </form>
    </BottomModalLayout>
  )
}

export default DappConnectionModal
