import type { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import TbX from '@renderer/assets/images/tb-x.svg?react'

type TProps = ComponentProps<'div'>

export const TemporaryLimitsBox = (props: TProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'temporaryLimitsBox' })

  const limits = t('limits', { returnObjects: true })

  return (
    <div {...props}>
      <p className="text-center text-xs text-gray-100">{t('description')}</p>

      <div className="mt-3.5 grid w-full grid-cols-2 justify-items-stretch gap-x-6.5 gap-y-2.5 rounded bg-gray-300/15 px-4 py-3">
        {limits.map((limit, index) => (
          <div className="flex items-center gap-1.5" key={`limits-${index}`}>
            <TbX aria-hidden className="text-pink h-4 w-4 stroke-[3px]" />
            <p className="relative -top-px text-xs text-gray-100">{limit}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
