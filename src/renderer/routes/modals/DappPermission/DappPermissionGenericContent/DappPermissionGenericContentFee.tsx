import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { Details } from '@renderer/components/Details'
import { Loader } from '@renderer/components/Loader'

import { AccountHelper } from '@renderer/helpers/AccountHelper'
import { EncryptionHelper } from '@renderer/helpers/EncryptionHelper'
import { AppError } from '@renderer/helpers/ErrorHelper'
import { LoggerHelper } from '@renderer/helpers/LoggerHelper'

import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'

import TbReceipt from '@renderer/assets/images/tb-receipt.svg?react'

import type { TDappPermissionProps } from '../index'

export const DappPermissionGenericContentFee = ({
  request,
  sessionDetails,
  sessionAccount,
  onReject,
}: TDappPermissionProps) => {
  const { loginSession } = useLoginSessionSelector()
  const { t } = useTranslation('modals', { keyPrefix: 'dappPermission' })
  const { t: tCommon } = useTranslation('common')

  const feeQuery = useQuery({
    queryKey: ['fee', request.id],
    queryFn: async () => {
      if (!loginSession) throw new AppError(tCommon('errors.noLoginSession'))

      const key = await EncryptionHelper.decrypt(sessionAccount.encryptedKey, loginSession.encryptedPassword)
      const serviceAccount = await AccountHelper.getServiceAccount({ account: sessionAccount, key })

      return await sessionDetails.service.walletConnectService.calculateRequestFee({
        account: serviceAccount,
        params: request.params.request.params,
      })
    },
    gcTime: 0,
    staleTime: 0,
  })

  useEffect(() => {
    if (!feeQuery.error) return
    onReject({ message: feeQuery.error.message, code: -32000 }, t('errors.fee'))
    LoggerHelper.error(feeQuery.error, { where: 'DappPermissionGenericContentFee', operation: 'calculateRequestFee' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feeQuery.error])

  return (
    <Details.Root className="mt-3">
      <Details.Header
        leftElement={<TbReceipt aria-hidden className="text-blue" />}
        rightElement={
          <div>
            {feeQuery.isLoading || !feeQuery.data ? (
              <Loader />
            ) : (
              <p className="text-sm font-semibold text-gray-100 capitalize">
                {feeQuery.data} {sessionDetails.service.feeToken.symbol}
              </p>
            )}
          </div>
        }
      >
        <p className="text-sm text-white capitalize">{t('feeLabel')}</p>
      </Details.Header>
    </Details.Root>
  )
}
