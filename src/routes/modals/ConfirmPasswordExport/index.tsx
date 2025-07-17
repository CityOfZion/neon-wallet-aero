import { useTranslation } from 'react-i18next'

import { AlertErrorBanner } from '@/components/AlertErrorBanner'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { useActions } from '@/hooks/useActions'
import { useLoginSessionSelector } from '@/hooks/useAuthSelector'
import { useLogin } from '@/hooks/useLogin'
import { useModalState } from '@/hooks/useModalRouter'
import { BottomModalLayout } from '@/layouts/BottomModalLayout'

type TFormData = {
  password: string
}

type TLocationState = {
  title: string
  onSubmitPassword: () => void
}

export const ConfirmPasswordExportModal = () => {
  const { onSubmitPassword, title } = useModalState<TLocationState>()
  const { loginSessionRef } = useLoginSessionSelector()
  const { t } = useTranslation('modals', { keyPrefix: 'confirmPasswordExport' })
  const { encryptPassword } = useLogin()

  const { actionData, actionState, handleAct, setDataFromEventWrapper, setError } = useActions<TFormData>({
    password: '',
  })

  const handleSubmit = async ({ password }: TFormData) => {
    if (!loginSessionRef.current) {
      throw new Error('Login session not defined')
    }

    const encryptedPassword = await encryptPassword(password)

    if (loginSessionRef.current.encryptedPassword !== encryptedPassword) {
      setError('password', t('error'))
      return
    }

    onSubmitPassword()
  }

  return (
    <BottomModalLayout heading={title} className="overflow-y-auto">
      <div className="flex h-full flex-col px-3.5">
        <p className="mb-5 text-sm">{t('description')}</p>

        <form className="flex flex-grow flex-col justify-between" onSubmit={handleAct(handleSubmit)}>
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

          <div className="flex w-full flex-col items-center">
            <Button
              variant="card"
              className="w-full"
              type="submit"
              label={t('buttonContinueLabel')}
              loading={actionState.isActing}
            />
          </div>
        </form>
      </div>
    </BottomModalLayout>
  )
}
