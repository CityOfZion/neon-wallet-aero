import { Fragment } from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Location, useLocation, useNavigate } from 'react-router-dom'
import { match } from 'ts-pattern'

import { Banner } from '@/components/Banner'
import { Button } from '@/components/Button'
import { Textarea } from '@/components/Textarea'
import { UtilsHelper } from '@/helpers/UtilsHelper'
import { TUseBackupOrMigrateActionsData, useBackupOrMigrate } from '@/hooks/useBackupOrMigrate'
import { useImportActions } from '@/hooks/useImportActions'
import { useModalNavigate } from '@/hooks/useModalRouter'
import { TUseNeonMigrateGeneratedData } from '@/hooks/useNeonMigrate'
import { useLastIndexesByWallet } from '@/hooks/useUtilitySelector'
import { bsAggregator } from '@/libs/blockchainService'
import { TAccountsToImport, TBlockchainServiceKey, TWalletToCreate } from '@/types/blockchain'

type TLocationState = {
  password: string
  isMigration?: boolean
}

export const OnboardingImportWalletStep3 = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'onboardingImportWallet.step3' })
  const { t: commonT } = useTranslation('common')
  const { t: modalT } = useTranslation('modals', { keyPrefix: 'decryptKeyModal' })
  const navigate = useNavigate()
  const { state } = useLocation() as Location<TLocationState>
  const { lastIndexesByWalletRef } = useLastIndexesByWallet()
  const { modalNavigate, modalErase } = useModalNavigate()

  const submitAddress = async (address: string) => {
    const wallet: TWalletToCreate = {
      name: commonT('wallet.watchAccount'),
    }
    const serviceNames = bsAggregator.getBlockchainNameByAddress(address)
    const accounts: TAccountsToImport = serviceNames.map(serviceName => ({
      address: address,
      blockchain: serviceName,
      type: 'watch',
    }))

    navigate('/onboarding-import-wallet/4', { state: { wallets: [{ ...wallet, accounts }], password: state.password } })
  }

  const submitKey = async (key: string) => {
    const accounts: TAccountsToImport = []

    await UtilsHelper.promiseAll(Object.values(bsAggregator.blockchainServicesByName), async service => {
      const account = service.generateAccountFromKey(key)
      accounts.push({ address: account.address, blockchain: service.name, key, type: 'standard' })
    })

    const wallet: TWalletToCreate = {
      name: commonT('wallet.encryptedName'),
    }

    navigate('/onboarding-import-wallet/4', {
      state: { wallets: [{ ...wallet, accounts }], password: state.password },
    })
  }

  const submitMnemonic = async (mnemonic: string) => {
    const mnemonicAccounts = await bsAggregator.generateAccountsFromMnemonic(mnemonic, lastIndexesByWalletRef.current)

    const accounts = Array.from(mnemonicAccounts.entries())
      .map<TAccountsToImport>(([blockchain, accounts]) => {
        return accounts.map(account => ({
          address: account.address,
          blockchain,
          key: account.key,
          type: 'standard',
        }))
      })
      .flat()

    const wallet: TWalletToCreate = {
      name: commonT('wallet.mnemonicWalletName'),
      mnemonic,
    }

    navigate('/onboarding-import-wallet/4', {
      state: { wallets: [{ ...wallet, accounts }], password: state.password },
    })
  }

  const submitEncryptedKey = async (encryptedKey: string) => {
    modalNavigate('blockchain-selection', {
      state: {
        heading: t('importEncryptedTitle'),
        description: t('importEncryptedSubtitle'),
        onSubmit: (blockchain: TBlockchainServiceKey) => {
          modalNavigate('decrypt-key', {
            state: {
              heading: modalT('title'),
              description: modalT('description'),
              encryptedKey,
              blockchain,
              onSubmit: async (key: string) => {
                try {
                  await submitKey(key)
                  modalErase('bottom')
                } catch (error) {
                  console.error(error)
                }
              },
            },
          })
        },
      },
    })
  }

  const handleFileSubmit = async (data: TUseBackupOrMigrateActionsData) => {
    if (!data.content || !data.path || !data.type) return

    if (data.type === 'migrate') {
      modalNavigate('migrate-accounts-3', {
        state: {
          content: data.content,
          onDecrypt: ({ accountsToCreate, contactsToCreate, walletToCreate }: TUseNeonMigrateGeneratedData) => {
            modalErase('bottom')
            navigate('/onboarding-import-wallet/4', {
              state: {
                wallets: [{ ...walletToCreate, accounts: accountsToCreate }],
                password: state.password,
                contacts: contactsToCreate,
              },
            })
          },
        },
      })
      return
    }
  }

  const importActions = useImportActions({
    key: submitKey,
    mnemonic: submitMnemonic,
    address: submitAddress,
    encrypted: submitEncryptedKey,
  })

  const fileActions = useBackupOrMigrate()

  const isImport = !state?.isMigration && importActions.actionData.text
  const handleSubmit = isImport
    ? importActions.handleAct(importActions.handleSubmit)
    : fileActions.handleAct(handleFileSubmit)

  useEffect(() => {
    if (!importActions.actionData.text) {
      return
    }

    fileActions.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importActions.actionData.text])

  useEffect(() => {
    if (!fileActions.actionData?.path) {
      return
    }

    importActions.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileActions.actionData.path])

  return (
    <Fragment>
      <p className="mt-10 text-center text-sm text-white">
        {!state.isMigration ? t('formTitle') : t('migrationFormTitle')}
      </p>
      <form className="mt-6 flex w-full flex-grow flex-col items-center" onSubmit={handleSubmit}>
        {!state.isMigration && (
          <Textarea
            aria-label={t('inputPlaceholder')}
            placeholder={t('inputPlaceholder')}
            containerClassName="mb-2.5"
            value={importActions.actionData.text}
            onChange={importActions.handleChange}
            pastable
            clearable
            multiline={importActions.actionData.inputType === 'mnemonic'}
            errorMessage={importActions.actionState.errors.text}
          />
        )}

        <Button
          label={t('locateFileButtonLabel')}
          type="button"
          className="w-64"
          variant="outlined"
          clickableProps={{
            className: 'px-5',
          }}
          onClick={fileActions.handleBrowse}
        />

        {state.isMigration &&
          match({ hasPath: !!fileActions.actionData.path, hasError: !!fileActions.actionState.errors.path })
            .with({ hasPath: true, hasError: false }, () => (
              <Banner type="success" message={t('importSuccess')} className="mt-4" />
            ))
            .with({ hasPath: false, hasError: false }, () => (
              <Banner type="warning" message={t('neon2Warning')} className="mt-4" />
            ))
            .with({ hasError: true }, () => <Banner type="warning" message={t('importError')} className="mt-4" />)
            .otherwise(() => null)}

        <Button
          label={commonT('general.next')}
          className="mt-auto w-64"
          type="submit"
          disabled={importActions.actionData.text ? !importActions.actionState.isValid : !fileActions.actionData.path}
          loading={importActions.actionState.isActing}
        />
      </form>
    </Fragment>
  )
}
