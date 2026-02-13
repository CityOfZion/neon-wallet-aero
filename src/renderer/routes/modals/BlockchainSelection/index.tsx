import { useTranslation } from 'react-i18next'

import { BlockchainList } from '@renderer/components/BlockchainList'
import { Button } from '@renderer/components/Button'

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
  const { heading, description, onSelect, isMulti = false } = useModalState<TModalState<'blockchain-selection'>>()

  const { actionData, actionState, setData, handleAct } = useActions<TActionsData>({
    selectedBlockchains: ['neo3'],
  })

  const handleSelect = (blockchains: TBlockchainServiceKey[]) => {
    setData({ selectedBlockchains: blockchains })
  }

  const handleSubmit = () => {
    onSelect(actionData.selectedBlockchains)
  }

  return (
    <BottomModalLayout heading={heading} className="overflow-y-auto">
      <form className="mt-2 flex flex-grow flex-col" onSubmit={handleAct(handleSubmit)}>
        <h2 className="mb-5 text-center text-sm">{description}</h2>

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
          />
        </div>
      </form>
    </BottomModalLayout>
  )
}

export default BlockchainSelectionModal
