import { useTranslation } from 'react-i18next'
import { TBSAccount } from '@cityofzion/blockchain-service'
import { ToastHelper } from '@renderer/helpers/ToastHelper'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'
import { useAccountUtils } from '@renderer/hooks/useAccountUtils'
import { useActions } from '@renderer/hooks/useActions'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { useMountUnsafe } from '@renderer/hooks/useMountUnsafe'
import { bsAggregator } from '@renderer/libs/blockchainService'
import { TBlockchainServiceKey } from '@shared/types/blockchain'

import { ImportAccountsSelectionForm } from './ImportAccountsSelectionForm'
import { TBlockchainAccounts } from '.'

type TActionsData = {
  blockchainAccounts: TBlockchainAccounts
  selectedAccounts: TBSAccount<TBlockchainServiceKey>[]
}

type TProps = {
  value: string
  onSubmit: (selectedAccounts: TBSAccount<TBlockchainServiceKey>[]) => Promise<void>
}

export const ImportAccountsSelectionKey = ({ value, onSubmit }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'importAccountsSelectionModal' })

  const { modalErase } = useModalNavigate()

  const { doesAccountExist } = useAccountUtils()

  const {
    actionData: { blockchainAccounts, selectedAccounts },
    actionState,
    setData,
    handleAct,
  } = useActions<TActionsData>({ blockchainAccounts: {}, selectedAccounts: [] })

  const isDisabled = actionState.isActing || !actionState.isValid || selectedAccounts.length === 0

  const handleSelectAccounts = (newSelectedAccounts: TBSAccount<TBlockchainServiceKey>[]) => {
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
    const services = Object.values(bsAggregator.blockchainServicesByName)
    const newBlockchainAccounts: TBlockchainAccounts = {}

    await UtilsHelper.promiseAll(services, async service => {
      const account = service.generateAccountFromKey(value)

      if (doesAccountExist(account)) return

      newBlockchainAccounts[service.name] = [account]
    })

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
