import { cloneElement, ComponentProps, JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@renderer/components/IconButton'
import { StyleHelper } from '@renderer/helpers/StyleHelper'
import { useModalHistories, useModalNavigate } from '@renderer/hooks/useModalRouter'

import TbArrowLeft from '@renderer/assets/images/tb-arrow-left.svg?react'
import TbX from '@renderer/assets/images/tb-x.svg?react'

type TProps = ComponentProps<'div'> & {
  heading: string
  icon?: JSX.Element
  onClose?: () => void
}

export const SideModalLayout = ({ children, heading, icon, className, onClose, ...props }: TProps) => {
  const { t } = useTranslation('common')
  const { modalErase, modalNavigate } = useModalNavigate()
  const { histories } = useModalHistories()

  const hasBackButton = histories.filter(({ route }) => route.type === 'side').length > 1

  const handleBack = () => {
    onClose?.()

    modalNavigate(-1)
  }

  const handleErase = () => {
    onClose?.()

    modalErase('side')
  }

  return (
    <div
      {...props}
      className={StyleHelper.mergeStyles(
        'flex h-full min-h-0 w-full flex-col overflow-y-auto bg-gray-700 px-4 pt-5 pb-10 text-sm text-white',
        className
      )}
    >
      <header className="relative mt-2 mb-5 flex w-full flex-row items-center justify-center">
        {hasBackButton && (
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
              className: StyleHelper.mergeStyles(
                'text-neon min-w-6 max-w-6 min-h-6 max-h-6 h-6 w-6',
                icon.props.className
              ),
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

      <div className="flex w-full flex-col gap-y-2">{children}</div>
    </div>
  )
}
