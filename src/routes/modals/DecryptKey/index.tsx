import { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { hasEncryption } from '@cityofzion/blockchain-service'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { ToastHelper } from '@/helpers/ToastHelper'
import { useActions } from '@/hooks/useActions'
import { useModalState } from '@/hooks/useModalRouter'
import { BottomModalLayout } from '@/layouts/BottomModalLayout'
import { bsAggregator } from '@/libs/blockchainService'
import { TModalState } from '@/types/modal'

type TActionsData = {
  password: string
}

export const DecryptKeyModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'decryptKeyModal' })
  const { heading, description, encryptedKey, blockchain, onSubmit } = useModalState<TModalState<'decrypt-key'>>()

  const {
    actionData: { password },
    actionState,
    setData,
    handleAct,
  } = useActions<TActionsData>({ password: '' })

  const isDisabled = !password || !actionState.isValid || actionState.isActing

  const handleChangePassword = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setData({ password: target.value })
  }

  const handleSubmit = async () => {
    if (isDisabled) return

    try {
      const service = bsAggregator.blockchainServicesByName[blockchain]

      if (!hasEncryption(service)) {
        ToastHelper.error({ message: t('errors.noEncryptionInterfaceError') })

        return
      }

      const { key } = await service.decrypt(encryptedKey, password)

      await onSubmit(key)
    } catch (error) {
      console.error(error)
      ToastHelper.error({ message: t('decryptKeyError') })
    }
  }

  return (
    <BottomModalLayout heading={heading} className="overflow-y-auto">
      <form className="mt-4 flex flex-grow flex-col" onSubmit={handleAct(handleSubmit)}>
        <h2 className="mb-8 text-center">{description}</h2>

        <Input
          label={t('passwordLabel')}
          placeholder={t('passwordPlaceholder')}
          type="password"
          value={password}
          autoFocus
          clearable
          required
          onChange={handleChangePassword}
        />

        <div className="mt-8 flex flex-grow flex-col justify-end">
          <Button label={t('nextButtonLabel')} type="submit" disabled={isDisabled} loading={actionState.isActing} />
        </div>
      </form>
    </BottomModalLayout>
  )
}
