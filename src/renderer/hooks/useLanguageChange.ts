import { useLayoutEffect } from 'react'
import { useLanguageSelector } from '@renderer/hooks/useSettingsSelector'
import i18next from 'i18next'

export const useLanguageChange = () => {
  const { language } = useLanguageSelector()

  useLayoutEffect(() => {
    i18next.changeLanguage(language.value)
  }, [language])
}
