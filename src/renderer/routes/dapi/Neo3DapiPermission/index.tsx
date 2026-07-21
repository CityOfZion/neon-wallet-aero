import { type JSX, useEffect, useMemo, useRef } from 'react'

import { DapiError, DapiErrorCode } from '@cityofzion/neon-dapi'
import { useTranslation } from 'react-i18next'

import { ScreenLayout } from '@renderer/layouts/ScreenLayout'

import { DapiHelper } from '@shared/helpers/DapiHelper'
import { rendererApi } from '@shared/message-api/renderer'
import type { TDapiPermissionContentProps } from '@shared/types/dapi'

import { Neo3DapiPermissionAuthenticateContent } from './Neo3DapiPermissionAuthenticateContent'
import { Neo3DapiPermissionInvokeContent } from './Neo3DapiPermissionInvokeContent'
import { Neo3DapiPermissionPickAddressContent } from './Neo3DapiPermissionPickAddressContent'
import { Neo3DapiPermissionSendContent } from './Neo3DapiPermissionSendContent'
import { Neo3DapiPermissionSignContent } from './Neo3DapiPermissionSignContent'
import { Neo3DapiPermissionSignMessageContent } from './Neo3DapiPermissionSignMessageContent'

const CONTENT_BY_METHOD: Record<string, (props: TDapiPermissionContentProps) => JSX.Element> = {
  authenticate: Neo3DapiPermissionAuthenticateContent,
  send: Neo3DapiPermissionSendContent,
  invoke: Neo3DapiPermissionInvokeContent,
  sign: Neo3DapiPermissionSignContent,
  signMessage: Neo3DapiPermissionSignMessageContent,
  pickAddress: Neo3DapiPermissionPickAddressContent,
}

const Neo3DapiPermission = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'dapiPermission' })

  const requestSent = useRef(false)

  const request = useMemo(() => DapiHelper.getRequestFromQuery(), [])

  const Content = request ? CONTENT_BY_METHOD[request.method] : null

  async function sendResult(response?: any, error?: any) {
    if (!request || requestSent.current) return
    requestSent.current = true
    await rendererApi.send('dapi:neo3:approval-result', { request, response, error })
    window.close()
  }

  useEffect(() => {
    if (!request) {
      window.close()
      return
    }

    if (!Content) {
      sendResult(undefined, new DapiError(DapiErrorCode.UNSUPPORTED, 'Unsupported method'))
      return
    }

    function handleUnload() {
      sendResult(undefined, new DapiError(DapiErrorCode.CANCELED, 'User closed the approval window'))
    }

    window.addEventListener('unload', handleUnload)

    return () => {
      window.removeEventListener('unload', handleUnload)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!request || !Content) {
    return null
  }

  return (
    <ScreenLayout heading={t('title')} withBack={false} className="min-size-96" contentClassName="min-h-auto">
      <Content request={request} sendResult={sendResult} />
    </ScreenLayout>
  )
}

export default Neo3DapiPermission
