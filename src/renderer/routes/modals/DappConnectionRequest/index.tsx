import { Fragment, useState } from 'react'

import type { TWalletKitHelperProposalDetails } from '@cityofzion/bs-multichain'
import { WalletKitHelper } from '@cityofzion/bs-multichain'
import { Trans, useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'
import { DappHeader } from '@renderer/components/DappHeader'
import { Details } from '@renderer/components/Details'
import { ScreenLoader } from '@renderer/components/ScreenLoader'

import { WalletConnectError } from '@renderer/helpers/ErrorHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { useMountUnsafe } from '@renderer/hooks/useMount'
import { usePressOnce } from '@renderer/hooks/usePressOnce'
import { invalidateWalletConnectSessions } from '@renderer/hooks/useWalletConnectSessions'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import TbPlug from '@renderer/assets/images/tb-plug.svg?react'

import { bsAggregator } from '@renderer/libs/blockchain-service'
import { rendererApi } from '@shared/message-api/renderer'
import type { TModalState } from '@shared/types/modal'

export const DappConnectionRequestModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'dappConnectionRequest' })
  const { modalErase } = useModalNavigate()
  const { proposal, account } = useModalState<TModalState<'dapp-connection-request'>>()

  const [proposalDetails, setProposalDetails] = useState<TWalletKitHelperProposalDetails>()

  const [isAccepting, startAccept] = usePressOnce(async () => {
    try {
      await rendererApi.send('wallet-connect:approve-proposal', {
        id: proposal.id,
        namespaces: proposalDetails!.approvedNamespaces,
      })

      await invalidateWalletConnectSessions()

      ToastHelper.success({ message: t('messages.connected', { dappName: proposal.proposer.metadata.name }) })
    } catch (error: any) {
      ToastHelper.error({ message: WalletConnectError.wrap(error).message })
    } finally {
      modalErase('bottom')
    }
  })

  const [isRejecting, startReject] = usePressOnce(async () => {
    await rendererApi.send('wallet-connect:reject-proposal', {
      id: proposal.id,
      reason: WalletKitHelper.getError('USER_REJECTED'),
    })

    modalErase('bottom')
  })

  const { isMounting } = useMountUnsafe(() => {
    try {
      setProposalDetails(
        WalletKitHelper.getProposalDetails({
          proposal,
          address: account.address,
          service: bsAggregator.blockchainServicesByName[account.blockchain],
        })
      )
    } catch (error: any) {
      rendererApi.send('wallet-connect:reject-proposal', {
        id: proposal.id,
        reason: WalletKitHelper.getError('UNSUPPORTED_NAMESPACE_KEY'),
      })

      ToastHelper.error({
        message: t(`errorsByCode.${error.code}`, error.message),
        id: 'dapp-connection-details-proposal-error',
      })

      modalErase('bottom')
    }
  }, 1000)

  return (
    <BottomModalLayout heading={t('title')} contentClassName="items-center" onClose={startReject}>
      {isMounting || !proposalDetails ? (
        <ScreenLoader />
      ) : (
        <Fragment>
          <DappHeader
            className="mt-6"
            proposerUri={proposal.proposer.metadata.icons[0]}
            proposerName={proposal.proposer.metadata.name}
          />

          <p className="mt-3 text-center text-sm text-gray-100">
            <Trans t={t} i18nKey="description" values={{ name: proposal.proposer.metadata.name }} />
          </p>

          <Details.Root className="mt-3">
            <Details.Header
              rightElement={
                <span className="text-right text-sm text-gray-300">
                  {proposalDetails.service.walletConnectService.chain}
                </span>
              }
              leftElement={<TbPlug aria-hidden className="text-blue" />}
            >
              {t('connectionDetailsTitle')}
            </Details.Header>

            <Details.HeaderSeparator />

            <Details.Body>
              <Details.Panel label={t('methodsDetailsTitle')}>
                <Details.Item>
                  <span className="text-sm">{proposalDetails.methods.join(', ')}</span>
                </Details.Item>
              </Details.Panel>
            </Details.Body>
          </Details.Root>

          <div className="mt-auto flex w-full items-end gap-x-2.5">
            <Button
              label={t('rejectButtonLabel')}
              colorSchema="gray"
              className="min-w-[7.5rem]"
              onClick={startReject}
              loading={isRejecting}
              disabled={isAccepting}
            />

            <Button
              label={t('acceptButtonLabel')}
              className="flex-grow"
              onClick={startAccept}
              loading={isAccepting}
              disabled={isRejecting}
            />
          </div>
        </Fragment>
      )}
    </BottomModalLayout>
  )
}

export default DappConnectionRequestModal
