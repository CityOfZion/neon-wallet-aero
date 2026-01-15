import { useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'
import { Input } from '@renderer/components/Input'
import { Textarea } from '@renderer/components/Textarea'

import { ClickupHelper } from '@renderer/helpers/ClickupHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { useActions } from '@renderer/hooks/useActions'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import TbSend from '@renderer/assets/images/tb-send.svg?react'

import { SupportTicketSuccessContent } from './SupportTicketSuccessContent'

type TActionsData = {
  email: string
  name: string
  description: string
}

export const SupportTicketModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'supportTicket' })
  const { modalNavigateWrapper, modalNavigate } = useModalNavigate()

  const { actionData, setDataFromEventWrapper, handleAct, actionState, setError } = useActions<TActionsData>({
    name: '',
    email: '',
    description: '',
  })

  const isDisabled = !actionData.name || !actionData.email || !actionData.description || actionState.isActing

  const onSubmit = async () => {
    const name = actionData.name.trim()
    const email = actionData.email.trim()
    const description = actionData.description.trim()

    if (!name) {
      setError('name', t('errors.nameRequired'))
      return
    }

    if (!email) {
      setError('email', t('errors.emailRequired'))
      return
    }

    if (!description) {
      setError('description', t('errors.descriptionRequired'))
      return
    }

    try {
      await ClickupHelper.createSupportTicket({ name, email, description })

      modalNavigate('success', {
        replace: true,
        state: {
          heading: t('title'),
          subtitle: t('successContent.title'),
          content: <SupportTicketSuccessContent />,
        },
      })
    } catch {
      ToastHelper.error({ message: t('errors.submitError') })
    }
  }

  return (
    <BottomModalLayout heading={t('title')}>
      <form onSubmit={handleAct(onSubmit)} className="flex h-full flex-col justify-between gap-y-5">
        <Input
          id="name"
          label={t('nameLabel')}
          onChange={setDataFromEventWrapper('name')}
          value={actionData.name}
          maxLength={50}
          contentClassName="bg-asphalt"
          placeholder={t('namePlaceholder')}
          errorMessage={actionState.errors.name}
          autoFocus
        />

        <Input
          id="email"
          label={t('emailLabel')}
          onChange={setDataFromEventWrapper('email')}
          value={actionData.email}
          maxLength={254}
          contentClassName="bg-asphalt"
          placeholder={t('emailPlaceholder')}
          errorMessage={actionState.errors.email}
          type="email"
        />

        <Textarea
          id="description"
          value={actionData.description}
          placeholder={t('descriptionPlaceholder')}
          onChange={setDataFromEventWrapper('description')}
          className="max-h-40 min-h-40 overflow-y-auto"
          errorMessage={actionState.errors.description}
          label={t('descriptionLabel')}
          maxLength={3000}
        />

        <div className="mt-auto flex justify-center gap-x-4">
          <Button
            variant="card"
            colorSchema="gray"
            label={t('cancelButtonLabel')}
            disabled={actionState.isActing}
            className="w-full"
            onClick={modalNavigateWrapper(-1)}
          />

          <Button
            type="submit"
            variant="card"
            label={t('submitTicketButtonLabel')}
            leftIcon={<TbSend aria-hidden />}
            iconsOnEdge={false}
            disabled={isDisabled}
            loading={actionState.isActing}
            className="min-w-64"
          />
        </div>
      </form>
    </BottomModalLayout>
  )
}

export default SupportTicketModal
