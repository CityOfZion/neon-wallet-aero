import { forwardRef } from 'react'

import { IconClickable, TIconClickableCustomProps } from './IconClickable'

export type TIconButtonProps = TIconClickableCustomProps & {
  clickableProps?: React.ComponentProps<'div'>
} & React.ComponentProps<'button'>

export const IconButton = forwardRef<HTMLButtonElement, TIconButtonProps>(
  ({ clickableProps, variant, icon, text, size, colorSchema, disabled, loading, ...props }, ref) => {
    const isDisabled = disabled || loading
    return (
      <button {...props} disabled={isDisabled} ref={ref}>
        <IconClickable
          {...clickableProps}
          disabled={isDisabled}
          variant={variant}
          icon={icon}
          text={text}
          size={size}
          colorSchema={colorSchema}
          loading={loading}
          {...props}
        />
      </button>
    )
  }
)
