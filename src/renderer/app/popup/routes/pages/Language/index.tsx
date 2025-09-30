import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { IconButton } from '@renderer/components/IconButton'
import { Radio } from '@renderer/components/Radio'
import { useActions } from '@renderer/hooks/useActions'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { useAppDispatch } from '@renderer/hooks/useRedux'
import { useLanguageSelector } from '@renderer/hooks/useSettingsSelector'
import { ScreenLayout } from '@renderer/layouts/ScreenLayout'
import { settingsReducerActions } from '@renderer/store/reducers/SettingsReducer'
import { AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE } from '@shared/constants/language'
import i18next from 'i18next'

import TbArrowLeft from '@renderer/assets/images/tb-arrow-left.svg?react'
import TbMenu2 from '@renderer/assets/images/tb-menu-2.svg?react'

type TActionsData = {
  selectedLanguage: string
}

export const LanguagePage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'language' })
  const { t: tCommonGeneral } = useTranslation('common', { keyPrefix: 'general' })
  const { modalNavigateWrapper } = useModalNavigate()
  const { language } = useLanguageSelector()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const {
    actionData: { selectedLanguage },
    setData,
  } = useActions<TActionsData>({ selectedLanguage: language?.value })

  const handleSelectLanguage = (value: string) => {
    setData({ selectedLanguage: value })
    const lang = AVAILABLE_LANGUAGES.find(item => item.value === value)
    dispatch(settingsReducerActions.setLanguage(lang || DEFAULT_LANGUAGE))

    i18next.changeLanguage(value)
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <ScreenLayout className="bg-asphalt text-white">
      <div className="flex w-full gap-9">
        <header className="relative mt-2 mb-5 flex w-full flex-row items-center justify-end text-white">
          <IconButton
            type="button"
            icon={<TbArrowLeft aria-hidden />}
            onClick={handleBack}
            aria-label={tCommonGeneral('back')}
          />

          <h1 className="w-full truncate text-center text-sm font-bold">{t('title')}</h1>

          <IconButton
            aria-label={t('menuIconButtonAriaLabel')}
            className="mb-0.5"
            icon={<TbMenu2 aria-hidden />}
            onClick={modalNavigateWrapper('menu')}
          />
        </header>
      </div>
      <div className="flex flex-col">
        <Radio.Group
          className="flex flex-col gap-y-2"
          required
          value={selectedLanguage}
          onValueChange={handleSelectLanguage}
        >
          {AVAILABLE_LANGUAGES.map((item, index) => (
            <Radio.Item
              key={`${item.value}-${index}`}
              className="bg-asphalt h-12 rounded px-1"
              withSeparator={false}
              value={item.value}
            >
              <span className="flex-grow text-left text-sm">{item.label}</span>

              <Radio.Indicator />
            </Radio.Item>
          ))}
        </Radio.Group>
      </div>
    </ScreenLayout>
  )
}
