import { cloneElement } from 'react'

import type { JSX } from 'react'

import { Link } from '@renderer/components/Link'
import { Separator } from '@renderer/components/Separator'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

import TbExternalLink from '@renderer/assets/images/tb-external-link.svg?react'

type TProps = {
  text: string
  linkLabel: string
  link: string
  image: JSX.Element
}

export const BuyAndSellTokensAboutListItem = ({ text, linkLabel, link, image }: TProps) => (
  <li className="flex flex-col items-center gap-y-6">
    <p className="w-full text-left text-sm font-medium">{text}</p>

    <div className="flex h-14 max-h-14 min-h-14 w-56 max-w-56 items-center justify-center rounded-full bg-gray-300/15">
      {cloneElement(image, {
        ...image.props,
        className: StyleHelper.mergeStyles('h-full', image.props.className),
      })}
    </div>

    <Link
      label={linkLabel}
      to={link}
      target="_blank"
      variant="text-slim"
      iconsOnEdge={false}
      clickableProps={{ className: 'gap-x-2' }}
      rightIcon={<TbExternalLink aria-hidden className="h-5 max-h-5 min-h-5 w-5 max-w-5 min-w-5" />}
    />

    <Separator className="bg-gray-300/30" />
  </li>
)
