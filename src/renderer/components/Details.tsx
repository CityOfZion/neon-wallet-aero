import { cloneElement } from 'react'

import type { ComponentProps, JSX, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { ClipboardHelper } from '@renderer/helpers/ClipboardHelper'
import { ElementHelper } from '@renderer/helpers/ElementHelper'
import { StyleHelper } from '@renderer/helpers/StyleHelper'

import MdContentCopy from '@renderer/assets/images/md-content-copy.svg?react'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'

import { BlockchainIcon } from './BlockchainIcon'
import { IconButton } from './IconButton'
import { Separator } from './Separator'
import { Tooltip } from './Tooltip'

type TRootProps = ComponentProps<'div'>

const Root = ({ className, children, ...props }: TRootProps) => {
  return (
    <div
      className={StyleHelper.mergeStyles('bg-asphalt flex w-full flex-col rounded px-4 py-2.5 text-sm', className)}
      {...props}
    >
      {children}
    </div>
  )
}

type THeaderProps = {
  rightElement?: JSX.Element
  leftElement?: JSX.Element
} & ComponentProps<'div'>

const Header = ({ leftElement, rightElement, children, className, ...props }: THeaderProps) => {
  return (
    <div className={StyleHelper.mergeStyles('flex items-center gap-2.5', className)} {...props}>
      {leftElement &&
        cloneElement(leftElement, {
          'aria-hidden': true,
          className: StyleHelper.mergeStyles('text-blue size-6', leftElement.props.className),
        })}

      <div className="flex-grow">
        {ElementHelper.isTextContentValid(children) ? <span className="text-sm text-white">{children}</span> : children}
      </div>

      {rightElement}
    </div>
  )
}
type TBodyProps = ComponentProps<'div'>

const Body = ({ className, children, ...props }: TBodyProps) => {
  return (
    <div className={StyleHelper.mergeStyles('flex flex-col', className)} {...props}>
      {children}
    </div>
  )
}

type THeaderSeparatorProps = ComponentProps<typeof Separator>

const HeaderSeparator = ({ className, ...props }: THeaderSeparatorProps) => {
  return <Separator className={StyleHelper.mergeStyles('mt-2.5', className)} {...props} />
}

type TPanelProps = { label?: string } & ComponentProps<'div'>

const Panel = ({ className, children, label, ...props }: TPanelProps) => {
  return (
    <div className={StyleHelper.mergeStyles('flex flex-col', className)} {...props}>
      {label && <div className="text-blue bg-gray-300/15 px-3.5 py-1.5">{label}</div>}

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
  const { t } = useTranslation('common')

  const handleCopy = () => {
    if (copyable) ClipboardHelper.write(copyable)
  }

  return (
    <div className="group flex flex-col">
      <div className={StyleHelper.mergeStyles('flex flex-col gap-2.5 py-4', className)} {...props}>
        {label && (
          <div className="flex justify-between">
            {ElementHelper.isTextContentValid(label) ? (
              <p className="text-xs text-gray-100 uppercase">{label}</p>
            ) : (
              label
            )}

            {ElementHelper.isTextContentValid(rightElement) ? (
              <p className="text-gray-100 uppercase">{rightElement}</p>
            ) : (
              rightElement
            )}
          </div>
        )}

        <div className={StyleHelper.mergeStyles('flex items-center justify-between gap-2.5', contentClassName)}>
          {ElementHelper.isTextContentValid(children) ? (
            <p className="text-sm break-all text-white">{children}</p>
          ) : (
            children
          )}

          {copyable && (
            <Tooltip title={t('general.copyToClipboard')}>
              <IconButton
                aria-label={t('general.copyToClipboard')}
                icon={<MdContentCopy aria-hidden className="text-neon" />}
                size="xs"
                onClick={handleCopy}
              />
            </Tooltip>
          )}
        </div>
      </div>

      <Separator containerClassName="group-last:hidden" />
    </div>
  )
}

type TTokenProps = {
  blockchain?: TBlockchainServiceKey
  symbol: string
  amount?: string
} & ComponentProps<'div'>

const Token = ({ amount, blockchain, symbol, className, ...props }: TTokenProps) => {
  const { t: tCommon } = useTranslation('common')

  return (
    <div className={StyleHelper.mergeStyles('flex w-full items-center gap-2.5', className)} {...props}>
      {blockchain && <BlockchainIcon blockchain={blockchain} />}

      <span className="uppercase">
        {symbol}
        {blockchain && <span className="text-gray-100">{` | ${tCommon(`blockchain.${blockchain}`)}`}</span>}
      </span>

      {amount && <span className="grow text-end">{amount}</span>}
    </div>
  )
}

export const Details = { Root, Header, Body, Panel, Item, HeaderSeparator, Token }
