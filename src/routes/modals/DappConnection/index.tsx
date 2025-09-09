import { ChangeEvent, useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useWalletConnectWallet } from '@cityofzion/wallet-connect-sdk-wallet-react'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { ToastHelper } from '@/helpers/ToastHelper'
import { WalletConnectHelper } from '@/helpers/WalletConnectHelper'
import { useActions } from '@/hooks/useActions'
import { useModalNavigate, useModalState } from '@/hooks/useModalRouter'
import { BottomModalLayout } from '@/layouts/BottomModalLayout'
import { TModalState } from '@/types/modal'

import NeonWalletLogo from '@/assets/images/neon-wallet-full.svg?react'
import TbLink from '@/assets/images/tb-link.svg?react'
import WalletConnectLogo from '@/assets/images/wallet-connect.svg?react'

type TFormData = {
  url: string
  isConnecting: boolean
}

export const DappConnectionModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'dappConnectionModal' })
  const { connect, proposals } = useWalletConnectWallet()
  const { modalNavigate } = useModalNavigate()
  const { account } = useModalState<TModalState<'dapp-connection'>>()

  const { actionData, setData, actionState, setError, handleAct, reset } = useActions<TFormData>({
    url: '',
    isConnecting: false,
  })

  const isLoading = actionState.isActing || actionData.isConnecting

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setData({ url: value })
  }

  const handleSubmit = async (data: TFormData) => {
    if (isLoading) return

    if (!WalletConnectHelper.isValidURI(data.url)) {
      setError('url', t('errors.invalidUri'))
      return
    }

    try {
      setData({ isConnecting: true })
      await connect(data.url)
    } catch {
      ToastHelper.error({ message: t('errors.errorToConnect') })
      setData({ isConnecting: false })
    }
  }

  useEffect(() => {
    const proposal = proposals[0]
    if (!proposal) return

    modalNavigate('dapp-connection-request', { state: { account, proposal } })
    reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposals])

  return (
    <BottomModalLayout heading={t('title')}>
      <div className="flex w-full items-center gap-x-12">
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
          loading={isLoading}
        />
      </form>
    </BottomModalLayout>
  )
}
