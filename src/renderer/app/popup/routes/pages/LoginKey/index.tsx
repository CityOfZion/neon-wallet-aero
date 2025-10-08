import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '@renderer/components/Button'
import { TemporaryLimitsBox } from '@renderer/components/TemporaryLimitsBox'
import { Textarea } from '@renderer/components/Textarea'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'
import { useImportActions } from '@renderer/hooks/useImportActions'
import { useLogin } from '@renderer/hooks/useLogin'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { bsAggregator } from '@renderer/libs/blockchainService'
import { TAccountsToImport } from '@shared/types/blockchain'

export const LoginKey = () => {
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
          await loginWithKey(accounts, {
            name: commonT('wallet.importedWalletName'),
            type: 'standard',
          })

          // This adds a slight delay to improve user experience
          await UtilsHelper.sleep(1000)

          navigate('/app/wallets', { replace: true })
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

          navigate('/app/wallets', { replace: true })
        },
      },
    })
  }

  const submitAddress = async (address: string) => {
    const blockchains = bsAggregator.getBlockchainNameByAddress(address)
    const accountsToImport: TAccountsToImport = blockchains.map(blockchain => ({
      blockchain,
      address,
      type: 'watch',
    }))

    await loginWithKey(accountsToImport, {
      name: commonT('wallet.watchAccount'),
      type: 'standard',
    })
    navigate('/app/wallets', { replace: true })
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
    <form
      onSubmit={handleAct(handleSubmit)}
      className="flex w-full flex-grow flex-col items-center justify-between pb-10"
    >
      <h2 className="mb-2 text-lg text-white">{t('description')}</h2>

      <div className="flex w-full flex-col items-center">
        <Textarea
          placeholder={t('inputPlaceholder')}
          value={actionData.text}
          pastable
          clearable
          onChange={handleChange}
        />
        <TemporaryLimitsBox className="mt-4 w-full" />
      </div>

      <Button
        label={t('buttonContinueLabel')}
        className="mt-4 w-full"
        variant="card"
        type="submit"
        disabled={!actionState.isValid || actionState.isActing}
        loading={actionState.isActing}
      />
    </form>
  )
}
