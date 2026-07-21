import { useState } from 'react'

import { DapiError, DapiErrorCode, DapiOperations, type DapiProvider } from '@cityofzion/neon-dapi'
import { Fragment } from 'react/jsx-runtime'
import { useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'
import { Details } from '@renderer/components/Details'
import { GreyAccountSelect } from '@renderer/components/GreyAccountSelect'

import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'
import { usePressOnce } from '@renderer/hooks/usePressOnce'
import { useSelectedNetworkSelector } from '@renderer/hooks/useSettingsSelector'

import Tb3dCubeSphere from '@renderer/assets/images/tb-cube-3d-sphere.svg?react'

import { DapiHelper } from '@shared/helpers/DapiHelper'
import { Neo3DapiHelper } from '@shared/helpers/Neo3DapiHelper'
import type { TDapiPermissionContentProps } from '@shared/types/dapi'
import type { TAccount } from '@shared/types/store'

import { Neo3DapiPermissionDappDetails } from './Neo3DapiPermissionDappDetails'

export const Neo3DapiPermissionAuthenticateContent = ({ request, sendResult }: TDapiPermissionContentProps) => {
  const { t } = useTranslation('pages', { keyPrefix: 'dapiPermission.authenticateContent' })

  const { network } = useSelectedNetworkSelector('neo3')
  const { loginSession } = useLoginSessionSelector()

  const [selectedAccount, setSelectedAccount] = useState<TAccount<'neo3'>>()

  const [payload] = request.args as Parameters<DapiProvider['authenticate']>

  const [isAccepting, startAccept] = usePressOnce(async () => {
    try {
      if (!selectedAccount || !loginSession) return

      const neonJsAccount = await Neo3DapiHelper.getNeonJsAccount(selectedAccount)
      const neonJsRpcClient = await Neo3DapiHelper.getNeonJsRpcClient(network.url)
      const dapiNetwork = Neo3DapiHelper.getDapiNetwork(network.type)

      const operations = new DapiOperations({
        rpcClient: neonJsRpcClient,
        account: neonJsAccount,
        network: dapiNetwork,
      })

      const response = await operations.authenticate(payload)

      await DapiHelper.storeConnectedDapp(request, payload.networks.map(String), selectedAccount.address)

      sendResult(response)
    } catch (error) {
      sendResult(undefined, error)
    }
  })

  const [isRejecting, startReject] = usePressOnce(() => {
    sendResult(undefined, new DapiError(DapiErrorCode.CANCELED, 'User rejected'))
  })

  return (
    <Fragment>
      <p className="mb-6 text-center text-sm font-bold text-white">{t('description')}</p>

      <p className="mb-2 text-left text-xs font-bold text-gray-100 uppercase">{t('infosLabel')}</p>

      <Neo3DapiPermissionDappDetails request={request} />

      <Details.Root className="mt-2">
        <Details.Header
          leftElement={<Tb3dCubeSphere aria-hidden />}
          rightElement={<span className="text-sm font-bold text-white capitalize">{payload.networks.join(', ')}</span>}
        >
          <span className="text-sm text-white">{t('networksLabel')}</span>
        </Details.Header>
      </Details.Root>

      <GreyAccountSelect
        triggerClassName="bg-gray-700 w-full max-w-none mt-5 aria-[disabled=false]:hover:bg-gray-800 aria-expanded:bg-gray-800"
        contentClassName="bg-gray-800 w-full max-w-none"
        onSelect={setSelectedAccount}
        selectedAccount={selectedAccount}
        selectedAccountTruncateLength={16}
        blockchains={['neo3']}
      />

      <div className="z-50 mt-auto flex w-full gap-2.5 pt-5">
        <Button
          label={t('rejectButtonLabel')}
          loading={isRejecting}
          disabled={isAccepting}
          className="w-25"
          colorSchema="gray"
          onClick={startReject}
        />

        <Button
          label={t('acceptButtonLabel')}
          className="grow"
          onClick={startAccept}
          loading={isAccepting}
          disabled={isRejecting || !selectedAccount}
        />
      </div>
    </Fragment>
  )
}
