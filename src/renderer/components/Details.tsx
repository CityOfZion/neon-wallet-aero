import { cloneElement, ComponentProps, JSX, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleHelper } from '@renderer/helpers/StyleHelper'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'
import { TBlockchainServiceKey } from '@shared/types/blockchain'

import { BlockchainIcon } from './BlockchainIcon'
import { IconButton } from './IconButton'
import { Separator } from './Separator'

import MdContentCopy from '@renderer/assets/images/md-content-copy.svg?react'

type TRootProps = ComponentProps<'div'>

const Root = ({ className, children, ...props }: TRootProps) => {
  return (
    <div
      className={StyleHelper.mergeStyles('bg-asphalt flex w-full flex-col rounded px-4 py-2.5', className)}
      {...props}
    >
      {children}
    </div>
  )
}

type THeaderProps = {
  label: string
  icon?: JSX.Element
} & ComponentProps<'div'>

const Header = ({ label, icon, children, ...props }: THeaderProps) => {
  return (
    <div {...props}>
      <div className="flex items-center gap-2.5">
        {icon &&
          cloneElement(icon, {
            'aria-hidden': true,
            className: StyleHelper.mergeStyles('text-blue w-6 h-6', icon.props.className),
          })}

        <span className="text-sm text-white">{label}</span>

        {children}
      </div>

      <Separator className="mt-2.5" />
    </div>
  )
}
type TBodyProps = ComponentProps<'div'>

const Body = ({ className, children, ...props }: TBodyProps) => {
  return (
    <div className={StyleHelper.mergeStyles('mt-2 flex flex-col', className)} {...props}>
      {children}
    </div>
  )
}

type TPanelProps = { label?: string } & ComponentProps<'div'>

const Panel = ({ className, children, label, ...props }: TPanelProps) => {
  return (
    <div className={StyleHelper.mergeStyles('flex flex-col', className)} {...props}>
      {label && <div className="text-blue bg-gray-300/15 px-3.5 py-1.5 text-xs">{label}</div>}

      {children}
    </div>
  )
}

type TItemProps = {
  label?: ReactNode
  copyable?: string
  contentClassName?: string
  rightElement?: ReactNode
} & ComponentProps<'div'>

const Item = ({ label, children, copyable, className, contentClassName, rightElement, ...props }: TItemProps) => {
  const handleCopy = () => {
    if (copyable) UtilsHelper.copyToClipboard(copyable)
  }

  return (
    <div className="group flex flex-col">
      <div className={StyleHelper.mergeStyles('flex flex-col gap-2.5 px-3 py-4', className)} {...props}>
        {label && (
          <div className="flex justify-between">
            {typeof label === 'string' ? <p className="text-xs text-gray-100 uppercase">{label}</p> : label}

            {typeof rightElement === 'string' ? (
              <p className="text-xs text-gray-100 uppercase">{rightElement}</p>
            ) : (
              rightElement
            )}
          </div>
        )}

        <div className={StyleHelper.mergeStyles('flex items-center gap-2.5', contentClassName)}>
          {typeof children === 'string' ? <p className="text-sm break-all text-white">{children}</p> : children}

          {copyable && (
            <IconButton
              icon={<MdContentCopy aria-hidden={true} className="text-neon" />}
              size="sm"
              onClick={handleCopy}
            />
          )}
        </div>
      </div>

      <Separator className="group-last:hidden" />
    </div>
  )
}

type TTokenProps = {
  blockchain?: TBlockchainServiceKey
  symbol: string
  amount?: string
} & ComponentProps<'div'>

const Token = ({ amount, blockchain, symbol, className, ...props }: TTokenProps) => {
  const { t: commonT } = useTranslation('common')

  return (
    <div className={StyleHelper.mergeStyles('flex w-full items-center gap-2.5', className)} {...props}>
      {blockchain && <BlockchainIcon blockchain={blockchain} />}
      <span className="uppercase">
        {symbol}
        {blockchain && <span className="text-gray-100"> | {commonT(`blockchain.${blockchain}`)}</span>}
      </span>

      {amount && <span className="flex-grow text-end">{amount}</span>}
    </div>
  )
}

export const Details = { Root, Header, Body, Panel, Item, Token }
