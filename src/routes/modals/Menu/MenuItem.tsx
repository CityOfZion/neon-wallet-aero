import { cloneElement, JSX } from 'react'
import { NavLink } from 'react-router-dom'

import { Separator } from '@/components/Separator'
import { StyleHelper } from '@/helpers/StyleHelper'
import { useModalNavigate } from '@/hooks/useModalRouter'

type TProps = {
  label: string
  to: string
  hasSeparator?: boolean
  icon: JSX.Element
}

export const MenuItem = ({ label, icon, to, hasSeparator = true }: TProps) => {
  const { modalEraseWrapper } = useModalNavigate()

  return (
    <li className="-mx-4 w-auto">
      <NavLink
        to={to}
        className={({ isActive }) =>
          StyleHelper.mergeStyles(
            'relative flex w-full cursor-pointer flex-col px-3 transition-opacity duration-200 hover:opacity-75 focus:opacity-75 active:opacity-60',
            {
              'bg-asphalt after:bg-neon after:absolute after:top-0 after:left-0 after:block after:h-full after:w-1 after:content-[""]':
                isActive,
            }
          )
        }
        onClick={modalEraseWrapper('side')}
      >
        <div className="flex w-full flex-row items-center gap-x-3.5 py-3.5">
          {cloneElement(icon, {
            ...icon.props,
            className: StyleHelper.mergeStyles('text-neon ml-2 w-6 h-6', icon.props.className),
          })}

          <p className="text-md text-white">{label}</p>
        </div>
      </NavLink>

      {hasSeparator && <Separator containerClassName="px-3" />}
    </li>
  )
}
