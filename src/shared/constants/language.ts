import type { Locale } from 'date-fns/locale'
import * as dateFnsLocales from 'date-fns/locale'

import type { TLanguage } from '@shared/types/store'

export const DEFAULT_LANGUAGE: TLanguage = { label: 'English', value: 'en' }

export const AVAILABLE_LANGUAGES: TLanguage[] = [
  DEFAULT_LANGUAGE,
  { label: 'Deutsch', value: 'de' },
  { label: 'Português (BR)', value: 'pt-BR' },
  { label: '简体中文', value: 'zh' },
  { label: '繁體中文', value: 'zh-Hant' },
]

export const DATE_FNS_LOCALE_BY_LANGUAGE_VALUE: Record<string, Locale> = {
  en: dateFnsLocales.enUS,
  de: dateFnsLocales.de,
  'pt-BR': dateFnsLocales.ptBR,
  zh: dateFnsLocales.zhCN,
  'zh-Hant': dateFnsLocales.zhTW,
}
