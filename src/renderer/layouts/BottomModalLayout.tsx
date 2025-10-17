import type { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { IconButton } from '@renderer/components/IconButton'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { useModalFocused, useModalHistories, useModalNavigate } from '@renderer/hooks/useModalRouter'
import { useRemoveOverflowShift } from '@renderer/hooks/useRemoveOverflowShift'

import TbArrowLeft from '@renderer/assets/images/tb-arrow-left.svg?react'
import TbX from '@renderer/assets/images/tb-x.svg?react'

type TProps = {
  heading: string
  hideBackButton?: boolean
  onClose?: () => Promise<void> | void
  onErase?: () => Promise<void> | void
  contentClassName?: string
} & ComponentProps<'div'>

export const BottomModalLayout = ({
  children,
  heading,
  className,
  hideBackButton = false,
  onClose,
  onErase,
  contentClassName,
  ...props
}: TProps) => {
  const { t } = useTranslation('common')
  const { modalErase, modalNavigate } = useModalNavigate()
  const { histories } = useModalHistories()
  const isFocused = useModalFocused()

  const { ref } = useRemoveOverflowShift(isFocused)

  const withBackButton = !hideBackButton && histories.filter(history => history.route.type === 'bottom').length > 1

  const handleGoBack = () => {
    onClose?.()
    modalNavigate(-1)
  }

  const handleClose = async () => {
    onClose?.()
    onErase?.()
    modalErase('bottom')
  }

  return (
    <div className={StyleHelper.mergeStyles('flex h-full min-h-0 w-full flex-col text-white', className)} {...props}>
      <header className="relative mt-5 mb-5 flex w-full items-center justify-center px-4">
        {withBackButton && (
          <IconButton
            aria-label={t('general.back')}
            className="absolute top-1/2 left-4 -translate-y-1/2"
            icon={<TbArrowLeft aria-hidden />}
            onClick={handleGoBack}
          />
        )}

        <h2 className="w-full max-w-[75%] truncate text-center text-sm font-bold">{heading}</h2>

        <IconButton
          aria-label={t('general.close')}
          className="absolute top-1/2 right-4 -translate-y-1/2"
          icon={<TbX aria-hidden />}
          onClick={handleClose}
        />
      </header>

      <main
        ref={ref}
        className={StyleHelper.mergeStyles('flex flex-grow flex-col overflow-y-auto px-4 pb-5', contentClassName)}
      >
        {children}
      </main>
    </div>
  )
}
