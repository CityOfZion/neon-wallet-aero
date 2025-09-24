import { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Location, useLocation, useNavigate } from 'react-router-dom'
import { generateMnemonic } from '@cityofzion/bs-asteroid-sdk'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { useActions } from '@/hooks/useActions'
import { useBlockchainActions } from '@/hooks/useBlockchainActions'
import { useNewPassword } from '@/hooks/useNewPassword'
import { blockchainNames } from '@/libs/blockchainService'

type TFormData = {
  confirmPassword: string
}

type TLocationState = {
  password: string
}

type TProps = {
  onSubmit?: (password: string) => void
}

export const OnboardingLoginNewWalletStep2 = ({ onSubmit }: TProps) => {
  const { t } = useTranslation('pages', { keyPrefix: 'onboardingLoginNewWalletStep2' })
  const { t: commonT } = useTranslation('common')
  const { state } = useLocation() as Location<TLocationState>
  const navigate = useNavigate()
  const { setNewPassword } = useNewPassword()
  const { createWallet, createStandardAccount } = useBlockchainActions()

  const { actionData, actionState, setData, setError, handleAct } = useActions<TFormData>({ confirmPassword: '' })

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const confirmPassword = event.target.value
    setData({ confirmPassword })

    if (confirmPassword !== state.password) {
      setError('confirmPassword', t('errors.passwordsDoNotMatch'))
    }
  }

  const handleSubmit = async (data: TFormData) => {
    if (onSubmit) {
      onSubmit(state.password)
      return
    }

    await setNewPassword(data.confirmPassword)

    const words = generateMnemonic()

    const wallet = await createWallet({
      name: commonT('wallet.firstWalletName'),
      mnemonic: words.join(' '),
    })

    const promises = blockchainNames.map(blockchain =>
      createStandardAccount({
        wallet,
        blockchain,
        name: commonT('account.defaultName', { accountNumber: 1 }),
      })
    )

    await Promise.allSettled(promises)

    navigate('/onboarding-login-new-wallet/3', { replace: true })
  }

  return (
    <form className="flex w-full flex-grow flex-col justify-between" onSubmit={handleAct(handleSubmit)}>
      <Input
        type="password"
        value={actionData.confirmPassword}
        onChange={handleChange}
        placeholder={t('confirmPasswordInputPlaceholder')}
        label={t('confirmPasswordInputLabel')}
        errorMessage={actionState.errors.confirmPassword}
        autoFocus
      />

      <Button
        label={commonT('general.continue')}
        className="w-full"
        type="submit"
        variant="card"
        disabled={!actionState.isValid || actionState.isActing}
        loading={actionState.isActing}
      />
    </form>
  )
}
