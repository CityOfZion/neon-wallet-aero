import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Banner } from '@renderer/components/Banner'
import { Button } from '@renderer/components/Button'
import { Textarea } from '@renderer/components/Textarea'
import { AccountHelper } from '@renderer/helpers/AccountHelper'
import { useBlockchainActions } from '@renderer/hooks/useBlockchainActions'
import { useImportActions } from '@renderer/hooks/useImportActions'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { ScreenLayout } from '@renderer/layouts/ScreenLayout'
import { TAccountsToImport, TBlockchainServiceKey } from '@shared/types/blockchain'

export const ImportPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'import' })
  const { modalNavigate } = useModalNavigate()
  const { createWallet, importAccounts } = useBlockchainActions()
  const { t: tCommonWallet } = useTranslation('common', { keyPrefix: 'wallet' })
  const navigate = useNavigate()

  const submitAddress = async (value: string) => {
    modalNavigate('import-accounts-selection', {
      state: {
        value,
        type: 'address',
        onSubmit: async selectedAccounts => {
          const accountsToImport: TAccountsToImport = selectedAccounts.map(({ address, blockchain }) => ({
            address,
            blockchain,
            type: 'watch',
          }))

          const wallet = await createWallet({ name: tCommonWallet('watchWalletName') })
          const accounts = await importAccounts({ accounts: accountsToImport, wallet })

          navigate('/app/wallets', {
            state: { wallet, account: AccountHelper.orderAccounts(accounts)[0] },
            replace: true,
          })
        },
      },
    })
  }

  const submitKey = async (value: string) => {
    modalNavigate('import-accounts-selection', {
      state: {
        value,
        type: 'key',
        onSubmit: async selectedAccounts => {
          const accountsToImport: TAccountsToImport = selectedAccounts.map(({ address, blockchain, key }) => ({
            address,
            blockchain,
            key,
            type: 'standard',
          }))

          const wallet = await createWallet({ name: tCommonWallet('importedWalletName') })
          const accounts = await importAccounts({ accounts: accountsToImport, wallet })

          navigate('/app/wallets', {
            state: { wallet, account: AccountHelper.orderAccounts(accounts)[0] },
            replace: true,
          })
        },
      },
    })
  }

  const submitEncryptedKey = async (encryptedKey: string) => {
    modalNavigate('blockchain-selection', {
      state: {
        heading: t('title'),
        description: t('blockchainSelectionDescription'),
        onSubmit: (blockchain: TBlockchainServiceKey) => {
          modalNavigate('decrypt-key', {
            state: {
              heading: t('title'),
              description: t('decryptKeyDescription'),
              encryptedKey,
              blockchain,
              onSubmit: submitKey,
            },
          })
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
          const accountsToImport: TAccountsToImport = selectedAccounts.map(({ address, blockchain, key }) => ({
            address,
            blockchain,
            key,
            type: 'standard',
          }))

          const wallet = await createWallet({ name: tCommonWallet('mnemonicWalletName'), mnemonic: value })
          const accounts = await importAccounts({ accounts: accountsToImport, wallet })

          navigate('/app/wallets', {
            state: { wallet, account: AccountHelper.orderAccounts(accounts)[0] },
            replace: true,
          })
        },
      },
    })
  }

  const { actionData, actionState, handleAct, handleChange, handleSubmit } = useImportActions({
    address: submitAddress,
    key: submitKey,
    encrypted: submitEncryptedKey,
    mnemonic: submitMnemonic,
  })

  return (
    <ScreenLayout heading={t('title')} className="text-white">
      <form className="flex flex-col" onSubmit={handleAct(handleSubmit)}>
        <h2 className="mb-8">{t('subtitle')}</h2>

        <Textarea
          autoFocus
          aria-label={t('form.valueLabel')}
          placeholder={t('form.valuePlaceholder')}
          value={actionData.text}
          containerClassName="mb-4"
          multiline={actionData.inputType === 'mnemonic'}
          clearable
          pastable
          required
          error={!!actionState.errors.text}
          onChange={handleChange}
        />

        {actionState.errors.text ? (
          <Banner type="error" message={actionState.errors.text} />
        ) : (
          actionState.isValid &&
          actionData.inputType && <Banner type="success" message={t(`successBanner.${actionData.inputType}`)} />
        )}

        <Button
          label={t('submitButtonLabel')}
          type="submit"
          className="mt-12"
          disabled={!actionData.text || !actionState.isValid}
          loading={actionState.isActing}
        />
      </form>
    </ScreenLayout>
  )
}
