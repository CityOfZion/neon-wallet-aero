import type { TLanguage } from '@shared/types/store'

export const DEFAULT_LANGUAGE: TLanguage = { label: 'English', value: 'en' }

export const AVAILABLE_LANGUAGES: TLanguage[] = [
  DEFAULT_LANGUAGE,
  { label: '简体中文', value: 'zh' },
  { label: '繁體中文', value: 'zh-Hant' },
]
