import type { TBSAccount } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { AppError } from '@renderer/helpers/ErrorHelper'
import { LoggerHelper } from '@renderer/helpers/LoggerHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { useAccountUtils } from '@renderer/hooks/useAccountUtils'
import { useActions } from '@renderer/hooks/useActions'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { useMountUnsafe } from '@renderer/hooks/useMount'
import { useLastIndexesByWallet } from '@renderer/hooks/useUtilitySelector'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'

import type { TBlockchainAccounts } from '.'
import { ImportAccountsSelectionForm } from './ImportAccountsSelectionForm'

type TActionsData = {
  blockchainAccounts: TBlockchainAccounts
  selectedAccounts: TBSAccount<TBlockchainServiceKey>[]
}

type TProps = {
  value: string
  onSubmit: (selectedAccounts: TBSAccount<TBlockchainServiceKey>[]) => Promise<void>
}

export const ImportAccountsSelectionMnemonic = ({ value, onSubmit }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'importAccountsSelection' })
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
      LoggerHelper.error(error, { where: 'ImportAccountsSelectionMnemonic', operation: 'handleSubmit' })
      ToastHelper.error({ message: AppError.wrap(error, t('errors.walletAndAccounts')).message })
    }
  }

  const { isMounting } = useMountUnsafe(async () => {
    const mappedBlockchainAccounts = await BlockchainServiceHelper.bsAggregator.generateAccountsFromMnemonic(
      value,
      lastIndexesByWallet
    )

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
