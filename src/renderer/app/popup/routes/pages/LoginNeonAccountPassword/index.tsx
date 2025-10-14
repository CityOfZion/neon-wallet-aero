import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '@renderer/components/Button'
import { Input } from '@renderer/components/Input'
import { Link } from '@renderer/components/Link'
import { useActions } from '@renderer/hooks/useActions'
import { useLogin } from '@renderer/hooks/useLogin'
import { useHasLoginControlSelector } from '@renderer/hooks/useUtilitySelector'

type TFormData = {
  password: string
}

export const LoginNeonAccountPassword = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'loginNeonAccountPassword' })
  const navigate = useNavigate()
  const { loginWithPassword } = useLogin()
  const { hasLoginControlRef } = useHasLoginControlSelector()

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

      navigate('/app/wallets', { replace: true })
    } catch {
      setError('password', t('error.invalidPassword'))
    }
  }

  useEffect(() => {
    if (hasLoginControlRef.current) return

    navigate('/login/neon-account/onboarding', { replace: true })
  }, [hasLoginControlRef, navigate])

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
        className="mt-4 w-full"
        variant="card"
        type="submit"
        disabled={!actionState.isValid || actionState.isActing}
        loading={actionState.isActing}
      />
    </form>
  )
}
