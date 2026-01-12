import { format } from 'date-fns/format'

import { DATE_FNS_LOCALE_BY_LANGUAGE_VALUE } from '@shared/constants/language'
import type { TDateHelperFormatLocalizedOptions } from '@shared/types/helpers'

export class DateHelper {
  static getNowUnix = (): number => {
    return Date.now() / 1000
  }

  static formatLocalized = (date: Date | string | number, options: TDateHelperFormatLocalizedOptions): string => {
    if (typeof date === 'string') {
      date = new Date(date)
    } else if (typeof date === 'number') {
      date *= 1000
    }

    return format(date, options.format, {
      locale: DATE_FNS_LOCALE_BY_LANGUAGE_VALUE[options.language.value],
    })
  }
}
