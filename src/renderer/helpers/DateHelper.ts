import { format } from 'date-fns/format'
import * as dateFnsLocales from 'date-fns/locale'

import type { TDateHelperFormatLocalizedOptions } from '@shared/types/helpers'

export class DateHelper {
  static readonly dateFnsLocaleByLanguage: Record<string, dateFnsLocales.Locale> = {
    en: dateFnsLocales.enUS,
    de: dateFnsLocales.de,
    'pt-BR': dateFnsLocales.ptBR,
    zh: dateFnsLocales.zhCN,
    'zh-Hant': dateFnsLocales.zhTW,
  }

  static getNowUnix(): number {
    return Date.now() / 1000
  }

  static formatLocalized(date: Date | string | number, options: TDateHelperFormatLocalizedOptions): string {
    if (typeof date === 'string') {
      date = new Date(date)
    } else if (typeof date === 'number') {
      date *= 1000
    }

    return format(date, options.format, {
      locale: this.dateFnsLocaleByLanguage[options.language.value],
    })
  }

  static format(date: Date | string, formatString: string): string {
    if (typeof date === 'string') {
      date = new Date(date)
    }

    return format(date, formatString)
  }
}
