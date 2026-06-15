import { useState } from 'react'

import { useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'
import { Checkbox } from '@renderer/components/Checkbox'
import { TemporaryLimitsBox } from '@renderer/components/TemporaryLimitsBox'
import { Textarea } from '@renderer/components/Textarea'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'

import { useShouldConfirmActionSelector } from '@renderer/hooks/useAuthSelector'
import { useImportActions } from '@renderer/hooks/useImportActions'
import { useLogin } from '@renderer/hooks/useLogin'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { useAppDispatch } from '@renderer/hooks/useRedux'

import { authReducerActions } from '@renderer/store/reducers/auth'
import type { TAccountsToImport } from '@shared/types/blockchain'

export const LoginKeyPage = () => {
  const { loginWithKey } = useLogin()
  const { modalNavigate } = useModalNavigate()
  const { t } = useTranslation('pages', { keyPrefix: 'loginKey' })
  const { t: tCommon } = useTranslation('common')
  const { shouldConfirmAction } = useShouldConfirmActionSelector('key')

  const dispatch = useAppDispatch()

  const [isShouldConfirmAction, setIsShouldConfirmAction] = useState(shouldConfirmAction)

  const submitKey = async (value: string) => {
    modalNavigate('import-accounts-selection', {
      state: {
        value,
        type: 'key',
        onSubmit: async selectedAccounts => {
          const accounts: TAccountsToImport = selectedAccounts.map(account => ({ ...account, type: 'standard' }))

          await loginWithKey(accounts, { name: tCommon('wallet.importedWalletName'), type: 'standard' })

          dispatch(authReducerActions.setShouldConfirmAction(isShouldConfirmAction))
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
            name: tCommon('wallet.mnemonicWalletName'),
            type: 'standard',
            mnemonic: value,
          })

          dispatch(authReducerActions.setShouldConfirmAction(isShouldConfirmAction))
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

    await loginWithKey(accountsToImport, { name: tCommon('wallet.watchAccount'), type: 'standard' })

    dispatch(authReducerActions.setShouldConfirmAction(isShouldConfirmAction))
  }

  const { actionData, actionState, handleAct, handleSubmit, handleChange } = useImportActions(
    {
      key: submitKey,
      mnemonic: submitMnemonic,
      address: submitAddress,
    },
    { verifyIfAddressAlreadyExists: false }
  )

  const handleIsShouldConfirmActionChange = (value: boolean) => {
    setIsShouldConfirmAction(value)
  }

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

      <div className="flex items-center justify-center gap-2 pt-4 text-white">
        <Checkbox
          id="should-confirm-action"
          checked={isShouldConfirmAction}
          onCheckedChange={handleIsShouldConfirmActionChange}
        />
        <label htmlFor="should-confirm-action">{t('shouldConfirmActionKeyCheckboxLabel')}</label>
      </div>

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
