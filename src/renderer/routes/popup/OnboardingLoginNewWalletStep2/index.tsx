import { BSKeychainHelper } from '@cityofzion/blockchain-service'
import type { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { Location } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router-dom'

import { Button } from '@renderer/components/Button'
import { Input } from '@renderer/components/Input'

import { useActions } from '@renderer/hooks/useActions'
import { useBlockchainActions } from '@renderer/hooks/useBlockchainActions'
import { useSignup } from '@renderer/hooks/useLogin'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'

type TFormData = {
  confirmPassword: string
}

type TLocationState = {
  password: string
}

type TProps = {
  onSubmit?: (password: string) => void
}

export const OnboardingLoginNewWalletStep2Page = ({ onSubmit }: TProps) => {
  const { t } = useTranslation('pages', { keyPrefix: 'onboardingLoginNewWalletStep2' })
  const { t: tCommon } = useTranslation('common')
  const { state } = useLocation() as Location<TLocationState>
  const navigate = useNavigate()
  const { modalNavigate, modalErase } = useModalNavigate()
  const { signup } = useSignup()
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

    modalNavigate('blockchain-selection', {
      state: {
        heading: t('blockchainSelectionModalTitle'),
        description: t('blockchainSelectionModalDescription'),
        isMulti: true,
        onSelect: async (blockchains: TBlockchainServiceKey[]) => {
          await signup(data.confirmPassword)

          const mnemonic = BSKeychainHelper.generateMnemonic()

          const wallet = await createWallet({
            name: tCommon('wallet.firstWalletName'),
            mnemonic,
          })

          const promises = blockchains.map(blockchain =>
            createStandardAccount({
              wallet,
              blockchain,
              name: tCommon('account.defaultName', { accountNumber: 1 }),
            })
          )

          await Promise.allSettled(promises)

          modalErase('bottom')

          navigate('/onboarding-login-new-wallet/3', { replace: true })
        },
      },
    })
  }

  return (
    <form className="flex w-full flex-grow flex-col justify-between" onSubmit={handleAct(handleSubmit)}>
      <Input
        name="password"
        id="name"
        type="password"
        value={actionData.confirmPassword}
        onChange={handleChange}
        placeholder={t('confirmPasswordInputPlaceholder')}
        label={t('confirmPasswordInputLabel')}
        errorMessage={actionState.errors.confirmPassword}
        autoFocus
      />

      <Button
        label={tCommon('general.continue')}
        className="w-full"
        type="submit"
        variant="card"
        disabled={!actionState.isValid || actionState.isActing}
        loading={actionState.isActing}
      />
    </form>
  )
}

export default OnboardingLoginNewWalletStep2Page
