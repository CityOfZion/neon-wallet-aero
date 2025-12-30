import { cloneElement } from 'react'

import type { ComponentProps } from 'react'
import type React from 'react'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

import TbAlertTriangle from '@renderer/assets/images/tb-alert-triangle.svg?react'

export type TAlertErrorBanner = {
  message: string | React.JSX.Element
  messageClassName?: string
  icon?: React.JSX.Element
  iconClassName?: string
}

type TProps = TAlertErrorBanner & ComponentProps<'div'>

export const AlertErrorBanner = ({ className, message, messageClassName, icon, iconClassName, ...props }: TProps) => {
  return (
    <div
      className={StyleHelper.mergeStyles(
        'bg-magenta-700 flex items-center gap-3 rounded p-3 text-xs font-semibold text-white',
        className
      )}
      {...props}
    >
      {icon ? (
        cloneElement(icon, {
          className: StyleHelper.mergeStyles('text-magenta size-6 min-size-6 max-size-6 ', icon.props.className),
        })
      ) : (
        <TbAlertTriangle
          aria-hidden
          className={StyleHelper.mergeStyles('text-magenta ize-6 min-size-6 max-size-6', iconClassName)}
        />
      )}

      <p className={messageClassName}>{message}</p>
    </div>
  )
}
