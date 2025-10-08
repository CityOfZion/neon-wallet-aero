import { cloneElement, ComponentProps, JSX, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconButton } from '@renderer/components/IconButton'
import { StyleHelper } from '@renderer/helpers/StyleHelper'
import { useRemoveOverflowShift } from '@renderer/hooks/useRemoveOverflowShift'

import TbArrowLeft from '@renderer/assets/images/tb-arrow-left.svg?react'

export type TMainLayoutProps = {
  children?: ReactNode
  heading?: string
  icon?: JSX.Element
  rightComponent?: JSX.Element
  leftComponent?: JSX.Element
  contentClassName?: string
  headerClassName?: string
  withBackButton?: boolean
} & ComponentProps<'div'>

export const ScreenLayout = ({
  heading,
  icon,
  children,
  contentClassName,
  headerClassName,
  className,
  rightComponent,
  leftComponent,
  withBackButton = true,
  ...props
}: TMainLayoutProps): JSX.Element => {
  const { ref } = useRemoveOverflowShift<HTMLDivElement>()

  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div
      className={StyleHelper.mergeStyles(
        'flex h-full w-full grow flex-col overflow-x-hidden overflow-y-auto bg-gray-900 px-5 py-3.5 text-white',
        className
      )}
      ref={ref}
      id="screen-layout-container"
      {...props}
    >
      <div className="mx-auto flex h-full min-h-0 w-full max-w-341 flex-grow flex-col">
        {heading && (
          <header
            className={StyleHelper.mergeStyles(
              'relative flex items-center justify-between pt-6 pb-5.5 text-white',
              headerClassName
            )}
          >
            {leftComponent || (
              <IconButton
                type="button"
                icon={<TbArrowLeft aria-hidden />}
                className={StyleHelper.mergeStyles({ invisible: !withBackButton })}
                onClick={handleBack}
              />
            )}

            <h1 className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-x-2 text-sm font-bold">
              {icon &&
                cloneElement(icon, {
                  ...icon.props,
                  className: StyleHelper.mergeStyles(
                    'text-neon min-w-6 max-w-6 min-h-6 max-h-6 h-6 w-6',
                    icon.props.className
                  ),
                })}

              {heading}
            </h1>

            {rightComponent}
          </header>
        )}

        <main
          className={StyleHelper.mergeStyles('flex h-full min-h-0 w-full grow flex-col', contentClassName)}
          id="screen-layout-content"
        >
          {children}
        </main>
      </div>
    </div>
  )
}
