import { useTranslation } from 'react-i18next'

import { Banner } from '@renderer/components/Banner'
import { Button } from '@renderer/components/Button'
import { Checkbox } from '@renderer/components/Checkbox'

import { AnalyticsHelper } from '@renderer/helpers/AnalyticsHelper'
import { EncryptionHelper } from '@renderer/helpers/EncryptionHelper'

import { useLoginSessionSelector, useShouldConfirmActionSelector } from '@renderer/hooks/useAuthSelector'
import { useExportMnemonic } from '@renderer/hooks/useExportMnemonic'
import { useNavigateReset } from '@renderer/hooks/useNavigateReset'
import { useAppDispatch } from '@renderer/hooks/useRedux'
import { useWalletsSelector } from '@renderer/hooks/useWalletSelector'

import MdOutlineAutoAwesome from '@renderer/assets/images/md-outline-auto-awesome.svg?react'
import TbRosetteDiscountCheck from '@renderer/assets/images/tb-rosette-discount-check.svg?react'

import { authReducerActions } from '@renderer/store/reducers/auth'

export const OnboardingLoginNewWalletStep3Page = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'onboardingLoginNewWalletStep3' })
  const { wallets } = useWalletsSelector()
  const { loginSessionRef } = useLoginSessionSelector()
  const { saveMnemonicToTextFile } = useExportMnemonic()
  const navigateReset = useNavigateReset()
  const dispatch = useAppDispatch()
  const { shouldConfirmAction } = useShouldConfirmActionSelector()

  const handleIsShouldConfirmActionChange = (value: boolean) => {
    dispatch(authReducerActions.setShouldConfirmAction(value))
  }

  const handleBackupAndOpenWallet = async () => {
    const decryptedMnemonic = await EncryptionHelper.decrypt(
      wallets[0].encryptedMnemonic!,
      loginSessionRef.current?.encryptedPassword
    )

    await saveMnemonicToTextFile(decryptedMnemonic)

    dispatch(authReducerActions.saveWallet({ ...wallets[0], backupStatus: 'successful' }))

    AnalyticsHelper.logEvent('onboarding_completed')

    navigateReset('/wallets')
  }

  return (
    <div className="flex w-full grow flex-col items-center">
      <div className="flex grow flex-col items-center gap-y-5">
        <div className="flex flex-col items-center">
          <TbRosetteDiscountCheck className="text-blue size-25 stroke-1" aria-hidden />
          <h3 className="mt-3 text-center text-sm font-bold text-white">{t('description')}</h3>
        </div>

        <Banner type="warning" message={t('backupWarning')} textClassName="py-4" />
      </div>

      <Button
        onClick={handleBackupAndOpenWallet}
        className="w-full pt-4"
        variant="card"
        rightIcon={<MdOutlineAutoAwesome aria-hidden />}
        label={t('backupAndOpenWallet')}
        iconsOnEdge={false}
      />

      <div className="flex items-center justify-center gap-2 pt-4 pb-8 text-white">
        <Checkbox
          id="should-confirm-action"
          checked={shouldConfirmAction}
          onCheckedChange={handleIsShouldConfirmActionChange}
        />
        <label htmlFor="should-confirm-action">{t('shouldConfirmActionPasswordCheckboxLabel')}</label>
      </div>
    </div>
  )
}

export default OnboardingLoginNewWalletStep3Page
