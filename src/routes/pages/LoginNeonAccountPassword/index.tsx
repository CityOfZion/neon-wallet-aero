import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Link } from '@/components/Link'
import { useActions } from '@/hooks/useActions'
import { useLogin } from '@/hooks/useLogin'
import { useHasPasswordSelector } from '@/hooks/useUtilitySelector'

type TFormData = {
  password: string
}

export const LoginNeonAccountPassword = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'loginNeonAccountPassword' })
  const navigate = useNavigate()
  const { loginWithPassword } = useLogin()
  const { hasPasswordRef } = useHasPasswordSelector()

  const { actionData, actionState, setData, setError, handleAct } = useActions<TFormData>({
    password: '',
  })

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const password = event.target.value
    setData({ password })

    if (!password.length) {
      setError('password', t('error.invalidPassword'))
      return
    }
  }

  const handleSubmit = async (data: TFormData) => {
    try {
      await loginWithPassword(data.password)
      navigate('/app')
    } catch {
      setError('password', t('error.invalidPassword'))
    }
  }

  useEffect(() => {
    if (hasPasswordRef.current) {
      return
    }

    navigate('/login/neon-account/onboarding', { replace: true })
  })

  return (
    <form className="flex w-full flex-grow flex-col items-center justify-between" onSubmit={handleAct(handleSubmit)}>
      <div className="flex w-full flex-col items-center">
        <h2 className="text-lg text-white">{t('description')}</h2>

        <Input
          containerClassName="mt-10"
          label={t('passwordInputLabel')}
          placeholder={t('passwordInputPlaceholder')}
          type="password"
          value={actionData.password}
          onChange={handleChangePassword}
          errorMessage={actionState.errors.password}
          autoFocus
        />

        <Link
          to="/forgotten-password"
          label={t('forgotPasswordButtonLabel')}
          colorSchema="neon"
          variant="text-slim"
          className="mx-auto mt-2 w-fit p-4"
        />
      </div>

      <Button
        label={t('buttonLoginLabel')}
        className="w-full"
        variant="card"
        type="submit"
        disabled={!actionState.isValid || actionState.isActing}
        loading={actionState.isActing}
      />
    </form>
  )
}
