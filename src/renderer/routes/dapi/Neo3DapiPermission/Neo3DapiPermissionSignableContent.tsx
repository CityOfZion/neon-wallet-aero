import { type ReactNode, useMemo } from 'react'

import { DapiError, DapiErrorCode } from '@cityofzion/neon-dapi'
import { isArray, isObject, mapValues } from 'lodash'
import { useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'
import { Details } from '@renderer/components/Details'
import { IconButton } from '@renderer/components/IconButton'
import { Tooltip } from '@renderer/components/Tooltip'

import { ClipboardHelper } from '@renderer/helpers/ClipboardHelper'
import { StringHelper } from '@renderer/helpers/StringHelper'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'

import { useSelectedNetworkSelector } from '@renderer/hooks/useSettingsSelector'

import MdContentCopy from '@renderer/assets/images/md-content-copy.svg?react'
import TbArrowsSort from '@renderer/assets/images/tb-arrows-sort.svg?react'
import TbCodeCircle from '@renderer/assets/images/tb-code-circle.svg?react'
import Tb3dCubeSphere from '@renderer/assets/images/tb-cube-3d-sphere.svg?react'
import TbUsers from '@renderer/assets/images/tb-users.svg?react'

import type { TDapiRequest } from '@shared/types/dapi'

import { Neo3DapiPermissionDappDetails } from './Neo3DapiPermissionDappDetails'

type TProps = {
  request: TDapiRequest
  onAccept: () => void
  onReject: (error: DapiError) => void
  isAccepting: boolean
  isRejecting: boolean
  children?: ReactNode
}

export const Neo3DapiPermissionSignableContent = ({
  isAccepting,
  isRejecting,
  onAccept,
  onReject,
  request,
  children,
}: TProps) => {
  const { t } = useTranslation('pages', { keyPrefix: 'dapiPermission.genericContent' })
  const { t: tCommon } = useTranslation('common')
  const { network } = useSelectedNetworkSelector('neo3')

  const parsedParams = useMemo(() => {
    const params = request?.args
    return mapValues(
      isArray(params) && params.length === 1 && isObject(params[0]) ? params[0] : params,
      UtilsHelper.parseJsonSafely
    )
  }, [request?.args])

  return (
    <div className="flex grow flex-col">
      <p className="mb-6 text-center text-sm font-bold text-white">{t('description')}</p>

      <p className="mb-2 text-left text-xs font-bold text-gray-100 uppercase">{t('infosLabel')}</p>

      <Neo3DapiPermissionDappDetails request={request} />

      <Details.Root className="mt-2">
        <Details.Header
          leftElement={<Tb3dCubeSphere aria-hidden />}
          rightElement={<span className="text-sm font-bold text-white capitalize">{network.type}</span>}
        >
          <span className="text-sm text-white">{t('currentNetworkLabel')}</span>
        </Details.Header>
      </Details.Root>

      <Details.Root className="mt-2">
        <Details.Header
          leftElement={<TbUsers aria-hidden />}
          rightElement={
            <span className="text-sm font-bold text-white">
              {StringHelper.truncateMiddle(request.account?.address || '', 10)}
            </span>
          }
        >
          <span className="text-sm text-white capitalize">{request.account?.name}</span>
        </Details.Header>
      </Details.Root>

      <p className="mt-4 mb-2 text-left text-xs font-bold text-gray-100 uppercase">{t('requestLabel')}</p>

      <Details.Root>
        <Details.Header
          leftElement={<TbArrowsSort aria-hidden className="rotate-90" />}
          rightElement={<span className="text-sm font-bold text-white capitalize">{request.method}</span>}
        >
          <span className="text-sm text-white">{t('methodLabel')}</span>
        </Details.Header>
      </Details.Root>

      <div>
        {Object.entries(parsedParams).map(([key, value]) => {
          const content = typeof value === 'string' ? value : JSON.stringify(value, null, 2)

          return (
            <Details.Root className="mt-2" key={key}>
              <Details.Header
                rightElement={
                  <Tooltip title={tCommon('general.copy')}>
                    <IconButton
                      aria-label={tCommon('general.copy')}
                      icon={<MdContentCopy aria-hidden />}
                      size="sm"
                      colorSchema="neon"
                      onClick={ClipboardHelper.write.bind(null, content)}
                    />
                  </Tooltip>
                }
                leftElement={<TbCodeCircle aria-hidden className="text-gray-300" />}
              >
                <span className="text-sm text-gray-100 capitalize">{key}</span>
              </Details.Header>

              <Details.HeaderSeparator />

              <Details.Body className="mt-2.5">
                <p className="rounded bg-gray-700/60 px-5 py-2.5 text-sm break-words whitespace-pre-wrap">
                  {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
                </p>
              </Details.Body>
            </Details.Root>
          )
        })}
      </div>

      {children}

      <div className="z-50 mt-5 flex w-full gap-2.5">
        <Button
          label={t('rejectButtonLabel')}
          loading={isRejecting}
          disabled={isAccepting}
          className="w-25"
          colorSchema="gray"
          onClick={() => onReject(new DapiError(DapiErrorCode.CANCELED, 'User rejected the request'))}
        />

        <Button
          label={t('acceptButtonLabel')}
          className="grow"
          onClick={() => onAccept()}
          loading={isAccepting}
          disabled={isRejecting}
        />
      </div>
    </div>
  )
}
