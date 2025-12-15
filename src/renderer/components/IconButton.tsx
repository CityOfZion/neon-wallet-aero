import type { TIconClickableCustomProps } from './IconClickable'
import { IconClickable } from './IconClickable'

export type TIconButtonProps = TIconClickableCustomProps & {
  clickableProps?: React.ComponentProps<'div'>
} & React.ComponentProps<'button'>

export const IconButton = ({
  clickableProps,
  variant,
  icon,
  size,
  colorSchema,
  disabled,
  loading,
  ref,
  children,
  ...props
}: TIconButtonProps) => {
  const isDisabled = disabled || loading

  return (
    <button type="button" {...props} disabled={isDisabled} ref={ref}>
      <IconClickable
        {...clickableProps}
        disabled={isDisabled}
        variant={variant}
        icon={icon}
        size={size}
        colorSchema={colorSchema}
        loading={loading}
        children={children}
      />
    </button>
  )
}
