import type { JSX } from 'react'
import { match, P } from 'ts-pattern'

import { Button } from '@renderer/components/Button'
import { Link } from '@renderer/components/Link'
import { Separator } from '@renderer/components/Separator'

import TbChevronRight from '@renderer/assets/images/tb-chevron-right.svg?react'
import TbExternalLink from '@renderer/assets/images/tb-external-link.svg?react'

type TProps = {
  label: string
  to?: string
  onClick?: () => void
  icon: JSX.Element
  hideSeparator?: boolean
  isExternal?: boolean
}

export const HelpLinkItem = ({ label, to, onClick, icon, isExternal, hideSeparator = false }: TProps) => {
  const linkItemContent = (
    <div className="flex w-full items-center text-sm text-white">
      <p className="w-full text-left">{label}</p>

      {isExternal ? (
        <TbExternalLink aria-hidden className="size-6 text-gray-300" />
      ) : (
        <TbChevronRight aria-hidden className="size-6 text-gray-300" />
      )}
    </div>
  )

  return (
    <li className="flex flex-col">
      {match(to)
        .with(P.string, to => (
          <Link
            to={to}
            target="_blank"
            clickableProps={{ className: 'justify-between gap-x-3.5' }}
            leftIcon={icon}
            variant="text"
          >
            {linkItemContent}
          </Link>
        ))
        .otherwise(() => (
          <Button
            onClick={onClick}
            leftIcon={icon}
            variant="text"
            clickableProps={{ className: 'justify-between gap-x-3.5' }}
          >
            {linkItemContent}
          </Button>
        ))}
      {!hideSeparator && <Separator />}
    </li>
  )
}
