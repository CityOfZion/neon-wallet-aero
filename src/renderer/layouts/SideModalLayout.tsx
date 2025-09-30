import { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@renderer/components/IconButton'
import { StyleHelper } from '@renderer/helpers/StyleHelper'
import { useModalHistories, useModalNavigate } from '@renderer/hooks/useModalRouter'

import TbArrowLeft from '@renderer/assets/images/tb-arrow-left.svg?react'
import TbX from '@renderer/assets/images/tb-x.svg?react'

type TProps = { heading: string } & ComponentProps<'div'>

export const SideModalLayout = ({ children, heading, className, ...props }: TProps) => {
  const { t } = useTranslation('common')
  const { modalEraseWrapper, modalNavigateWrapper } = useModalNavigate()
  const { histories } = useModalHistories()

  const hasBackButton = histories.filter(({ route }) => route.type === 'side').length > 1

  return (
    <div
      {...props}
      className={StyleHelper.mergeStyles(
        'flex h-full min-h-0 w-full flex-col bg-gray-700 px-4 py-5 text-white',
        className
      )}
    >
      <header className="relative mt-2 mb-5 flex w-full flex-row items-center justify-center">
        {hasBackButton && (
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
          onClick={modalEraseWrapper('side')}
        />
      </header>

      <div className="flex w-full flex-col gap-y-2">{children}</div>
    </div>
  )
}
