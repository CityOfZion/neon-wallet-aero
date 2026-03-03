import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Banner } from '@renderer/components/Banner'
import { Button } from '@renderer/components/Button'
import { Textarea } from '@renderer/components/Textarea'

import { AnalyticsHelper } from '@renderer/helpers/AnalyticsHelper'

import { useBlockchainActions } from '@renderer/hooks/useBlockchainActions'
import { useImportActions } from '@renderer/hooks/useImportActions'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'

import { ScreenLayout } from '@renderer/layouts/ScreenLayout'

import type { TAccountsToImport, TBlockchainServiceKey } from '@shared/types/blockchain'

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

          await importAccounts({ accounts: accountsToImport, wallet })

          AnalyticsHelper.logEvent('wallet_imported')

          navigate('/wallets', {
            state: { wallet },
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

          await importAccounts({ accounts: accountsToImport, wallet })

          AnalyticsHelper.logEvent('wallet_imported')

          navigate('/wallets', {
            state: { wallet },
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
        onSelect: ([blockchain]: TBlockchainServiceKey[]) => {
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

          const wallet = await createWallet({
            name: tCommonWallet('mnemonicWalletName'),
            mnemonic: value,
          })

          await importAccounts({ accounts: accountsToImport, wallet })

          AnalyticsHelper.logEvent('wallet_imported')

          navigate('/wallets', {
            state: { wallet },
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
      <form className="flex flex-1 flex-col" onSubmit={handleAct(handleSubmit)}>
        <h2 className="mb-8">{t('subtitle')}</h2>

        <Textarea
          id="import-value"
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
          className="mt-auto"
          disabled={!actionData.text || !actionState.isValid}
          loading={actionState.isActing}
        />
      </form>
    </ScreenLayout>
  )
}

export default ImportPage
