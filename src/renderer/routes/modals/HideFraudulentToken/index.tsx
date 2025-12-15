import { useMemo } from 'react'

import { useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'
import { Skeleton } from '@renderer/components/Skeleton'

import { ToastHelper } from '@renderer/helpers/ToastHelper'
import { TokenHelper } from '@renderer/helpers/TokenHelper'

import { useBalance } from '@renderer/hooks/useBalances'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { usePressOnce } from '@renderer/hooks/usePressOnce'
import { useAppDispatch } from '@renderer/hooks/useRedux'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import TbEyeOff from '@renderer/assets/images/tb-eye-off.svg?react'

import { bsAggregator } from '@renderer/libs/blockchain-service'
import { utilityReducerActions } from '@renderer/store/reducers/utility'
import type { TModalState } from '@shared/types/modal'

export const HideFraudulentTokenModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'hideFraudulentToken' })
  const { t: tCommonBlockchain } = useTranslation('common', { keyPrefix: 'blockchain' })
  const { tokenHash, account } = useModalState<TModalState<'hide-fraudulent-token'>>()
  const { modalErase } = useModalNavigate()
  const balanceQuery = useBalance(account)
  const dispatch = useAppDispatch()

  const blockchain = balanceQuery.data?.blockchain || account.blockchain

  const tokenBalance = useMemo(() => {
    if (balanceQuery.isLoading || !blockchain) return undefined

    const service = bsAggregator.blockchainServicesByName[blockchain]

    return balanceQuery.data?.tokensBalances?.find(({ token }) =>
      service.tokenService.predicateByHash(tokenHash, token)
    )
  }, [blockchain, balanceQuery.data?.tokensBalances, balanceQuery.isLoading, tokenHash])

  const isDisabled = TokenHelper.isNativeToken(tokenHash, blockchain) || !tokenBalance

  const [isHiding, startHide] = usePressOnce(() => {
    if (isDisabled) return

    try {
      dispatch(utilityReducerActions.toggleHiddenToken({ tokenHash, blockchain: account.blockchain }))

      modalErase('bottom')

      ToastHelper.success({ message: t('messages.hideSuccess') })
    } catch {
      ToastHelper.error({ message: t('messages.hideError') })
    }
  })

  return (
    <BottomModalLayout heading={t('title')}>
      <div className="mt-2 flex h-full flex-col">
        <p className="text-sm text-gray-200">{t('description')}</p>

        <p className="mt-6 mb-2 w-full text-left text-xs font-bold text-gray-100 uppercase">{t('details')}</p>

        <Skeleton.Root
          className="flex w-full flex-col"
          loading={balanceQuery.isLoading}
          items={<Skeleton.Item className="h-46 w-full rounded-sm" />}
        >
          {tokenBalance ? (
            <ul className="flex w-full flex-col gap-y-2 rounded-sm border border-gray-600 bg-gray-900 p-3 text-sm">
              <li className="border-b border-gray-600 pb-2 break-all text-gray-200">
                <strong className="font-bold text-white">{t('tokenHashLabel')}</strong> {tokenHash}
              </li>
              <li className="border-b border-gray-600 pb-2 text-gray-200">
                <strong className="font-bold text-white">{t('tokenNameLabel')}</strong> {tokenBalance?.token.name} (
                {tokenBalance?.token.symbol})
              </li>
              <li className="border-b border-gray-600 pb-2 text-gray-200">
                <strong className="font-bold text-white">{t('blockchainLabel')}</strong>{' '}
                {tCommonBlockchain(account.blockchain)}
              </li>
              <li className="text-gray-200">
                <strong className="font-bold text-white">{t('amountLabel')}</strong> {tokenBalance?.amount}
              </li>
            </ul>
          ) : (
            <p className="flex w-full items-center justify-center rounded-sm border border-gray-600 bg-gray-900 px-18 py-8 text-center text-lg font-semibold">
              {t('notFoundTokenLabel')}
            </p>
          )}
        </Skeleton.Root>

        <div className="mt-8 flex grow flex-col justify-end">
          <Button
            label={t('hideTokenButtonLabel')}
            className="w-full"
            variant="contained"
            colorSchema="neon"
            iconsOnEdge={false}
            loading={isHiding}
            disabled={isDisabled}
            rightIcon={<TbEyeOff aria-hidden />}
            onClick={startHide}
          />
        </div>
      </div>
    </BottomModalLayout>
  )
}

export default HideFraudulentTokenModal
