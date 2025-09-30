import { TLanguage } from '@shared/types/language'

export const DEFAULT_LANGUAGE: TLanguage = { label: 'English', value: 'en' }

export const AVAILABLE_LANGUAGES: TLanguage[] = [
  DEFAULT_LANGUAGE,
  { label: '简体中文', value: 'zh' },
  { label: '繁體中文', value: 'zh-Hant' },
]
