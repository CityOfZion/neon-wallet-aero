import { useMemo, useState } from 'react'

import { DapiError, DapiErrorCode, type DapiProvider } from '@cityofzion/neon-dapi'
import { Fragment } from 'react/jsx-runtime'
import { useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'
import { Radio } from '@renderer/components/Radio'

import { useAccountsByBlockchainsSelector } from '@renderer/hooks/useAccountSelector'
import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'
import { usePressOnce } from '@renderer/hooks/usePressOnce'

import type { TDapiPermissionContentProps } from '@shared/types/dapi'

import { Neo3DapiPermissionDappDetails } from './Neo3DapiPermissionDappDetails'

export const Neo3DapiPermissionPickAddressContent = ({ request, sendResult }: TDapiPermissionContentProps) => {
  const { t } = useTranslation('pages', { keyPrefix: 'dapiPermission.pickAddressContent' })

  const { accountsByBlockchains } = useAccountsByBlockchainsSelector(['neo3'])
  const { loginSession } = useLoginSessionSelector()

  const [selectedAddress, setSelectedAdress] = useState<string>()

  const filteredAccounts = useMemo(() => {
    const [prompt] = request.args as Parameters<DapiProvider['pickAddress']>
    const trimmedPrompt = prompt?.toLowerCase()?.trim()

    if (!trimmedPrompt) {
      return accountsByBlockchains
    }

    return accountsByBlockchains.filter(
      account =>
        account.address.toLowerCase().includes(trimmedPrompt) || account.name.toLowerCase().includes(trimmedPrompt)
    )
  }, [accountsByBlockchains, request.args])

  const [isAccepting, startAccept] = usePressOnce(async () => {
    try {
      if (!selectedAddress || !loginSession) return
      sendResult(selectedAddress)
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

      <p className="mt-6 mb-2 text-left text-xs font-bold text-gray-100 uppercase">{t('chooseAddressLabel')}</p>

      <Radio.Group value={selectedAddress} onValueChange={setSelectedAdress} className="overflow-hidden rounded">
        {filteredAccounts.map((account, index, array) => (
          <Radio.Item
            className="bg-asphalt h-14 hover:bg-gray-800"
            key={account.id}
            value={account.address}
            withSeparator={index !== array.length - 1}
          >
            <Radio.Indicator />

            <div className="flex size-full flex-col justify-center">
              <label className="text-left text-sm">{account.name}</label>
              <p className="text-left text-xs text-gray-300">{account.address}</p>
            </div>
          </Radio.Item>
        ))}
      </Radio.Group>

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
          disabled={isRejecting || !selectedAddress}
        />
      </div>
    </Fragment>
  )
}
