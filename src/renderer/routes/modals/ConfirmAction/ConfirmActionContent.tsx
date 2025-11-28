import { useTranslation } from 'react-i18next'

import { AlertErrorBanner } from '@renderer/components/AlertErrorBanner'
import { Button } from '@renderer/components/Button'
import { Input } from '@renderer/components/Input'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { useActions } from '@renderer/hooks/useActions'
import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'
import { useLogin } from '@renderer/hooks/useLogin'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'

import type { TConfirmActionModalState } from '@shared/types/modal-router'

type TActionsData = {
  password: string
}

export const ConfirmActionContent = ({ onSuccess, onCancel }: TConfirmActionModalState) => {
  const { t } = useTranslation('modals', { keyPrefix: 'confirmAction' })
  const { loginSessionRef } = useLoginSessionSelector()
  const { encryptPassword } = useLogin()
  const { modalNavigate } = useModalNavigate()

  const { actionData, actionState, handleAct, setDataFromEventWrapper, setError } = useActions<TActionsData>({
    password: '',
  })

  const shouldPromptPassword = loginSessionRef.current?.type === 'password'

  const handleCancel = () => {
    onCancel()
    modalNavigate(-1)
  }

  const handleSubmit = async () => {
    try {
      if (shouldPromptPassword) {
        const encryptedPassword = await encryptPassword(actionData.password)

        if (actionData.password.length === 0 || loginSessionRef.current?.encryptedPassword !== encryptedPassword) {
          setError('password', t('passwordError'))
          return
        }
      }

      onSuccess()
      modalNavigate(-1)
    } catch {
      handleCancel()
    }
  }

  return (
    <div className="flex h-full flex-col">
      <p className="mb-5 text-sm">{shouldPromptPassword ? t('descriptionPassword') : t('descriptionNoPassword')}</p>

      <form
        className={StyleHelper.mergeStyles('flex flex-grow flex-col', {
          'justify-end': !shouldPromptPassword,
          'justify-between': shouldPromptPassword,
        })}
        onSubmit={handleAct(handleSubmit)}
      >
        {shouldPromptPassword && (
          <div>
            <Input
              placeholder={t('inputPlaceholder')}
              error={!!actionState.errors.password}
              value={actionData.password}
              onChange={setDataFromEventWrapper('password')}
              type="password"
            />

            <div className="mt-5">
              {actionState.errors.password && <AlertErrorBanner message={actionState.errors.password} />}
            </div>
          </div>
        )}

        <div className="flex w-full items-center gap-x-4">
          <Button
            type="button"
            variant="card"
            onClick={handleCancel}
            colorSchema="error"
            label={t('cancelButtonLabel')}
          />

          <Button
            variant="card"
            className="w-full"
            type="submit"
            label={t('confirmButtonLabel')}
            loading={actionState.isActing}
            disabled={actionState.isActing || (shouldPromptPassword && (!actionData.password || !actionState.isValid))}
          />
        </div>
      </form>
    </div>
  )
}
