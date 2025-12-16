import { cloneElement } from 'react'

import { match, P } from 'ts-pattern'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { Loader } from './Loader'

export type TCustomClickableProps = {
  label?: string | React.JSX.Element
  leftIcon?: React.JSX.Element
  rightIcon?: React.JSX.Element
  variant?: 'outlined' | 'contained' | 'text' | 'text-slim' | 'card'
  disabled?: boolean
  loading?: boolean
  flat?: boolean
  wide?: boolean
  colorSchema?: 'neon' | 'gray' | 'white' | 'error' | 'blue' | 'yellow' | 'asphalt'
  iconsOnEdge?: boolean
  textClassName?: string
}

export type TClickableProps = TCustomClickableProps & React.ComponentProps<'div'>

const Outline = ({ className, ...props }: TClickableProps) => {
  return (
    <Base
      className={StyleHelper.mergeStyles(
        'group flex cursor-pointer items-center justify-center rounded-sm border py-3 text-center transition-colors',
        'group-aria-[disabled=true]:border-gray-100/50 group-aria-[disabled=true]:text-gray-100/50 group-aria-[disabled=true]:opacity-100',
        'group-aria-[disabled=false]:hover:bg-gray-300/15',
        {
          'border-neon': props.colorSchema === 'neon',
          'border-gray-100': props.colorSchema === 'gray',
          'border-white': props.colorSchema === 'white',
          'border-pink': props.colorSchema === 'error',
          'border-blue': props.colorSchema === 'blue',
          'border-yellow': props.colorSchema === 'yellow',
          'border-asphalt': props.colorSchema === 'asphalt',
        },
        className
      )}
      {...props}
    />
  )
}

const Contained = ({ className, ...props }: TClickableProps) => {
  return (
    <Base
      className={StyleHelper.mergeStyles(
        'flex min-w-0 items-center justify-center rounded-sm py-3 text-center transition-colors',
        'group-aria-[disabled=true]:bg-gray-300/30 group-aria-[disabled=true]:text-gray-100/50 group-aria-[disabled=true]:opacity-100',
        'group-aria-[disabled=false]:bg-linear-to-t group-aria-[disabled=false]:from-gray-800 group-aria-[disabled=false]:to-gray-600 group-aria-[disabled=false]:shadow-[4px_8px_20px_0px_rgba(18,21,23,0.40),inset_1px_1px_0px_0px_rgba(214,210,210,0.14),inset_-1px_-1px_0px_0px_rgba(0,0,0,0.32)] group-aria-[disabled=false]:hover:from-gray-600 group-aria-[disabled=false]:hover:to-gray-600',
        className
      )}
      {...props}
    />
  )
}

const Text = ({ className, ...props }: TClickableProps) => {
  return (
    <Base
      className={StyleHelper.mergeStyles(
        'flex min-w-0 items-center justify-center rounded-sm text-center transition-colors group-aria-[disabled=false]:hover:bg-gray-300/15',
        className
      )}
      {...props}
    />
  )
}

const TextSlim = ({ className, ...props }: TClickableProps) => {
  return (
    <Base
      className={StyleHelper.mergeStyles(
        'flex h-fit min-w-0 items-center justify-center px-0 text-center transition-opacity group-aria-[disabled=false]:hover:opacity-75 group-aria-[disabled=false]:focus:opacity-75 group-aria-[disabled=false]:active:opacity-50',
        className
      )}
      {...props}
    />
  )
}

const Card = ({ className, ...props }: TClickableProps) => {
  return (
    <Base
      className={StyleHelper.mergeStyles(
        'flex min-w-0 items-center justify-center rounded-sm py-3 text-center transition-colors',
        'group-aria-[disabled=true]:bg-gray-300/30 group-aria-[disabled=true]:text-gray-100/50 group-aria-[disabled=true]:opacity-100',
        'group-aria-[disabled=false]:bg-gray-300/15 group-aria-[disabled=false]:hover:bg-gray-300/30',
        className
      )}
      {...props}
    />
  )
}

const Base = ({
  leftIcon,
  rightIcon,
  label,
  loading,
  flat,
  colorSchema,
  iconsOnEdge,
  wide,
  textClassName,
  children,
  ...props
}: TClickableProps) => {
  const { className: leftIconClassName = '', ...leftIconProps } = leftIcon ? leftIcon.props : {}
  const { className: rightIconClassName = '', ...rightIconProps } = rightIcon ? rightIcon.props : {}

  const buildIconClassName = (className: string) => {
    return StyleHelper.mergeStyles(
      'object-contain',
      {
        'w-[1.5rem] h-[1.5rem] min-w-[1.5rem] min-h-[1.5rem]': !flat,
        'w-[1.25rem] h-[1.25rem] min-w-[1.25rem] min-h-[1.25rem]': flat,
      },
      className
    )
  }

  return (
    <div
      className={StyleHelper.mergeStyles(
        'relative w-full gap-x-2.5 group-aria-[disabled=false]:cursor-pointer group-aria-[disabled=true]:cursor-not-allowed group-aria-[disabled=true]:opacity-50',
        {
          'px-7': wide,
          'h-12 text-sm': !flat,
          'h-8.5 text-xs': flat,
          'px-3': !flat && !wide,
          'px-2': flat && !wide,
          'text-neon': colorSchema === 'neon',
          'text-gray-200': colorSchema === 'gray',
          'text-white': colorSchema === 'white',
          'text-pink': colorSchema === 'error',
          'text-blue': colorSchema === 'blue',
          'text-yellow': colorSchema === 'yellow',
          'text-asphalt': colorSchema === 'asphalt',
        },
        props.className,
        { '[&>*:not(.loader)]:invisible': loading }
      )}
    >
      {leftIcon &&
        cloneElement(leftIcon, {
          className: buildIconClassName(leftIconClassName),
          ...leftIconProps,
        })}

      {match({ label, children })
        .with({ children: P.nonNullable }, () => (typeof children === 'string' ? <span>{children}</span> : children))
        .with({ label: P.string }, () => (
          <span
            className={StyleHelper.mergeStyles(
              'truncate font-medium',
              {
                grow: iconsOnEdge,
              },
              textClassName
            )}
          >
            {label}
          </span>
        ))
        .otherwise(() => label)}

      {rightIcon &&
        cloneElement(rightIcon, {
          className: buildIconClassName(rightIconClassName),
          ...rightIconProps,
        })}

      <Loader
        className={StyleHelper.mergeStyles({
          'h-6 w-6': !flat,
          'h-5 w-5': flat,
        })}
        containerClassName={StyleHelper.mergeStyles('absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2', {
          hidden: !loading,
        })}
      />
    </div>
  )
}

export const Clickable = ({
  colorSchema = 'neon',
  disabled = false,
  loading = false,
  flat = false,
  iconsOnEdge = true,
  wide = false,
  variant = 'contained',
  ...rest
}: TClickableProps) => {
  const props = { ...rest, wide, variant, colorSchema, disabled, loading, flat, iconsOnEdge }

  return match(props.variant)
    .with('outlined', () => <Outline {...props} />)
    .with('text', () => <Text {...props} />)
    .with('text-slim', () => <TextSlim {...props} />)
    .with('contained', () => <Contained {...props} />)
    .otherwise(() => <Card {...props} />)
}
