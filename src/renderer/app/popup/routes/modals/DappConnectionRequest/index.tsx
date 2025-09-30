import { Fragment, useState, useTransition } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useWalletConnectWallet } from '@cityofzion/wallet-connect-sdk-wallet-react'
import { Button } from '@renderer/components/Button'
import { DappConnectionHeader } from '@renderer/components/DappConnectionHeader'
import { Details } from '@renderer/components/Details'
import { Loader } from '@renderer/components/Loader'
import { ToastHelper } from '@renderer/helpers/ToastHelper'
import { WalletConnectHelper } from '@renderer/helpers/WalletConnectHelper'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { useMountUnsafe } from '@renderer/hooks/useMountUnsafe'
import { useSelectedNetworkSelector } from '@renderer/hooks/useSettingsSelector'
import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'
import { TWalletConnectHelperProposalInformation } from '@shared/types/helpers'
import { TModalState } from '@shared/types/modal'

import TbPlug from '@renderer/assets/images/tb-plug.svg?react'

export const DappConnectionRequestModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'dappConnectionRequestModal' })
  const { rejectProposal, approveProposal } = useWalletConnectWallet()
  const { modalNavigate, modalErase } = useModalNavigate()
  const { proposal, account } = useModalState<TModalState<'dapp-connection-request'>>()
  const { networkRef } = useSelectedNetworkSelector(account.blockchain)

  const [proposalInformation, setProposalInformation] = useState<TWalletConnectHelperProposalInformation>()
  const [isConnecting, startConnecting] = useTransition()

  const handleReject = async () => {
    rejectProposal(proposal)
    modalErase('bottom')
  }

  const handleAccept = () => {
    if (isConnecting) return

    startConnecting(async () => {
      try {
        await approveProposal(proposal!, {
          address: account.address,
          chain: proposalInformation!.network.id,
          blockchain: proposalInformation!.proposalBlockchain,
        })

        ToastHelper.success({ message: t('messages.connected', { dappName: proposal.params.proposer.metadata.name }) })
      } catch (error: any) {
        ToastHelper.error({ message: error.message })
      } finally {
        modalErase('bottom')
      }
    })
  }

  const { isMounting } = useMountUnsafe(() => {
    try {
      const proposalInformation = WalletConnectHelper.getInformationFromProposal(proposal, account)

      if (proposalInformation.length === 0) throw new Error(t('errors.accountProposalError'))

      const selectedNetworkProposalInformation = proposalInformation.find(
        information => information.network.id === networkRef.current.id
      )

      if (!selectedNetworkProposalInformation) throw new Error(t('errors.differentNetworkError'))

      setProposalInformation(selectedNetworkProposalInformation)
    } catch (error: any) {
      rejectProposal(proposal)
      ToastHelper.error({ message: error.message, id: 'dapp-connection-details-proposal-error' })
      modalNavigate(-1)
    }
  }, 1000)

  return (
    <BottomModalLayout heading={t('title')} contentClassName="items-center" onClose={() => rejectProposal(proposal)}>
      {isMounting || !proposalInformation ? (
        <div className="flex grow items-center justify-center">
          <Loader className="size-10" />
        </div>
      ) : (
        <Fragment>
          <DappConnectionHeader
            className="mt-6"
            proposerUri={proposal.params.proposer.metadata.icons[0]}
            proposerName={proposal.params.proposer.metadata.name}
            description={
              <Trans t={t} i18nKey="description" values={{ name: proposal.params.proposer.metadata.name }} />
            }
          />

          <Details.Root className="mt-3">
            <Details.Header label={t('connectionDetailsTitle')} icon={<TbPlug aria-hidden className="text-blue" />}>
              <span className="grow text-right text-sm text-gray-300">{proposalInformation.chain}</span>
            </Details.Header>

            <Details.Body>
              <Details.Panel label={'Methods'}>
                <Details.Item>
                  <span className="text-sm">{proposalInformation.methods.join(', ')}</span>
                </Details.Item>
              </Details.Panel>
            </Details.Body>
          </Details.Root>

          <div className="mt-auto flex w-full items-end gap-x-2.5">
            <Button
              label={t('rejectButtonLabel')}
              colorSchema="gray"
              className="min-w-[7.5rem]"
              onClick={handleReject}
              disabled={isConnecting}
            />

            <Button
              label={t('acceptButtonLabel')}
              className="flex-grow"
              onClick={handleAccept}
              loading={isConnecting}
            />
          </div>
        </Fragment>
      )}
    </BottomModalLayout>
  )
}
