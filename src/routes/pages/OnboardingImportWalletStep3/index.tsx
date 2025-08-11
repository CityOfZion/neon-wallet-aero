import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Location, useLocation, useNavigate } from 'react-router-dom'

import { Button } from '@/components/Button'
import { Textarea } from '@/components/Textarea'
import { UtilsHelper } from '@/helpers/UtilsHelper'
import { useImportActions } from '@/hooks/useImportActions'
import { useLastIndexesByWallet } from '@/hooks/useUtilitySelector'
import { bsAggregator } from '@/libs/blockchainService'
import { TAccountsToImport, TWalletToCreate } from '@/types/blockchain'

type TLocationState = {
  password: string
  isMigration?: boolean
}

export const OnboardingImportWalletStep3 = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'onboardingImportWallet.step3' })
  const { t: commonT } = useTranslation('common')
  const navigate = useNavigate()
  const { state } = useLocation() as Location<TLocationState>
  const { lastIndexesByWalletRef } = useLastIndexesByWallet()

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

  const importActions = useImportActions({
    key: submitKey,
    mnemonic: submitMnemonic,
    address: submitAddress,
  })

  return (
    <Fragment>
      <p className="mt-10 text-center text-sm text-white">
        {!state.isMigration ? t('formTitle') : t('migrationFormTitle')}
      </p>
      <form
        className="mt-6 flex w-full flex-grow flex-col items-center"
        onSubmit={importActions.handleAct(importActions.handleSubmit)}
      >
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
          label={commonT('general.next')}
          className="mt-auto w-64"
          type="submit"
          disabled={!importActions.actionState.isValid}
          loading={importActions.actionState.isActing}
        />
      </form>
    </Fragment>
  )
}
