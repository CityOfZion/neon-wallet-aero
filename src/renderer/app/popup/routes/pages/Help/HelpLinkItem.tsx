import { JSX } from 'react'
import { Link } from '@renderer/components/Link'
import { Separator } from '@renderer/components/Separator'

import TbChevronRight from '@renderer/assets/images/tb-chevron-right.svg?react'

type TProps = {
  label: string
  to: string
  icon: JSX.Element
  hideSeparator?: boolean
}

export const HelpLinkItem = ({ label, to, icon, hideSeparator = false }: TProps) => {
  return (
    <li className="flex flex-col">
      <Link
        to={to}
        target="_blank"
        clickableProps={{ className: 'justify-between gap-x-3.5' }}
        leftIcon={icon}
        variant="text"
      >
        <div className="flex w-full items-center">
          <div className="flex w-full flex-row items-center py-3.5">
            <p className="text-sm text-white">{label}</p>
          </div>
          <TbChevronRight aria-hidden className="size-6 text-gray-300" />
        </div>
      </Link>
      {!hideSeparator && <Separator />}
    </li>
  )
}
