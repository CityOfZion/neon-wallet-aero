import { forwardRef } from 'react'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

import type { TCustomClickableProps } from './Clickable'
import { Clickable } from './Clickable'

export type TButtonProps = TCustomClickableProps & {
  clickableProps?: React.ComponentProps<'div'>
} & React.ComponentProps<'button'>

export const Button = forwardRef<HTMLButtonElement, TButtonProps>(
  (
    {
      clickableProps,
      label,
      variant,
      rightIcon,
      leftIcon,
      flat,
      colorSchema,
      iconsOnEdge,
      loading,
      disabled,
      wide,
      textClassName,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading || false

    return (
      <button
        className={StyleHelper.mergeStyles('group', className)}
        {...props}
        aria-disabled={isDisabled}
        disabled={isDisabled}
        ref={ref}
      >
        <Clickable
          {...clickableProps}
          label={label}
          variant={variant}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          flat={flat}
          loading={loading}
          disabled={isDisabled}
          colorSchema={colorSchema}
          iconsOnEdge={iconsOnEdge}
          wide={wide}
          textClassName={textClassName}
        >
          {children}
        </Clickable>
      </button>
    )
  }
)
