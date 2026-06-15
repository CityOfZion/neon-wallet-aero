import { Fragment } from 'react'

import i18next from 'i18next'
import { useTranslation } from 'react-i18next'

import { Radio } from '@renderer/components/Radio'
import { Separator } from '@renderer/components/Separator'

import { LanguageHelper } from '@renderer/helpers/LanguageHelper'

import { useActions } from '@renderer/hooks/useActions'
import { useAppDispatch } from '@renderer/hooks/useRedux'
import { useLanguageSelector } from '@renderer/hooks/useSettingsSelector'

import { SettingsLayout } from '@renderer/layouts/SettingsLayout'

import { settingsReducerActions } from '@renderer/store/reducers/settings'

type TActionsData = {
  selectedLanguage: string
}

export const LanguagePage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'language' })
  const { language } = useLanguageSelector()
  const dispatch = useAppDispatch()

  const {
    actionData: { selectedLanguage },
    setData,
  } = useActions<TActionsData>({ selectedLanguage: language?.value })

  const handleSelectLanguage = (value: string) => {
    setData({ selectedLanguage: value })

    const lang = LanguageHelper.availableLanguages.find(item => item.value === value)

    dispatch(settingsReducerActions.setLanguage(lang || LanguageHelper.defaultLanguage))

    i18next.changeLanguage(value)
  }

  return (
    <SettingsLayout title={t('title')}>
      <div className="flex flex-col">
        <Radio.Group
          className="flex flex-col gap-y-1"
          required
          value={selectedLanguage}
          onValueChange={handleSelectLanguage}
        >
          {LanguageHelper.availableLanguages.map((item, index, array) => (
            <Fragment>
              <Radio.Item
                key={`${item.value}-${index}`}
                className="bg-asphalt h-12 rounded px-1"
                withSeparator={false}
                value={item.value}
              >
                <span className="grow text-left text-sm">{item.label}</span>

                <Radio.Indicator />
              </Radio.Item>

              {index + 1 !== array.length && <Separator />}
            </Fragment>
          ))}
        </Radio.Group>
      </div>
    </SettingsLayout>
  )
}

export default LanguagePage
