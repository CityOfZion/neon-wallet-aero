import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Account } from '@cityofzion/blockchain-service'

import { ToastHelper } from '@/helpers/ToastHelper'
import { useAccountUtils } from '@/hooks/useAccountUtils'
import { useActions } from '@/hooks/useActions'
import { useBlockchainActions } from '@/hooks/useBlockchainActions'
import { useModalNavigate } from '@/hooks/useModalRouter'
import { useMountUnsafe } from '@/hooks/useMountUnsafe'
import { useLastIndexesByWallet } from '@/hooks/useUtilitySelector'
import { bsAggregator } from '@/libs/blockchainService'
import { TBlockchainAccounts } from '@/routes/modals/ImportAccountsSelection/index'
import { TAccountsToImport, TBlockchainServiceKey } from '@/types/blockchain'

import { ImportAccountsSelectionForm } from './ImportAccountsSelectionForm'

type TActionsData = {
  blockchainAccounts: TBlockchainAccounts
  selectedAccounts: Account<TBlockchainServiceKey>[]
}

type TProps = {
  value: string
}

export const ImportAccountsSelectionMnemonic = ({ value }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'importAccountsSelectionModal' })
  const { t: tCommonWallet } = useTranslation('common', { keyPrefix: 'wallet' })
  const { modalErase } = useModalNavigate()
  const navigate = useNavigate()
  const { doesAccountExist } = useAccountUtils()
  const { importAccounts, createWallet } = useBlockchainActions()
  const { lastIndexesByWallet } = useLastIndexesByWallet()

  const {
    actionData: { blockchainAccounts, selectedAccounts },
    actionState,
    setData,
    handleAct,
  } = useActions<TActionsData>({ blockchainAccounts: {}, selectedAccounts: [] })

  const isDisabled = actionState.isActing || !actionState.isValid || selectedAccounts.length === 0

  const handleSelectAccounts = (newSelectedAccounts: Account<TBlockchainServiceKey>[]) => {
    setData({ selectedAccounts: newSelectedAccounts })
  }

  const handleSubmit = async () => {
    if (isDisabled) return

    try {
      const accountsToImport: TAccountsToImport = selectedAccounts.map(({ address, blockchain, key }) => ({
        address,
        blockchain,
        key,
        type: 'standard',
      }))

      const wallet = await createWallet({ name: tCommonWallet('mnemonicWalletName'), mnemonic: value })
      const accounts = await importAccounts({ accounts: accountsToImport, wallet })

      ToastHelper.success({ message: t('successes.accountsImported') })

      modalErase('bottom')
      navigate('/app/wallets', { state: { wallet, account: accounts[0] }, replace: true })
    } catch (error) {
      console.error(error)

      ToastHelper.error({ message: t('errors.walletAndAccounts') })
    }
  }

  const { isMounting } = useMountUnsafe(async () => {
    const mappedBlockchainAccounts = await bsAggregator.generateAccountsFromMnemonic(value, lastIndexesByWallet)

    const newBlockchainAccounts: TBlockchainAccounts = mappedBlockchainAccounts
      .entries()
      .reduce((result, [blockchainName, accounts]) => {
        const nextAccounts = accounts.filter(account => !doesAccountExist(account))

        if (nextAccounts.length === 0) return result

        return { ...result, [blockchainName]: nextAccounts }
      }, {})

    setData({ blockchainAccounts: newBlockchainAccounts })

    handleSelectAccounts(Object.values(newBlockchainAccounts).flat())
  }, 500)

  return (
    <ImportAccountsSelectionForm
      isMounting={isMounting}
      isDisabled={isDisabled}
      isSubmitting={actionState.isActing}
      blockchainAccounts={blockchainAccounts}
      selectedAccounts={selectedAccounts}
      onSelect={handleSelectAccounts}
      onSubmit={handleAct(handleSubmit)}
    />
  )
}
