import { useTranslation } from 'react-i18next'

import { AlertErrorBanner } from '@renderer/components/AlertErrorBanner'
import { Button } from '@renderer/components/Button'
import { Input } from '@renderer/components/Input'

import { useActions } from '@renderer/hooks/useActions'
import { useModalState } from '@renderer/hooks/useModalRouter'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import type { TModalState } from '@shared/types/modal'

type TFormData = {
  password: string
}

export const ConfirmPasswordModal = () => {
  const { onSubmit, heading, description, inputLabel, buttonLabel, inputPlaceholder } =
    useModalState<TModalState<'confirm-password'>>()

  const { t } = useTranslation('modals', { keyPrefix: 'confirmPasswordExport' })

  const { actionData, actionState, handleAct, setDataFromEventWrapper, setError } = useActions<TFormData>({
    password: '',
  })

  const handleSubmit = async () => {
    try {
      await onSubmit(actionData.password)
    } catch {
      setError('password', t('error'))
    }
  }

  return (
    <BottomModalLayout heading={heading} className="overflow-y-auto">
      <div className="flex h-full flex-col">
        <p className="mb-5 text-sm">{description}</p>

        <form className="flex flex-grow flex-col justify-between" onSubmit={handleAct(handleSubmit)}>
          <div>
            <Input
              placeholder={inputPlaceholder}
              label={inputLabel}
              error={!!actionState.errors.password}
              value={actionData.password}
              onChange={setDataFromEventWrapper('password')}
              type="password"
            />

            <div className="mt-5">
              {actionState.errors.password && <AlertErrorBanner message={actionState.errors.password} />}
            </div>
          </div>

          <div className="flex w-full flex-col items-center">
            <Button
              variant="card"
              className="w-full"
              type="submit"
              label={buttonLabel}
              loading={actionState.isActing}
              disabled={!actionData.password || !actionState.isValid}
            />
          </div>
        </form>
      </div>
    </BottomModalLayout>
  )
}

export default ConfirmPasswordModal
