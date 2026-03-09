import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Banner } from '@renderer/components/Banner'
import { Swipe } from '@renderer/components/Swipe'

import { LoggerHelper } from '@renderer/helpers/LoggerHelper'
import { ReduxHelper } from '@renderer/helpers/ReduxHelper'

import { usePressOnce } from '@renderer/hooks/usePressOnce'
import { useCurrencySelector, useLanguageSelector } from '@renderer/hooks/useSettingsSelector'

import { ForgottenPasswordLayout } from '@renderer/layouts/ForgottenPasswordLayout'

import { settingsReducerActions } from '@renderer/store/reducers/settings'

export const ForgottenPasswordConfirmPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'forgottenPasswordConfirm' })
  const { language } = useLanguageSelector()
  const { currency } = useCurrencySelector()

  const navigate = useNavigate()

  const [isCleaning, startClear] = usePressOnce(async () => {
    try {
      await ReduxHelper.persistor.purge()

      ReduxHelper.setup()

      await ReduxHelper.waitForBootstrap()

      ReduxHelper.store.dispatch(settingsReducerActions.setLanguage(language))
      ReduxHelper.store.dispatch(settingsReducerActions.setCurrency(currency))

      navigate('/forgotten-password-success')
    } catch (error) {
      LoggerHelper.error(error, { where: 'ForgottenPasswordConfirmPage', operation: 'clear' })
    }
  })

  return (
    <ForgottenPasswordLayout heading={t('title')}>
      <div className="flex w-full flex-grow flex-col items-center">
        <div className="flex h-full flex-col justify-center gap-8">
          <p className="text-center text-white">{t('text')}</p>
          <Banner type="warning" message={t('alertCard.text')} textClassName="py-4" iconClassName="text-pink" />
        </div>

        <div className="mb-4 flex flex-col items-center justify-center gap-y-4">
          <p className="text-xs text-gray-300">{t('auxiliarText')}</p>

          <Swipe
            text={t('swipe.text')}
            buttonAriaLabel={t('swipe.buttonAriaLabel')}
            isDisabled={isCleaning}
            onComplete={startClear}
          />
        </div>
      </div>
    </ForgottenPasswordLayout>
  )
}

export default ForgottenPasswordConfirmPage
