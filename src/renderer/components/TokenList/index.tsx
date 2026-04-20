import { useRef, useState } from 'react'

import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

import { IconButton } from '@renderer/components/IconButton'
import { Switch } from '@renderer/components/Switch'
import { Tooltip } from '@renderer/components/Tooltip'

import { useBalance } from '@renderer/hooks/useBalances'
import { useVirtualization } from '@renderer/hooks/useVirtualization'

import TbEyeOff from '@renderer/assets/images/tb-eye-off.svg?react'
import TbPencil from '@renderer/assets/images/tb-pencil.svg?react'

import type { TAccount } from '@shared/types/store'

import { Separator } from '../Separator'
import { TokenListEmpty } from './TokenListEmpty'
import { TokenListItem } from './TokenListItem'
import { TokenListSkeleton } from './TokenListSkeleton'

type TProps = {
  selectedAccount: TAccount
  showHiddenTokens: boolean
  onToggleShowHiddenTokens: (nextShowHiddenTokens: boolean) => void
}

export const TokenList = ({ selectedAccount, showHiddenTokens, onToggleShowHiddenTokens }: TProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'tokenList' })

  const { isLoading, data: balance } = useBalance(selectedAccount, { showType: showHiddenTokens ? 'all' : 'active' })

  const [isEditMode, setIsEditMode] = useState(false)

  const contentRef = useRef<HTMLUListElement>(null)

  const tokenBalances = balance?.tokensBalances || []
  const isActionsDisabled = isLoading || tokenBalances.length === 0

  const { virtualizer, ready } = useVirtualization({
    contentRef,
    count: tokenBalances.length,
    estimateSize: () => 62,
    overscan: 5,
  })

  const handleToggleIsEditMode = () => {
    setIsEditMode(previousIsEditMode => !previousIsEditMode)
  }

  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center justify-between">
        <div className="flex h-12 max-h-12 min-h-12 items-center rounded-full bg-gray-300/15 px-4">
          <TbEyeOff aria-hidden className="text-blue mr-3 size-5.5" />

          <Switch
            label={t('showHiddenTokensLabel')}
            labelClassName="text-sm text-gray-200"
            className="flex-row-reverse gap-x-7"
            name="show-hidden-tokens"
            disabled={isActionsDisabled}
            checked={showHiddenTokens}
            id="show-hidden-tokens"
            onCheckedChange={onToggleShowHiddenTokens}
          />
        </div>

        <Tooltip
          title={match({ isActionsDisabled, isEditMode })
            .with({ isActionsDisabled: true }, () => '')
            .with({ isEditMode: true }, () => t('disableEditModeButtonLabel'))
            .otherwise(() => t('enableEditModeButtonLabel'))}
          delayDuration={0}
        >
          <IconButton
            aria-label={isEditMode ? t('disableEditModeButtonLabel') : t('enableEditModeButtonLabel')}
            aria-selected={isEditMode}
            variant="contained"
            colorSchema={isEditMode ? 'solid-gray' : 'neon'}
            size="md"
            disabled={isActionsDisabled}
            icon={<TbPencil aria-hidden />}
            onClick={handleToggleIsEditMode}
          />
        </Tooltip>
      </div>

      <TokenListSkeleton isLoading={isLoading}>
        {tokenBalances.length === 0 ? (
          <TokenListEmpty />
        ) : (
          <ul className="mt-6 flex min-w-0 flex-col gap-1" ref={contentRef}>
            <AnimatePresence>
              {ready &&
                virtualizer.getVirtualItems().map(virtualItem => {
                  const tokenBalance = tokenBalances[virtualItem.index]

                  return (
                    <motion.li
                      key={`${tokenBalance?.token?.hash}-${tokenBalance?.blockchain}`}
                      className="group/item"
                      initial={{ opacity: 0, y: virtualItem.start - 30 }}
                      animate={{ opacity: 1, y: virtualItem.start }}
                      exit={{ opacity: 0 }}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualItem.size}px`,
                      }}
                    >
                      <TokenListItem tokenBalance={tokenBalance} isEditMode={isEditMode} />

                      <Separator containerClassName="absolute bottom-0 w-full group-last/item:hidden" />
                    </motion.li>
                  )
                })}
            </AnimatePresence>
          </ul>
        )}
      </TokenListSkeleton>
    </div>
  )
}
