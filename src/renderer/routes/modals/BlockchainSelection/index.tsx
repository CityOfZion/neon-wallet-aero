import { useTranslation } from 'react-i18next'

import { BlockchainIcon } from '@renderer/components/BlockchainIcon'
import { Button } from '@renderer/components/Button'
import { Radio } from '@renderer/components/Radio'

import { useActions } from '@renderer/hooks/useActions'
import { useModalState } from '@renderer/hooks/useModalRouter'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import { blockchainNames } from '@renderer/libs/blockchain-service'
import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import type { TModalState } from '@shared/types/modal'

type TActionsData = {
  selectedBlockchain: TBlockchainServiceKey
}

export const BlockchainSelectionModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'blockchainSelectionModal' })
  const { t: tCommonBlockchain } = useTranslation('common', { keyPrefix: 'blockchain' })
  const { heading, description, onSubmit } = useModalState<TModalState<'blockchain-selection'>>()

  const {
    actionData: { selectedBlockchain },
    actionState,
    setData,
    handleAct,
  } = useActions<TActionsData>({ selectedBlockchain: 'neo3' })

  const isDisabled = !selectedBlockchain || actionState.isActing

  const handleSelectBlockchain = (blockchain: TBlockchainServiceKey) => {
    setData({ selectedBlockchain: blockchain })
  }

  const handleSubmit = async () => {
    if (isDisabled) return

    onSubmit(selectedBlockchain)
  }

  return (
    <BottomModalLayout heading={heading} className="overflow-y-auto">
      <form className="mt-2 flex flex-grow flex-col" onSubmit={handleAct(handleSubmit)}>
        <h2 className="mb-5 text-center">{description}</h2>

        <Radio.Group
          className="flex flex-col gap-y-2"
          required
          value={selectedBlockchain}
          onValueChange={handleSelectBlockchain}
        >
          {blockchainNames.map((blockchain, index) => (
            <Radio.Item
              key={`${blockchain}-${index}`}
              className="bg-asphalt h-12 rounded px-1"
              withSeparator={false}
              value={blockchain}
            >
              <BlockchainIcon blockchain={blockchain} className="text-gray-100" />

              <span className="flex-grow text-left">{tCommonBlockchain(blockchain)}</span>

              <Radio.Indicator />
            </Radio.Item>
          ))}
        </Radio.Group>

        <div className="mt-8 flex flex-grow flex-col justify-end">
          <Button label={t('nextButtonLabel')} type="submit" disabled={isDisabled} loading={actionState.isActing} />
        </div>
      </form>
    </BottomModalLayout>
  )
}

export default BlockchainSelectionModal
