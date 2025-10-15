import { useTranslation } from 'react-i18next'
import { TSession, useWalletConnectWallet } from '@cityofzion/wallet-connect-sdk-wallet-react'
import { Button } from '@renderer/components/Button'
import { Separator } from '@renderer/components/Separator'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'
import { TModalState } from '@shared/types/modal'

import TbPlugX from '@renderer/assets/images/tb-plug-x.svg?react'

export const DappDisconnectionModal = () => {
  const { disconnect } = useWalletConnectWallet()
  const { sessions } = useModalState<TModalState<'dapp-disconnection'>>()
  const { t } = useTranslation('modals', { keyPrefix: 'dappDisconnectionModal' })
  const { modalNavigate } = useModalNavigate()

  const handleDisconnect = async (session: TSession) => {
    await disconnect(session)
    modalNavigate(-1)
  }

  const handleDisconnectAll = () => {
    Promise.allSettled(sessions.map(async session => await disconnect(session)))
    modalNavigate(-1)
  }

  return (
    <BottomModalLayout heading={t('title')}>
      <div className="flex flex-col items-center">
        <div className="bg-asphalt flex h-36 w-36 items-center justify-center rounded-full">
          <TbPlugX aria-hidden className="text-pink h-[5rem] w-[5rem]" />
        </div>

        <p className="pt-7 text-lg text-white">{sessions.length > 1 ? t('disconnectAllApps') : t('disconnectApp')}</p>

        {sessions.length === 1 ? (
          <>
            <div className="mt-3 flex min-h-[2rem] w-full items-center justify-center rounded bg-gray-300/15 px-3">
              <p className="p-2 text-center text-xs">{sessions[0].peer.metadata.name}</p>
            </div>

            <span className="px-2 pt-4 text-center text-xs text-gray-100">{sessions[0].peer.metadata.description}</span>
          </>
        ) : (
          <div className="flex flex-col px-2 pt-4 text-center text-sm text-gray-100">
            <span>{t('totalDapps', { totalDapps: sessions.length })}</span>
            <span>{t('willRemove')}</span>
          </div>
        )}
      </div>

      <div className="mt-auto flex w-full flex-col items-center">
        <Separator />

        <span className="py-6 text-xs">{t('warning')}</span>

        <div className="flex w-full gap-x-4">
          <Button
            className="w-full"
            variant="contained"
            label={t('cancel')}
            onClick={() => modalNavigate(-1)}
            colorSchema="gray"
          />

          {sessions.length === 1 ? (
            <Button
              className="w-full"
              variant="outlined"
              label={t('disconnect')}
              leftIcon={<TbPlugX aria-hidden />}
              colorSchema="error"
              onClick={() => handleDisconnect(sessions[0])}
            />
          ) : (
            <Button
              className="w-full"
              variant="outlined"
              label={t('disconnect')}
              leftIcon={<TbPlugX aria-hidden />}
              colorSchema="error"
              onClick={() => handleDisconnectAll()}
            />
          )}
        </div>
      </div>
    </BottomModalLayout>
  )
}

export default DappDisconnectionModal
