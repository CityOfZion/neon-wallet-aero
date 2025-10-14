import { Link as RRDLink, LinkProps as RRDLinkProps } from 'react-router-dom'
import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { Clickable, TCustomClickableProps } from './Clickable'

export type TLinkProps = { clickableProps?: React.ComponentProps<'div'> } & TCustomClickableProps & RRDLinkProps

export const Link = ({
  clickableProps,
  label,
  variant,
  leftIcon,
  rightIcon,
  flat,
  colorSchema,
  iconsOnEdge,
  className,
  loading,
  disabled,
  onClick,
  wide,
  textClassName,
  children,
  ...props
}: TLinkProps) => {
  const isDisabled = disabled || loading

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (disabled) {
      e.preventDefault()
    }

    onClick?.(e)
  }

  return (
    <RRDLink
      aria-disabled={isDisabled}
      className={StyleHelper.mergeStyles('cursor-default', className)}
      onClick={handleClick}
      {...props}
    >
      <Clickable
        {...clickableProps}
        label={label}
        variant={variant}
        rightIcon={rightIcon}
        flat={flat}
        leftIcon={leftIcon}
        loading={loading}
        disabled={isDisabled}
        colorSchema={colorSchema}
        iconsOnEdge={iconsOnEdge}
        wide={wide}
        textClassName={textClassName}
      >
        {children}
      </Clickable>
    </RRDLink>
  )
}
