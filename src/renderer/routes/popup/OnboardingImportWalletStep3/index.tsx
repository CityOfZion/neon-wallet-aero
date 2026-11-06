import { Fragment, useEffect, useMemo } from 'react'

import { useTranslation } from 'react-i18next'
import type { Location } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router-dom'

import { Banner } from '@renderer/components/Banner'
import { Button } from '@renderer/components/Button'
import { IconButton } from '@renderer/components/IconButton'
import { Textarea } from '@renderer/components/Textarea'
import { Tooltip } from '@renderer/components/Tooltip'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'

import { useImportActions } from '@renderer/hooks/useImportActions'
import type { TUseImportFromFileActionsData } from '@renderer/hooks/useImportFromFile'
import { useImportFromFile } from '@renderer/hooks/useImportFromFile'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { useNeonBackupFile } from '@renderer/hooks/useNeonBackupFile'

import MdClose from '@renderer/assets/images/md-close.svg?react'
import TbFileImport from '@renderer/assets/images/tb-file-import.svg?react'

import { AppError } from '@shared/helpers/ErrorHelper'
import type { TAccountsToImport, TBlockchainServiceKey, TWalletToCreate } from '@shared/types/blockchain'
import type { TUseNeonMigrateGeneratedData, TUseNep6GeneratedData } from '@shared/types/hooks'

type TLocationState = {
  password: string
  isMigration?: boolean
}

