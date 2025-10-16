import { ComponentProps, Fragment, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@renderer/components/Button'
import { Loader } from '@renderer/components/Loader'
import { Separator } from '@renderer/components/Separator'
import { Tabs } from '@renderer/components/Tabs'
import { StyleHelper } from '@renderer/helpers/StyleHelper'
import { BUY_AND_SELL_TOKENS_CONFIG } from '@shared/constants/buy-and-sell-tokens'
import { IAccountState } from '@shared/types/store'
import { AnimatePresence } from 'motion/react'

import { BuyAndSellTokensAccordionAccounts } from './BuyAndSellTokensAccordionAccounts'
import { EBuyAndSellTokensTab, TBuyAndSellTokensOnTabChange } from '.'

import MdRestartAlt from '@renderer/assets/images/md-restart-alt.svg?react'
import TbChevronDown from '@renderer/assets/images/tb-chevron-down.svg?react'
import TbChevronUp from '@renderer/assets/images/tb-chevron-up.svg?react'

type TProps = ComponentProps<'div'> & {
  isLoading: boolean
  account?: IAccountState
  tab: EBuyAndSellTokensTab
  onTabChange: TBuyAndSellTokensOnTabChange
  onRestart: () => void
  leftElement?: ReactNode
  children: ReactNode
}

export const BuyAndSellWrapperContent = ({
  isLoading,
  account,
  tab,
  onTabChange,
  onRestart,
  leftElement,
  children,
  ...props
}: TProps) => {
  const { t } = useTranslation('pages', { keyPrefix: 'buyAndSellTokens.wrapperContent' })

  const [isAccordionAccountsOpened, setIsAccordionAccountsOpened] = useState(false)

  const handleToggleAccordionAccounts = () => {
    setIsAccordionAccountsOpened(previousValue => !previousValue)
  }

  return (
    <div
      {...props}
      className={StyleHelper.mergeStyles(
        'relative h-auto min-h-fit w-full rounded-r bg-gray-300/20 p-4 pt-0',
        props.className
      )}
    >
      <div className="relative mb-4 flex h-14 items-center justify-between border-b border-gray-300/30">
        <div className="absolute left-0 flex w-fit items-center gap-x-4">
          <Button
            label={t('restartButtonLabel')}
            variant="text-slim"
            colorSchema={isLoading ? 'gray' : 'neon'}
            disabled={isLoading}
            leftIcon={<MdRestartAlt aria-hidden className="h-5 max-h-5 min-h-5 w-5 max-w-5 min-w-5" />}
            onClick={onRestart}
          />

          {leftElement && (
            <Fragment>
              <Separator className="h-7" containerClassName="w-px bg-gray-300/30" />

              {leftElement}
            </Fragment>
          )}
        </div>

        <Tabs.Root
          value={tab}
          className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          onValueChange={newTab => onTabChange(newTab as EBuyAndSellTokensTab)}
        >
          <Tabs.List className="gap-x-3">
            <Tabs.Trigger disabled={!BUY_AND_SELL_TOKENS_CONFIG.isConfigured} value={EBuyAndSellTokensTab.BUY_TOKENS}>
              {t('tabBuyTokensLabel')}
            </Tabs.Trigger>

            <Tabs.Trigger disabled={!BUY_AND_SELL_TOKENS_CONFIG.isConfigured} value={EBuyAndSellTokensTab.SELL_TOKENS}>
              {t('tabSellTokensLabel')}
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>

        <div className="absolute right-0 flex w-fit items-center">
          <Button
            label={t('walletsAndAccountsButtonLabel')}
            aria-label={t(
              isAccordionAccountsOpened ? 'walletsAndAccountsOpenedLabel' : 'walletsAndAccountsClosedLabel'
            )}
            aria-expanded={isAccordionAccountsOpened}
            aria-controls="buy-and-sell-tokens-accordion-accounts"
            variant="text-slim"
            colorSchema={isLoading ? 'gray' : 'neon'}
            className={StyleHelper.mergeStyles('w-fit rounded px-3 py-1.5 transition-colors', {
              'bg-gray-300/15': !isLoading && isAccordionAccountsOpened,
            })}
            disabled={isLoading}
            rightIcon={
              isAccordionAccountsOpened ? (
                <TbChevronUp aria-hidden className="size-5" />
              ) : (
                <TbChevronDown aria-hidden className="size-5" />
              )
            }
            onClick={handleToggleAccordionAccounts}
          />
        </div>
      </div>

      {BUY_AND_SELL_TOKENS_CONFIG.isConfigured ? (
        <Fragment>
          {isLoading && <Loader className="text-neon mt-4 size-14" />}

          <div className={StyleHelper.mergeStyles('flex min-h-0 w-full flex-grow', { hidden: isLoading })}>
            {children}
          </div>
        </Fragment>
      ) : (
        <h2 className="w-full pt-4 text-center text-xl">{t('notConfiguredLabel')}</h2>
      )}

      <AnimatePresence>
        {!isLoading && isAccordionAccountsOpened && <BuyAndSellTokensAccordionAccounts account={account} />}
      </AnimatePresence>
    </div>
  )
}
