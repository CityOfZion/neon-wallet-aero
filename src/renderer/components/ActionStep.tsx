import { cloneElement } from 'react'

import type { JSX, ReactNode } from 'react'

import { ElementHelper } from '@renderer/helpers/ElementHelper'
import { StyleHelper } from '@renderer/helpers/StyleHelper'

type TProps = {
  title: ReactNode
  disabled?: boolean
  leftIcon?: JSX.Element
  leftIconContainerClassName?: string
  className?: string
  titleClassName?: string
  headerClassName?: string
  footer?: ReactNode
  children?: ReactNode
}

export const ActionStep = ({
  title,
  disabled,
  leftIcon,
  className,
  titleClassName,
  headerClassName,
  leftIconContainerClassName,
  footer,
  children,
}: TProps) => {
  return (
    <div className="flex w-full flex-col">
      <div className={StyleHelper.mergeStyles('flex min-h-14 w-full items-center justify-between gap-3', className)}>
        <div
          className={StyleHelper.mergeStyles(
            'flex min-w-0 flex-grow items-center gap-1.5',
            {
              'opacity-50': disabled,
            },
            headerClassName
          )}
        >
          {leftIcon && (
            <div
              className={StyleHelper.mergeStyles('flex size-5 items-center justify-center', leftIconContainerClassName)}
            >
              {cloneElement(leftIcon, {
                ...leftIcon.props,
                className: StyleHelper.mergeStyles('text-blue size-full', leftIcon.props.className),
              })}
            </div>
          )}

          {ElementHelper.isTextContentValid(title) ? (
            <span className={StyleHelper.mergeStyles('truncate text-sm text-white', titleClassName)}>{title}</span>
          ) : (
            title
          )}
        </div>

        {children}
      </div>

      {footer}
    </div>
  )
}
