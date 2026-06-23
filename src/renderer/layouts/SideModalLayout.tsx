import { cloneElement, useRef } from 'react'

import type { ComponentProps, JSX } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useTranslation } from 'react-i18next'

import { IconButton } from '@renderer/components/IconButton'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { useClickOutside } from '@renderer/hooks/useClickOutside'
import { useModalFocused, useModalHistories, useModalNavigate } from '@renderer/hooks/useModalRouter'

import TbArrowLeft from '@renderer/assets/images/tb-arrow-left.svg?react'
import TbX from '@renderer/assets/images/tb-x.svg?react'

type TProps = ComponentProps<'div'> & {
  heading: string
  icon?: JSX.Element
  contentClassName?: string
  eraseOnEsc?: boolean
  eraseOnClickOutside?: boolean
  onClose?: () => void
}

export const SideModalLayout = ({
  heading,
  icon,
  className,
  contentClassName,
  eraseOnEsc = true,
  eraseOnClickOutside = true,
  onClose,
  children,
  ...props
}: TProps) => {
  const { t } = useTranslation('common')
  const { modalErase, modalNavigate } = useModalNavigate()
  const { histories } = useModalHistories()
  const isFocused = useModalFocused()
  const layoutRef = useRef<HTMLDivElement>(null)

  const withBackButton = histories.filter(({ route }) => route.type === 'side').length > 1

  const handleBack = () => {
    onClose?.()

    modalNavigate(-1)
  }

  const handleErase = () => {
    onClose?.()

    modalErase('side')
  }

  useHotkeys('esc', handleErase, { enabled: eraseOnEsc && isFocused })
  useClickOutside(layoutRef, handleErase, { enabled: eraseOnClickOutside && isFocused })

  return (
    <div
      {...props}
      ref={layoutRef}
      className={StyleHelper.mergeStyles(
        'flex h-full min-h-0 w-full flex-col overflow-y-auto px-4 pt-5 pb-10 text-sm text-white',
        className
      )}
    >
      <header className="relative mt-2 mb-5 flex w-full flex-row items-center justify-center">
        {withBackButton && (
          <IconButton
            aria-label={t('general.back')}
            className="absolute top-1/2 left-0 -translate-y-1/2"
            icon={<TbArrowLeft aria-hidden />}
            onClick={handleBack}
          />
        )}

        <h2 className="flex w-full max-w-[70%] items-center justify-center gap-x-2 text-center text-sm font-bold">
          {icon &&
            cloneElement(icon, {
              ...icon.props,
              className: StyleHelper.mergeStyles('text-neon size-6 min-size-6 max-size-6', icon.props.className),
            })}

          <span className="truncate">{heading}</span>
        </h2>

        <IconButton
          aria-label={t('general.close')}
          className="absolute top-1/2 right-0 -translate-y-1/2"
          icon={<TbX aria-hidden />}
          onClick={handleErase}
        />
      </header>

      <main className={StyleHelper.mergeStyles('flex w-full flex-col gap-y-2', contentClassName)}>{children}</main>
    </div>
  )
}
