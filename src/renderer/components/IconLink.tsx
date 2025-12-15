import type { ComponentProps } from 'react'
import type { NavLinkProps } from 'react-router-dom'
import { NavLink } from 'react-router-dom'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

import type { TIconClickableCustomProps } from './IconClickable'
import { IconClickable } from './IconClickable'

export type TIconButtonProps = TIconClickableCustomProps & {
  clickableProps?: ComponentProps<'div'>
} & Omit<NavLinkProps, 'children'> &
  ComponentProps<'a'>

export const IconLink = ({
  to,
  className,
  variant,
  colorSchema,
  size,
  icon,
  disabled,
  loading,
  onClick,
  clickableProps,
  ref,
  children,
  ...props
}: TIconButtonProps) => {
  const isDisabled = disabled || loading

  return (
    <NavLink
      {...props}
      ref={ref}
      to={to}
      aria-disabled={isDisabled}
      tabIndex={isDisabled ? -1 : undefined}
      className={StyleHelper.mergeStyles(className, { 'pointer-events-none cursor-not-allowed': isDisabled })}
      onClick={isDisabled ? undefined : onClick}
    >
      <IconClickable
        {...clickableProps}
        variant={variant}
        colorSchema={colorSchema}
        size={size}
        disabled={isDisabled}
        loading={loading}
        icon={icon}
        children={children}
      />
    </NavLink>
  )
}
