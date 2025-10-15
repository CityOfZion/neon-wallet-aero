import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Banner } from '@renderer/components/Banner'
import { Swipe } from '@renderer/components/Swipe'

import { ForgottenPasswordLayout } from '@renderer/layouts/ForgottenPasswordLayout'

import { RootStore } from '@renderer/store/RootStore'

export const ForgottenPasswordConfirmPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'forgottenPasswordConfirm' })
  const navigate = useNavigate()

  const clearData = async () => {
    await RootStore.persistor.purge()
    navigate('/forgotten-password-success')
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
          <Swipe text={t('swipe.text')} buttonAriaLabel={t('swipe.buttonAriaLabel')} onComplete={clearData} />
        </div>
      </div>
    </ForgottenPasswordLayout>
  )
}

export default ForgottenPasswordConfirmPage
