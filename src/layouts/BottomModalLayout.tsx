import { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { IconButton } from '@/components/IconButton'
import { StyleHelper } from '@/helpers/StyleHelper'
import { useModalHistories, useModalNavigate } from '@/hooks/useModalRouter'

import TbArrowLeft from '@/assets/images/tb-arrow-left.svg?react'
import TbX from '@/assets/images/tb-x.svg?react'

type TProps = { heading: string; hideBackButton?: boolean } & ComponentProps<'div'>

export const BottomModalLayout = ({ children, heading, className, hideBackButton = false, ...props }: TProps) => {
  const { t } = useTranslation('common')
  const { modalEraseWrapper, modalNavigateWrapper } = useModalNavigate()
  const { histories } = useModalHistories()

  const withBackButton = !hideBackButton && histories.filter(history => history.route.type === 'bottom').length > 1

  return (
    <div
      className={StyleHelper.mergeStyles(
        'flex h-full min-h-0 w-full flex-col rounded-t-2xl bg-gray-700 px-4 py-5 text-white',
        className
      )}
      {...props}
    >
      <header className="relative mb-5 flex w-full items-center justify-center">
        {withBackButton && (
          <IconButton
            aria-label={t('general.back')}
            className="absolute top-1/2 left-0 -translate-y-1/2"
            icon={<TbArrowLeft aria-hidden />}
            onClick={modalNavigateWrapper(-1)}
          />
        )}

        <h2 className="w-full max-w-[75%] truncate text-center text-sm font-bold">{heading}</h2>

        <IconButton
          aria-label={t('general.close')}
          className="absolute top-1/2 right-0 -translate-y-1/2"
          icon={<TbX aria-hidden />}
          onClick={modalEraseWrapper('bottom')}
        />
      </header>

      {children}
    </div>
  )
}
