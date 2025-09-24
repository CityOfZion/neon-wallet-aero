import { cloneElement, JSX } from 'react'
import { NavLink } from 'react-router-dom'
import { match, P } from 'ts-pattern'

import { Separator } from '@/components/Separator'
import { StyleHelper } from '@/helpers/StyleHelper'
import { useModalNavigate } from '@/hooks/useModalRouter'

import TbExternalLink from '@/assets/images/tb-external-link.svg?react'

type TContentProps = Pick<TProps, 'label' | 'icon' | 'isExternal'>

type TProps = {
  label: string
  icon: JSX.Element
  hasSeparator?: boolean
  isExternal?: boolean
  isDisabled?: boolean
  to?: string
  onClick?: () => void
}

const Content = ({ label, icon, isExternal }: TContentProps) => {
  return (
    <div className="flex w-full flex-row items-center gap-x-3.5 py-3.5">
      {cloneElement(icon, {
        ...icon.props,
        className: StyleHelper.mergeStyles('text-neon ml-2 w-6 h-6', icon.props.className),
      })}

      <p className="flex-grow truncate text-left text-sm text-white">{label}</p>

      {isExternal && <TbExternalLink aria-hidden className="h-6 w-6 text-gray-300" />}
    </div>
  )
}

export const MenuItem = ({
  label,
  icon,
  to,
  onClick,
  hasSeparator = true,
  isExternal = false,
  isDisabled = false,
}: TProps) => {
  const { modalErase, modalEraseWrapper } = useModalNavigate()

  const className = StyleHelper.mergeStyles(
    'relative flex w-full cursor-pointer flex-col px-3 transition-opacity duration-200 hover:opacity-75 focus:opacity-75 active:opacity-60',
    {
      'pointer-events-none cursor-default opacity-40': isDisabled,
    }
  )

  return (
    <li className="-mx-4 w-auto">
      {match({ onClick, to })
        .with({ onClick: P.nonNullable }, () => (
          <button
            className={className}
            disabled={isDisabled}
            onClick={() => {
              onClick?.()
              modalErase('side')
            }}
          >
            <Content label={label} icon={icon} isExternal={isExternal} />
          </button>
        ))
        .with({ to: P.nonNullable }, () => (
          <NavLink
            to={to!}
            aria-disabled={isDisabled}
            tabIndex={isDisabled ? -1 : undefined}
            className={({ isActive }) =>
              StyleHelper.mergeStyles(className, {
                'bg-asphalt after:bg-neon after:absolute after:top-0 after:left-0 after:block after:h-full after:w-1 after:content-[""]':
                  isActive,
              })
            }
            onClick={isDisabled ? undefined : modalEraseWrapper('side')}
          >
            <Content label={label} icon={icon} isExternal={isExternal} />
          </NavLink>
        ))
        .run()}

      {hasSeparator && <Separator containerClassName="px-3" />}
    </li>
  )
}
