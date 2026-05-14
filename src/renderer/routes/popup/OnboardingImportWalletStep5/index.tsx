import { Fragment } from 'react'

import { useTranslation } from 'react-i18next'
import type { Location } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

import { Button } from '@renderer/components/Button'
import { Checkbox } from '@renderer/components/Checkbox'
import { DownloadQRCodePasswordButton } from '@renderer/components/DownloadQRCodePasswordButton'

import { useLoginSessionSelector, useShouldConfirmActionSelector } from '@renderer/hooks/useAuthSelector'
import { useNavigateReset } from '@renderer/hooks/useNavigateReset'
import { useAppDispatch } from '@renderer/hooks/useRedux'

import MdOutlineAutoAwesome from '@renderer/assets/images/md-outline-auto-awesome.svg?react'
import TbRosetteDiscountCheck from '@renderer/assets/images/tb-rosette-discount-check.svg?react'

import { authReducerActions } from '@renderer/store/reducers/auth'

type TLocationState = {
  password: string
}

export const OnboardingImportWalletStep5Page = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'onboardingImportWallet.step5' })
  const { state } = useLocation() as Location<TLocationState>
  const navigateReset = useNavigateReset()
  const { shouldConfirmAction } = useShouldConfirmActionSelector()
  const { loginSession } = useLoginSessionSelector()
  const dispatch = useAppDispatch()

  const handleIsShouldConfirmActionChange = (value: boolean) => {
    dispatch(authReducerActions.setShouldConfirmAction(value))
  }

  return (
    <Fragment>
      <div className="flex flex-grow flex-col items-center justify-start gap-2.5">
        <p className="text-sm text-white">{t('title')}</p>

        <TbRosetteDiscountCheck aria-hidden className="text-blue mt-3 size-25 stroke-1" />
      </div>

      <div className="flex w-full flex-col items-center gap-4">
        <DownloadQRCodePasswordButton password={state.password} className="w-fit" />

        <Button
          onClick={() => navigateReset('/wallets')}
          label={t('openWalletButtonLabel')}
          rightIcon={<MdOutlineAutoAwesome aria-hidden />}
          variant="card"
          className="w-full"
          iconsOnEdge={false}
        />
      </div>

      <div className="flex items-center justify-center gap-2 pt-4 pb-2 text-white">
        <Checkbox
          id="should-confirm-action"
          checked={shouldConfirmAction}
          onCheckedChange={handleIsShouldConfirmActionChange}
        />
        <label htmlFor="should-confirm-action">
          {loginSession?.type === 'password'
            ? t('shouldConfirmActionPasswordCheckboxLabel')
            : t('shouldConfirmActionKeyCheckboxLabel')}
        </label>
      </div>
    </Fragment>
  )
}

export default OnboardingImportWalletStep5Page
