import { cloneElement, type ComponentProps, type JSX } from 'react'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

type TProps = {
  message: string | JSX.Element
  icon?: JSX.Element
} & ComponentProps<'div'>

export const AlertSuccessBanner = ({ message, className, icon, ...props }: TProps) => {
  return (
    <div
      className={StyleHelper.mergeStyles(
        'flex items-center gap-3 rounded bg-green-700 p-3 text-xs font-semibold text-white',
        className
      )}
      {...props}
    >
      {icon &&
        cloneElement(icon, {
          ...icon.props,
          className: StyleHelper.mergeStyles('text-neon size-6 min-size-6 max-size-6', icon.props.className),
        })}

      <p>{message}</p>
    </div>
  )
}
