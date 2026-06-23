import { useRef } from 'react'

import type { ComponentProps } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useTranslation } from 'react-i18next'

import { IconButton } from '@renderer/components/IconButton'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { useClickOutside } from '@renderer/hooks/useClickOutside'
import { useModalFocused, useModalHistories, useModalNavigate } from '@renderer/hooks/useModalRouter'
import { usePressOnce } from '@renderer/hooks/usePressOnce'
import { useRemoveOverflowShift } from '@renderer/hooks/useRemoveOverflowShift'

import TbArrowLeft from '@renderer/assets/images/tb-arrow-left.svg?react'
import TbX from '@renderer/assets/images/tb-x.svg?react'

type TProps = ComponentProps<'div'> & {
  heading: string
  contentClassName?: string
  withBack?: boolean
  eraseOnEsc?: boolean
  eraseOnClickOutside?: boolean
  onClose?: () => Promise<void> | void
  onErase?: () => Promise<void> | void
}

export const BottomModalLayout = ({
  heading,
  className,
  contentClassName,
  withBack = true,
  eraseOnEsc = true,
  eraseOnClickOutside = true,
  onClose,
  onErase,
  children,
  ...props
}: TProps) => {
  const { t } = useTranslation('common')
  const { modalErase, modalNavigate } = useModalNavigate()
  const { histories } = useModalHistories()
  const isFocused = useModalFocused()
  const layoutRef = useRef<HTMLDivElement>(null)

  const { ref } = useRemoveOverflowShift(isFocused)

  const withBackButton = withBack && histories.filter(history => history.route.type === 'bottom').length > 1

  const [isClosing, handleClose] = usePressOnce(async () => {
    await onClose?.()

    modalNavigate(-1)
  })

  const [isErasing, handleErase] = usePressOnce(async () => {
    await Promise.all([onClose?.(), onErase?.()])

    modalErase('bottom')
  })

  const canErase = isFocused && !isClosing && !isErasing

  useHotkeys('esc', handleErase, { enabled: eraseOnEsc && canErase })
  useClickOutside(layoutRef, handleErase, { enabled: eraseOnClickOutside && canErase })

  return (
    <div
      {...props}
      ref={layoutRef}
      className={StyleHelper.mergeStyles('flex h-full min-h-0 w-full flex-col text-white', className)}
    >
      <header className="relative mt-5 mb-5 flex w-full items-center justify-center px-4">
        {withBackButton && (
          <IconButton
            aria-label={t('general.back')}
            className="absolute top-1/2 left-4 -translate-y-1/2"
            icon={<TbArrowLeft aria-hidden />}
            disabled={!canErase}
            onClick={handleClose}
          />
        )}

        <h2 className="w-full max-w-[75%] truncate text-center text-sm font-bold">{heading}</h2>

        <IconButton
          aria-label={t('general.close')}
          className="absolute top-1/2 right-4 -translate-y-1/2"
          icon={<TbX aria-hidden />}
          disabled={!canErase}
          onClick={handleErase}
        />
      </header>

      <main
        ref={ref}
        className={StyleHelper.mergeStyles('flex grow flex-col overflow-y-auto px-4 pb-5', contentClassName)}
      >
        {children}
      </main>
    </div>
  )
}
