import { useTransition } from 'react'

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Banner } from '@renderer/components/Banner'
import { Swipe } from '@renderer/components/Swipe'

import { useCurrencySelector, useLanguageSelector } from '@renderer/hooks/useSettingsSelector'

import { ForgottenPasswordLayout } from '@renderer/layouts/ForgottenPasswordLayout'

import { settingsReducerActions } from '@renderer/store/reducers/settings'
import { RootStore } from '@renderer/store/RootStore'

export const ForgottenPasswordConfirmPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'forgottenPasswordConfirm' })
  const { language } = useLanguageSelector()
  const { currency } = useCurrencySelector()
  const [isCleaningData, startIsCleaningData] = useTransition()
  const navigate = useNavigate()

  const handleClearData = async () => {
    if (isCleaningData) return

    startIsCleaningData(async () => {
      try {
        await RootStore.persistor.purge()

        RootStore.setupStore()

        RootStore.store.dispatch(settingsReducerActions.setLanguage(language))
        RootStore.store.dispatch(settingsReducerActions.setCurrency(currency))

        navigate('/forgotten-password-success')
      } catch (error) {
        console.error(error)
      }
    })
  }

  return (
    <ForgottenPasswordLayout heading={t('title')}>
      <div className="flex w-full flex-grow flex-col items-center">
        <div className="flex h-full flex-col justify-center gap-8">
          <p className="text-center text-white">{t('text')}</p>
          <Banner type="warning" message={t('alertCard.text')} textClassName="py-4" iconClassName="text-pink" />
        </div>

        <div className="flex flex-col items-center justify-center gap-y-4">
          <p className="text-xs text-gray-300">{t('auxiliarText')}</p>

          <Swipe
            text={t('swipe.text')}
            buttonAriaLabel={t('swipe.buttonAriaLabel')}
            isDisabled={isCleaningData}
            onComplete={handleClearData}
          />
        </div>
      </div>
    </ForgottenPasswordLayout>
  )
}

export default ForgottenPasswordConfirmPage
