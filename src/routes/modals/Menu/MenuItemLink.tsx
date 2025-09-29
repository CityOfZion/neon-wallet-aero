import { cloneElement, JSX } from 'react'
import { NavLink } from 'react-router-dom'

import { Separator } from '@/components/Separator'
import { StyleHelper } from '@/helpers/StyleHelper'
import { useModalNavigate } from '@/hooks/useModalRouter'

import TbExternalLink from '@/assets/images/tb-external-link.svg?react'

type TProps = {
  label: string
  to: string
  icon: JSX.Element
  hasSeparator?: boolean
  isExternal?: boolean
  isDisabled?: boolean
}

export const MenuItemLink = ({
  label,
  to,
  icon,
  hasSeparator = true,
  isExternal = false,
  isDisabled = false,
}: TProps) => {
  const { modalEraseWrapper } = useModalNavigate()

  return (
    <li className="-mx-4 w-auto">
      <NavLink
        to={to}
        aria-disabled={isDisabled}
        tabIndex={isDisabled ? -1 : undefined}
        className={({ isActive }) =>
          StyleHelper.mergeStyles(
            'relative flex w-full cursor-pointer flex-col px-3 transition-opacity duration-200 hover:opacity-75 focus:opacity-75 active:opacity-60',
            {
              'pointer-events-none cursor-default opacity-40': isDisabled,
              'bg-asphalt after:bg-neon after:absolute after:top-0 after:left-0 after:block after:h-full after:w-1 after:content-[""]':
                isActive,
            }
          )
        }
        onClick={isDisabled ? undefined : modalEraseWrapper('side')}
      >
        <div className="flex w-full flex-row items-center gap-x-3.5 py-3.5">
          {cloneElement(icon, {
            ...icon.props,
            className: StyleHelper.mergeStyles('text-neon ml-2 size-6', icon.props.className),
          })}

          <p className="flex-grow truncate text-left text-sm text-white">{label}</p>

          {isExternal && <TbExternalLink aria-hidden className="size-6 text-gray-300" />}
        </div>
      </NavLink>

      {hasSeparator && <Separator containerClassName="px-3" />}
    </li>
  )
}