export const OnboardingImportWalletStep3Page = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'onboardingImportWallet.step3' })
  const { t: tCommon } = useTranslation('common')
  const { t: tDecryptKey } = useTranslation('modals', { keyPrefix: 'decryptKey' })
  const { t: tConfirmPassword } = useTranslation('pages', { keyPrefix: 'settings.confirmPasswordRecover' })
  const navigate = useNavigate()
  const { state } = useLocation() as Location<TLocationState>
  const { handleTryDecryptData, handleGenerateData } = useNeonBackupFile()

  const { modalNavigate, modalErase } = useModalNavigate()

  const submitAddress = async (address: string) => {
    const wallet: TWalletToCreate = {
      name: tCommon('wallet.watchAccount'),
    }
    const serviceNames = BlockchainServiceHelper.bsAggregator.getBlockchainNameByAddress(address)
    const accounts: TAccountsToImport = serviceNames.map(serviceName => ({
      address: address,
      blockchain: serviceName,
      type: 'watch',
    }))

    navigate('/onboarding-import-wallet/4', { state: { wallets: [{ ...wallet, accounts }], password: state.password } })
  }

  const openAccountsSelection = (value: string, type: 'key' | 'mnemonic', wallet: TWalletToCreate) => {
    modalNavigate('import-accounts-selection', {
      state: {
        value,
        type,
        showSuccessToast: false,
        onSubmit: async selectedAccounts => {
          const accounts: TAccountsToImport = selectedAccounts.map(({ address, blockchain, key, order }) => ({
            address,
            blockchain,
            key,
            order,
            type: 'standard',
          }))

          navigate('/onboarding-import-wallet/4', {
            state: { wallets: [{ ...wallet, accounts }], password: state.password },
          })
        },
      },
    })
  }

  const submitKey = async (key: string) => {
    openAccountsSelection(key, 'key', { name: tCommon('wallet.encryptedName') })
  }

  const submitMnemonic = async (mnemonic: string) => {
    openAccountsSelection(mnemonic, 'mnemonic', { name: tCommon('wallet.mnemonicWalletName'), mnemonic })
  }

  const submitEncryptedKey = async (encryptedKey: string) => {
    modalNavigate('blockchain-selection', {
      state: {
        heading: t('importEncryptedTitle'),
        description: t('importEncryptedSubtitle'),
        onSelect: ([blockchain]: TBlockchainServiceKey[]) => {
          modalNavigate('decrypt-key', {
            state: {
              heading: tDecryptKey('title'),
              description: tDecryptKey('description'),
              encryptedKey,
              blockchain,
              onSubmit: submitKey,
            },
          })
        },
      },
    })
  }

  const handleFileSubmit = async (data: TUseImportFromFileActionsData) => {
    if (!data.content || !data.path || !data.type) return

    if (data.type === 'migrate') {
      const onDecrypt = (generatedData: TUseNeonMigrateGeneratedData) => {
        modalErase('bottom')
        navigate('/onboarding-import-wallet/4', {
          state: {
            wallets: [{ ...generatedData.walletToCreate, accounts: generatedData.accountsToCreate }],
            password: state.password,
            contacts: generatedData.contactsToCreate,
          },
        })
      }

      modalNavigate('migrate-from-neon2-3', { state: { content: data.content, onDecrypt } })

      return
    }

    if (data.type === 'nep6') {
      const onDecrypt = (generatedData: TUseNep6GeneratedData) => {
        modalErase('bottom')
        navigate('/onboarding-import-wallet/4', {
          state: {
            wallets: [{ ...generatedData.walletToCreate, accounts: generatedData.accountsToCreate }],
            password: state.password,
          },
        })
      }

      modalNavigate('nep6-backup-import-step-3', { state: { content: data.content, onDecrypt } })

      return
    }

    modalNavigate('confirm-password', {
      state: {
        heading: tConfirmPassword('title'),
        description: tConfirmPassword('description'),
        inputLabel: tConfirmPassword('subtitle'),
        buttonLabel: tConfirmPassword('buttonContinueLabel'),
        inputPlaceholder: tConfirmPassword('inputPlaceholder'),
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
            throw new AppError(tConfirmPassword('passwordError'), error)
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

  const fileActions = useImportFromFile()

  const fileName = useMemo(
    () => fileActions.actionData.path?.split(/[\\/]/).filter(Boolean).pop(),
    [fileActions.actionData.path]
  )

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

      <form className="mt-4 -mb-3.5 flex w-full grow flex-col items-center pb-4" onSubmit={handleSubmit}>
        <div className="flex w-full flex-col items-center gap-5">
          {!state.isMigration && (
            <Textarea
              id="import-value"
              autoFocus
              aria-label={t('inputPlaceholder')}
              placeholder={t('inputPlaceholder')}
              value={importActions.actionData.text}
              onChange={importActions.handleChange}
              pastable
              clearable
              multiline={importActions.actionData.inputType === 'mnemonic'}
              errorMessage={importActions.actionState.errors.text}
              disabled={!!fileName}
            />
          )}

          {fileName ? (
            <div className="bg-asphalt ring-neon/40 flex w-full items-center justify-between gap-2 rounded p-3 ring-1">
              <div className="flex min-w-0 items-center gap-2">
                <div className="bg-neon/10 flex size-9 shrink-0 items-center justify-center rounded">
                  <TbFileImport aria-hidden className="text-neon size-5" />
                </div>

                <div className="flex min-w-0 flex-col">
                  <Tooltip title={fileName}>
                    <span className="truncate text-sm font-medium text-white">{fileName}</span>
                  </Tooltip>

                  <span className="text-xs text-gray-300">{t('fileSelected')}</span>
                </div>
              </div>

              <Tooltip title={tCommon('general.remove')}>
                <IconButton
                  aria-label={tCommon('general.remove')}
                  type="button"
                  icon={<MdClose aria-hidden />}
                  onClick={fileActions.reset}
                />
              </Tooltip>
            </div>
          ) : (
            <Button
              label={t('locateFileButtonLabel')}
              type="button"
              className="w-64"
              variant="outlined"
              clickableProps={{ className: 'px-5' }}
              onClick={fileActions.handleBrowse}
            />
          )}
        </div>

        {state?.isMigration && !fileActions.actionData.path && !fileActions.actionState.errors.path && (
          <Banner type="warning" message={t('neon2Warning')} className="mt-5" textClassName="py-4" />
        )}

        <div className="mt-auto flex w-full justify-center">
          <Button
            label={tCommon('general.next')}
            className="mt-5 w-full"
            type="submit"
            variant="card"
            disabled={importActions.actionData.text ? !importActions.actionState.isValid : !fileActions.actionData.path}
            loading={importActions.actionState.isActing}
          />
        </div>
      </form>
    </Fragment>
  )
}

export default OnboardingImportWalletStep3Page
