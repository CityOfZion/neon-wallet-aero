import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button } from '@renderer/components/Button'
import { TemporaryLimitsBox } from '@renderer/components/TemporaryLimitsBox'
import { Textarea } from '@renderer/components/Textarea'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'

import { useImportActions } from '@renderer/hooks/useImportActions'
import { useLogin } from '@renderer/hooks/useLogin'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'

import type { TAccountsToImport } from '@shared/types/blockchain'

export const LoginKeyPage = () => {
  const navigate = useNavigate()
  const { loginWithKey } = useLogin()
  const { modalNavigate } = useModalNavigate()
  const { t } = useTranslation('pages', { keyPrefix: 'loginKey' })
  const { t: commonT } = useTranslation('common')

  const submitKey = async (value: string) => {
    modalNavigate('import-accounts-selection', {
      state: {
        value,
        type: 'key',
        onSubmit: async selectedAccounts => {
          const accounts: TAccountsToImport = selectedAccounts.map(account => ({ ...account, type: 'standard' }))

          await loginWithKey(accounts, { name: commonT('wallet.importedWalletName'), type: 'standard' })

          // This adds a slight delay to improve user experience
          await UtilsHelper.sleep(1000)

          navigate('/wallets', { replace: true })
        },
      },
    })
  }

  const submitMnemonic = async (value: string) => {
    modalNavigate('import-accounts-selection', {
      state: {
        value,
        type: 'mnemonic',
        onSubmit: async selectedAccounts => {
          const accounts: TAccountsToImport = selectedAccounts.map(account => ({ ...account, type: 'standard' }))

          await loginWithKey(accounts, {
            name: commonT('wallet.mnemonicWalletName'),
            type: 'standard',
            mnemonic: value,
          })

          // This adds a slight delay to improve user experience
          await UtilsHelper.sleep(1000)

          navigate('/wallets', { replace: true })
        },
      },
    })
  }

  const submitAddress = async (address: string) => {
    const blockchains = BlockchainServiceHelper.bsAggregator.getBlockchainNameByAddress(address)

    const accountsToImport: TAccountsToImport = blockchains.map(blockchain => ({
      blockchain,
      address,
      type: 'watch',
    }))

    await loginWithKey(accountsToImport, { name: commonT('wallet.watchAccount'), type: 'standard' })

    // This adds a slight delay to improve user experience
    await UtilsHelper.sleep(1000)

    navigate('/wallets', { replace: true })
  }

  const { actionData, actionState, handleAct, handleSubmit, handleChange } = useImportActions(
    {
      key: submitKey,
      mnemonic: submitMnemonic,
      address: submitAddress,
    },
    { verifyIfAddressAlreadyExists: false }
  )

  return (
    <form onSubmit={handleAct(handleSubmit)} className="flex w-full grow flex-col items-center">
      <h2 className="text-lg text-white">{t('description')}</h2>

      <Textarea
        id="login-key-value"
        autoFocus
        containerClassName="mt-5"
        placeholder={t('inputPlaceholder')}
        value={actionData.text}
        pastable
        clearable
        onChange={handleChange}
      />

      <TemporaryLimitsBox className="mt-auto w-full pt-4" />

      <Button
        label={t('buttonContinueLabel')}
        className="my-4 w-full"
        variant="card"
        type="submit"
        disabled={!actionState.isValid || actionState.isActing}
        loading={actionState.isActing}
      />
    </form>
  )
}

export default LoginKeyPage
