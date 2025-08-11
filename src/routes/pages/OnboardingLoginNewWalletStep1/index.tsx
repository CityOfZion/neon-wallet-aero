import { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { PasswordHelper } from '@/helpers/PasswordHelper'
import { useActions } from '@/hooks/useActions'

type TFormData = {
  password: string
}

type TProps = {
  onSubmit?: (password: string) => void
}

export const OnboardingLoginNewWalletStep1 = ({ onSubmit }: TProps) => {
  const { t } = useTranslation('pages', { keyPrefix: 'onboardingLoginNewWalletStep1' })
  const { t: commonT } = useTranslation('common')

  const navigate = useNavigate()

  const { actionData, actionState, setData, setError, handleAct } = useActions<TFormData>({ password: '' })

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const password = event.target.value
    setData({ password })

    if (!PasswordHelper.isWeakPassword(password)) {
      setError('password', t('errors.passwordLength', { length: PasswordHelper.MINIMUM_PASSWORD_LENGTH }))
    }
  }

  const handleSubmit = (data: TFormData) => {
    if (onSubmit) {
      onSubmit(data.password)
      return
    }

    navigate('/onboarding-login-new-wallet/2', { state: { password: data.password }, replace: true })
  }

  return (
    <form className="flex w-full flex-grow flex-col justify-between" onSubmit={handleAct(handleSubmit)}>
      <Input
        type="password"
        value={actionData.password}
        onChange={handleChange}
        placeholder={t('passwordInputPlaceholder')}
        label={t('passwordInputLabel')}
        errorMessage={actionState.errors.password}
        autoFocus
      />

      <Button
        label={commonT('general.continue')}
        className="w-full"
        type="submit"
        variant="card"
        disabled={!actionState.isValid || actionState.isActing}
      />
    </form>
  )
}
