import { useTranslation } from 'react-i18next'

import { BlockchainList } from '@renderer/components/BlockchainList'
import { Button } from '@renderer/components/Button'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'

import { useActions } from '@renderer/hooks/useActions'
import { useModalState } from '@renderer/hooks/useModalRouter'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import type { TModalState } from '@shared/types/modal'

type TActionsData = {
  selectedBlockchains: TBlockchainServiceKey[]
}

export const BlockchainSelectionModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'blockchainSelection' })
  const {
    heading,
    description,
    onSelect,
    isMulti = false,
    submitButtonProps,
  } = useModalState<TModalState<'blockchain-selection'>>()

  const { actionData, actionState, setData, handleAct } = useActions<TActionsData>({
    selectedBlockchains: ['neo3'],
  })

  const areAllBlockchainsSelected = BlockchainServiceHelper.blockchainNames.every(blockchain =>
    actionData.selectedBlockchains.includes(blockchain)
  )

  const handleSelect = (blockchains: TBlockchainServiceKey[]) => {
    setData({ selectedBlockchains: blockchains })
  }

  const handleToggleAllBlockchains = () => {
    setData({ selectedBlockchains: areAllBlockchainsSelected ? [] : [...BlockchainServiceHelper.blockchainNames] })
  }

  const handleSubmit = async () => {
    await onSelect(actionData.selectedBlockchains)
  }

  return (
    <BottomModalLayout heading={heading} className="overflow-y-auto">
      <form className="mt-2 flex grow flex-col" onSubmit={handleAct(handleSubmit)}>
        <h2 className="mb-5 text-center text-sm">{description}</h2>

        {isMulti && (
          <div className="mb-4 flex self-end pr-4">
            <Button
              type="button"
              label={areAllBlockchainsSelected ? t('deselectAllButtonLabel') : t('selectAllButtonLabel')}
              variant="text-slim"
              flat
              onClick={handleToggleAllBlockchains}
            />
          </div>
        )}

        <BlockchainList
          selectedBlockchains={actionData.selectedBlockchains}
          onSelect={handleSelect}
          isMulti={isMulti}
        />

        <div className="mt-8 flex flex-col justify-end">
          <Button
            label={t('nextButtonLabel')}
            type="submit"
            disabled={actionData.selectedBlockchains.length === 0}
            loading={actionState.isActing}
            {...submitButtonProps}
          />
        </div>
      </form>
    </BottomModalLayout>
  )
}

export default BlockchainSelectionModal
