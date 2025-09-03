import { useTranslation } from 'react-i18next'
import { Account } from '@cityofzion/blockchain-service'

import { Banner } from '@/components/Banner'
import { ToastHelper } from '@/helpers/ToastHelper'
import { useAccountUtils } from '@/hooks/useAccountUtils'
import { useActions } from '@/hooks/useActions'
import { useModalNavigate } from '@/hooks/useModalRouter'
import { useMountUnsafe } from '@/hooks/useMountUnsafe'
import { bsAggregator } from '@/libs/blockchainService'
import { TBlockchainServiceKey } from '@/types/blockchain'

import { ImportAccountsSelectionForm } from './ImportAccountsSelectionForm'
import { TBlockchainAccounts } from '.'

type TActionsData = {
  blockchainAccounts: TBlockchainAccounts
  selectedAccounts: Account<TBlockchainServiceKey>[]
}

type TProps = {
  value: string
  onSubmit: (selectedAccounts: Account<TBlockchainServiceKey>[]) => Promise<void>
}

export const ImportAccountsSelectionAddress = ({ value, onSubmit }: TProps) => {
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
    const services = Object.values(bsAggregator.blockchainServicesByName)

    const servicesFromAddress = services.filter(
      service => service.validateAddress(value) && !doesAccountExist({ address: value, blockchain: service.name })
    )

    if (servicesFromAddress.length === 0) return

    const newBlockchainAccounts: TBlockchainAccounts = servicesFromAddress.reduce(
      (accumulator, current) => ({
        ...accumulator,
        [current.name]: [
          {
            address: value,
            key: '',
            type: 'publicKey',
            blockchain: current.name,
          },
        ],
      }),
      {} as TBlockchainAccounts
    )

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
