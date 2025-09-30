import { cloneElement, JSX } from 'react'
import { NavLink } from 'react-router-dom'
import { Separator } from '@renderer/components/Separator'
import { StyleHelper } from '@renderer/helpers/StyleHelper'

import TbChevronRight from '@renderer/assets/images/tb-chevron-right.svg?react'

type TProps = {
  label: string
  to: string
  icon: JSX.Element
  hideSeparator?: boolean
  isDisabled?: boolean
}

export const SettingsLinkNavigation = ({ label, to, icon, hideSeparator = false, isDisabled = false }: TProps) => {
  return (
    <div className="flex flex-col">
      <NavLink
        to={to}
        aria-disabled={isDisabled}
        tabIndex={isDisabled ? -1 : undefined}
        className={({ isActive }) =>
          StyleHelper.mergeStyles(
            'relative flex w-full cursor-pointer flex-col px-3 transition-opacity duration-200 hover:opacity-75 focus:opacity-75 active:opacity-60',
            {
              'bg-asphalt after:bg-neon after:absolute after:top-0 after:left-0 after:block after:h-full after:w-1 after:content-[""]':
                isActive,
              'pointer-events-none cursor-default opacity-40': isDisabled,
            }
          )
        }
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex w-full flex-row items-center gap-x-3.5 py-3.5">
            {cloneElement(icon, {
              ...icon.props,
              className: StyleHelper.mergeStyles('text-neon ml-2 w-6 h-6', icon.props.className),
            })}

            <p className="text-sm text-white">{label}</p>
          </div>
          <TbChevronRight aria-hidden className="h-6 w-6 text-gray-300" />
        </div>
      </NavLink>

      {!hideSeparator && <Separator />}
    </div>
  )
}
