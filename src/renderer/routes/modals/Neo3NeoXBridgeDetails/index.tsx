import { useState } from 'react'

import { BSError } from '@cityofzion/blockchain-service'
import { Neo3NeoXBridgeOrchestrator } from '@cityofzion/bs-multichain'
import type { BSNeo3 } from '@cityofzion/bs-neo3'
import type { BSNeoX } from '@cityofzion/bs-neox'
import { useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'
import { Details } from '@renderer/components/Details'
import { Link } from '@renderer/components/Link'
import { Stepper } from '@renderer/components/Stepper'

import { AccountHelper } from '@renderer/helpers/AccountHelper'
import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { ConstantsHelper } from '@renderer/helpers/ConstantsHelper'
import { LoggerHelper } from '@renderer/helpers/LoggerHelper'

import { useContactsSelector } from '@renderer/hooks/useContactSelector'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { useMountUnsafe } from '@renderer/hooks/useMount'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import MdRefresh from '@renderer/assets/images/md-refresh.svg?react'
import TbLifeBuoy from '@renderer/assets/images/tb-lifebuoy.svg?react'
import TbReceipt from '@renderer/assets/images/tb-receipt.svg?react'
import TbRosetteDiscountCheck from '@renderer/assets/images/tb-rosette-discount-check.svg?react'
import TbUsers from '@renderer/assets/images/tb-users.svg?react'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import type { TModalState } from '@shared/types/modal'

type TBridgeStatus = 'confirming' | 'complete' | 'error'

export const Neo3NeoXBridgeDetailsModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'neo3NeoXBridgeDetails' })
  const {
    accountToUse,
    addressToReceive,
    amountToReceive,
    amountToUse,
    tokenToReceive,
    tokenToUse,
    transactionHash,
    confirmed,
  } = useModalState<TModalState<'neo3-neox-bridge-details'>>()
  const { contacts } = useContactsSelector()
  const { modalNavigate } = useModalNavigate()
  const [status, setStatus] = useState<TBridgeStatus>('confirming')
  const [errorMessage, setErrorMessage] = useState<string>()

  const isExistingContact = contacts.find(contact =>
    contact.addresses.find(
      AccountHelper.predicate({ address: addressToReceive, blockchain: tokenToReceive.blockchain })
    )
  )

  const stepsByStatus: Record<TBridgeStatus, number> = {
    confirming: 1,
    complete: 3,
    error: 2,
  }

  const handleAddContact = () => {
    modalNavigate('save-contact', {
      state: { addresses: [{ address: addressToReceive, blockchain: tokenToReceive.blockchain }] },
    })
  }

  useMountUnsafe(async () => {
    if (!transactionHash || confirmed === false) {
      setStatus('error')
      return
    }

    if (confirmed === true) {
      setStatus('complete')
      return
    }

    try {
      await Neo3NeoXBridgeOrchestrator.wait({
        tokenToUse,
        tokenToReceive,
        transactionHash,
        neo3Service: BlockchainServiceHelper.bsAggregator.blockchainServicesByName
          .neo3 as BSNeo3<TBlockchainServiceKey>,
        neoXService: BlockchainServiceHelper.bsAggregator.blockchainServicesByName
          .neox as BSNeoX<TBlockchainServiceKey>,
      })
      setStatus('complete')
    } catch (error) {
      LoggerHelper.error(error, { where: 'Neo3NeoxBridgeDetailsModal', operation: 'waitForBridgeCompletion' })
      setStatus('error')
      setErrorMessage(
        error instanceof BSError
          ? t(`errorsByCode.${error.code}`, t('errorsByCode.UNEXPECTED_ERROR'))
          : t('errorsByCode.UNEXPECTED_ERROR')
      )
    }
  })

  return (
    <BottomModalLayout heading={t('title')}>
      <div className="flex flex-grow flex-col items-center justify-between gap-6">
        <TbRosetteDiscountCheck aria-hidden className="text-blue h-21 w-21" />

        <div className="flex w-full flex-col gap-3.5">
          <Details.Root>
            <Details.Header className="mb-3" leftElement={<TbReceipt aria-hidden />}>
              <div className="flex items-center justify-between gap-x-2">
                <span className="text-sm text-white">{t('bridgeDetailsHeaderLabel')}</span>
                {status === 'confirming' && <MdRefresh aria-hidden className="text-orange h-6 w-6 animate-spin" />}
              </div>
            </Details.Header>
            <Details.Body>
              <Details.Panel label={t('bridgeStatusPanelLabel')}>
                <Stepper
                  className="mt-4 mb-10 px-14"
                  steps={t('bridgeStatusPanelSteps', { returnObjects: true })}
                  currentStep={stepsByStatus[status]}
                  currentState={status === 'error' ? 'error' : 'success'}
                  theme="neon"
                />

                {errorMessage && <p className="text-pink text-center text-xs">{errorMessage}</p>}
              </Details.Panel>
            </Details.Body>
          </Details.Root>

          <Details.Root>
            <Details.Body>
              <Details.Panel label={t('fromDetailsPanelLabel')}>
                <Details.Item label={t('fromTokenDetailsItemLabel')}>
                  <Details.Token symbol={tokenToUse.symbol} blockchain={tokenToUse.blockchain} amount={amountToUse} />
                </Details.Item>

                <Details.Item label={t('fromAddressDetailsItemLabel')}>{accountToUse.address}</Details.Item>
              </Details.Panel>

              <Details.Panel label={t('toDetailsPanelLabel')}>
                <Details.Item label={t('toTokenDetailsItemLabel')}>
                  <Details.Token
                    symbol={tokenToReceive.symbol}
                    blockchain={tokenToReceive.blockchain}
                    amount={amountToReceive}
                  />
                </Details.Item>

                <Details.Item label={t('toAddressDetailsItemLabel')}>
                  <div className="flex flex-col gap-4 break-all">
                    {addressToReceive}
                    {!isExistingContact && (
                      <Button
                        variant="text-slim"
                        leftIcon={<TbUsers aria-hidden />}
                        className="w-fit"
                        onClick={handleAddContact}
                      >
                        {t('saveContactButtonLabel')}
                      </Button>
                    )}
                  </div>
                </Details.Item>
              </Details.Panel>
            </Details.Body>
          </Details.Root>
        </div>

        <Link
          label={t('helpButtonLabel')}
          variant="card"
          className="w-full"
          target="_blank"
          to={ConstantsHelper.cozDiscordUrl}
          leftIcon={<TbLifeBuoy aria-hidden />}
          iconsOnEdge={false}
        />
      </div>
    </BottomModalLayout>
  )
}

export default Neo3NeoXBridgeDetailsModal
