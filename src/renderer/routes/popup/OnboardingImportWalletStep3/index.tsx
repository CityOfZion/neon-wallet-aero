import { Fragment } from 'react'
import { useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import type { Location } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { match } from 'ts-pattern'

import { Banner } from '@renderer/components/Banner'
import { Button } from '@renderer/components/Button'
import { Textarea } from '@renderer/components/Textarea'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { AppError } from '@renderer/helpers/ErrorHelper'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'

import type { TUseBackupOrMigrateActionsData } from '@renderer/hooks/useBackupOrMigrate'
import { useBackupOrMigrate } from '@renderer/hooks/useBackupOrMigrate'
import { useImportActions } from '@renderer/hooks/useImportActions'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { useNeonImportBackup } from '@renderer/hooks/useNeonBackup'
import { useLastIndexesByWallet } from '@renderer/hooks/useUtilitySelector'

import type { TAccountsToImport, TBlockchainServiceKey, TWalletToCreate } from '@shared/types/blockchain'
import type { TUseNeonMigrateGeneratedData } from '@shared/types/hooks'

type TLocationState = {
  password: string
  isMigration?: boolean
}

export const OnboardingImportWalletStep3Page = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'onboardingImportWallet.step3' })
  const { t: commonT } = useTranslation('common')
  const { t: decryptKeyT } = useTranslation('modals', { keyPrefix: 'decryptKey' })
  const { t: confirmPasswordT } = useTranslation('pages', { keyPrefix: 'settings.confirmPasswordRecover' })
  const navigate = useNavigate()
  const { state } = useLocation() as Location<TLocationState>
  const { lastIndexesByWalletRef } = useLastIndexesByWallet()
  const { handleTryDecryptData, handleGenerateData } = useNeonImportBackup()

  const { modalNavigate, modalErase } = useModalNavigate()

  const submitAddress = async (address: string) => {
    const wallet: TWalletToCreate = {
      name: commonT('wallet.watchAccount'),
    }
    const serviceNames = BlockchainServiceHelper.bsAggregator.getBlockchainNameByAddress(address)
    const accounts: TAccountsToImport = serviceNames.map(serviceName => ({
      address: address,
      blockchain: serviceName,
      type: 'watch',
    }))

    navigate('/onboarding-import-wallet/4', { state: { wallets: [{ ...wallet, accounts }], password: state.password } })
  }

  const submitKey = async (key: string) => {
    const accounts: TAccountsToImport = []

    await UtilsHelper.promiseAll(
      Object.values(BlockchainServiceHelper.bsAggregator.blockchainServicesByName),
      async service => {
        const account = service.generateAccountFromKey(key)
        accounts.push({ address: account.address, blockchain: service.name, key, type: 'standard' })
      }
    )

    const wallet: TWalletToCreate = {
      name: commonT('wallet.encryptedName'),
    }

    navigate('/onboarding-import-wallet/4', {
      state: { wallets: [{ ...wallet, accounts }], password: state.password },
    })
  }

  const submitMnemonic = async (mnemonic: string) => {
    const mnemonicAccounts = await BlockchainServiceHelper.bsAggregator.generateAccountsFromMnemonic(
      mnemonic,
      lastIndexesByWalletRef.current
    )

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
              heading: decryptKeyT('title'),
              description: decryptKeyT('description'),
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
      modalNavigate('migrate-from-neon2-3', {
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

    modalNavigate('confirm-password', {
      state: {
        heading: confirmPasswordT('title'),
        description: confirmPasswordT('description'),
        inputLabel: confirmPasswordT('subtitle'),
        buttonLabel: confirmPasswordT('buttonContinueLabel'),
        inputPlaceholder: confirmPasswordT('inputPlaceholder'),
        onSubmit: async (backupPassword: string) => {
          try {
            const decryptedData = await handleTryDecryptData(data, backupPassword)
            const generatedData = handleGenerateData(decryptedData)

            const wallets: TWalletToCreate[] = generatedData.wallets.map(wallet => ({
              name: wallet.name,
              backupStatus: wallet.backupStatus,
              mnemonic: wallet.mnemonic,
              accounts: wallet.accounts.map(account => ({
                address: account.address,
                blockchain: account.blockchain as TBlockchainServiceKey,
                key: account.key,
                type: account.type as 'standard' | 'watch' | 'hardware' | 'ledger',
              })),
            }))

            navigate('/onboarding-import-wallet/4', {
              state: {
                wallets,
                password: state.password,
                contacts: decryptedData.contacts,
              },
            })

            modalErase('bottom')
          } catch (error) {
            throw new AppError(confirmPasswordT('passwordError'), error)
          }
        },
      },
    })
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
      <p className="text-center text-sm text-white">{!state.isMigration ? t('formTitle') : t('migrationFormTitle')}</p>
      <form
        className="mt-4 -mb-3.5 flex w-full grow-1 flex-col items-center justify-between pb-4"
        onSubmit={handleSubmit}
      >
        <div className="flex w-full flex-col items-center gap-2">
          {!state.isMigration && (
            <Textarea
              id="import-value"
              autoFocus
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
        </div>

        {state &&
          match({
            hasPath: !!fileActions.actionData.path,
            hasError: !!fileActions.actionState.errors.path,
            isMigration: !!state.isMigration,
          })
            .with({ hasPath: true, hasError: false }, () => (
              <Banner type="success" message={t('importSuccess')} className="mt-2" textClassName="py-4" />
            ))
            .with({ hasPath: false, hasError: false, isMigration: true }, () => (
              <Banner type="warning" message={t('neon2Warning')} className="mt-2" textClassName="py-4" />
            ))
            .with({ hasError: true }, () => (
              <Banner type="warning" message={t('importError')} className="mt-2" textClassName="py-4" />
            ))
            .otherwise(() => null)}

        <Button
          label={commonT('general.next')}
          className="mt-4 w-full"
          type="submit"
          variant="card"
          disabled={importActions.actionData.text ? !importActions.actionState.isValid : !fileActions.actionData.path}
          loading={importActions.actionState.isActing}
        />
      </form>
    </Fragment>
  )
}

export default OnboardingImportWalletStep3Page
