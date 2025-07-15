import { useTranslation } from 'react-i18next'
import { Account } from '@cityofzion/blockchain-service'

import { ToastHelper } from '@/helpers/ToastHelper'
import { useAccountUtils } from '@/hooks/useAccountUtils'
import { useActions } from '@/hooks/useActions'
import { useModalNavigate } from '@/hooks/useModalRouter'
import { useMountUnsafe } from '@/hooks/useMountUnsafe'
import { useLastIndexesByWallet } from '@/hooks/useUtilitySelector'
import { bsAggregator } from '@/libs/blockchainService'
import { TBlockchainAccounts } from '@/routes/modals/ImportAccountsSelection/index'
import { TBlockchainServiceKey } from '@/types/blockchain'

import { ImportAccountsSelectionForm } from './ImportAccountsSelectionForm'

type TActionsData = {
  blockchainAccounts: TBlockchainAccounts
  selectedAccounts: Account<TBlockchainServiceKey>[]
}

type TProps = {
  value: string
  onSubmit: (selectedAccounts: Account<TBlockchainServiceKey>[]) => Promise<void>
}

export const ImportAccountsSelectionMnemonic = ({ value, onSubmit }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'importAccountsSelectionModal' })
  const { modalErase } = useModalNavigate()
  const { doesAccountExist } = useAccountUtils()
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
      await onSubmit(selectedAccounts)
      ToastHelper.success({ message: t('successes.accountsImported') })
      modalErase('bottom')
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
