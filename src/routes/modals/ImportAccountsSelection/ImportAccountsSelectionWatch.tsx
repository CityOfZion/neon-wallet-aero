import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Account } from '@cityofzion/blockchain-service'

import { Banner } from '@/components/Banner'
import { ToastHelper } from '@/helpers/ToastHelper'
import { useAccountUtils } from '@/hooks/useAccountUtils'
import { useActions } from '@/hooks/useActions'
import { useBlockchainActions } from '@/hooks/useBlockchainActions'
import { useModalNavigate } from '@/hooks/useModalRouter'
import { useMountUnsafe } from '@/hooks/useMountUnsafe'
import { bsAggregator } from '@/libs/blockchainService'
import { TAccountsToImport, TBlockchainServiceKey } from '@/types/blockchain'

import { ImportAccountsSelectionForm } from './ImportAccountsSelectionForm'
import { TBlockchainAccounts } from '.'

type TActionsData = {
  blockchainAccounts: TBlockchainAccounts
  selectedAccounts: Account<TBlockchainServiceKey>[]
}

type TProps = {
  value: string
}

export const ImportAccountsSelectionWatch = ({ value }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'importAccountsSelectionModal' })
  const { t: tCommonWallet } = useTranslation('common', { keyPrefix: 'wallet' })
  const { modalErase } = useModalNavigate()
  const navigate = useNavigate()
  const { doesAccountExist } = useAccountUtils()
  const { importAccounts, createWallet } = useBlockchainActions()

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
      const accountsToImport: TAccountsToImport = selectedAccounts.map(({ address, blockchain }) => ({
        address,
        blockchain,
        type: 'watch',
      }))

      const wallet = await createWallet({ name: tCommonWallet('watchWalletName') })
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
    const services = Object.values(bsAggregator.blockchainServicesByName)
    const serviceFromAddress = services.find(service => service.validateAddress(value))

    if (!serviceFromAddress || doesAccountExist({ address: value, blockchain: serviceFromAddress.name })) return

    const newBlockchainAccounts: TBlockchainAccounts = {
      [serviceFromAddress.name]: [
        {
          address: value,
          key: '',
          type: 'publicKey',
          blockchain: serviceFromAddress.name,
        },
      ],
    }

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
    >
      <Banner message={t('watch.addressInformation')} type="watch" />
    </ImportAccountsSelectionForm>
  )
}
