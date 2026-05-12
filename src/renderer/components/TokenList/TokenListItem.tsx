import { useMemo } from 'react'

import { BSBigHumanAmount } from '@cityofzion/blockchain-service'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

import { IconButton } from '@renderer/components/IconButton'
import { ImageWithFallback } from '@renderer/components/ImageWithFallback'
import { Tooltip } from '@renderer/components/Tooltip'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { ConstantsHelper } from '@renderer/helpers/ConstantsHelper'
import { CurrencyHelper } from '@renderer/helpers/CurrencyHelper'
import { StyleHelper } from '@renderer/helpers/StyleHelper'
import { TokenHelper } from '@renderer/helpers/TokenHelper'

import { useAppDispatch } from '@renderer/hooks/useRedux'
import { useCurrencySelector } from '@renderer/hooks/useSettingsSelector'
import { useHiddenTokensByBlockchainSelector } from '@renderer/hooks/useUtilitySelector'

import TbEye from '@renderer/assets/images/tb-eye.svg?react'
import TbEyeOff from '@renderer/assets/images/tb-eye-off.svg?react'

import { utilityReducerActions } from '@renderer/store/reducers/utility'
import type { TTokenBalance } from '@shared/types/query'

type TProps = {
  tokenBalance: TTokenBalance
  isEditMode: boolean
}

export const TokenListItem = ({ tokenBalance, isEditMode }: TProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'tokenList' })
  const { t: tCommon } = useTranslation('common')
  const { currency } = useCurrencySelector()
  const { hiddenTokensByBlockchain } = useHiddenTokensByBlockchainSelector()
  const dispatch = useAppDispatch()

  const tokenHash = tokenBalance?.token?.hash
  const blockchain = tokenBalance?.blockchain

  const isHiddenToken = useMemo(() => {
    if (!tokenHash) return false

    const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]

    if (!service) return false

    const normalizedTokenHash = service.tokenService.normalizeHash(tokenHash)
    const hiddenTokens = hiddenTokensByBlockchain?.[blockchain] || []

    return hiddenTokens.some(token => service.tokenService.predicateByHash(token, normalizedTokenHash))
  }, [blockchain, hiddenTokensByBlockchain, tokenHash])

  const isHideTokenDisabled = !tokenHash || !blockchain || TokenHelper.isNativeToken(tokenHash, blockchain)

  const toggleHiddenToken = () => {
    if (!blockchain) return

    dispatch(utilityReducerActions.toggleHiddenToken({ tokenHash, blockchain }))
  }

  return (
    <div
      className={StyleHelper.mergeStyles('my-1.5 flex w-full rounded-md px-3 py-1.5 transition-colors', {
        'bg-gray-300/15': isHiddenToken,
      })}
    >
      <div className={StyleHelper.mergeStyles('flex flex-1 flex-row items-center gap-x-3')}>
        <div className="flex min-w-0 flex-1 gap-2.5">
          <ImageWithFallback
            src={`${ConstantsHelper.neonIconsUrl}/tokens/${tokenBalance.blockchain}/${tokenBalance.token.hash}.png`}
            alt={tokenBalance.token.name || tokenBalance.token.symbol}
            fallbackSrc={`${ConstantsHelper.neonIconsUrl}/tokens/default-token.png`}
            containerClassName={StyleHelper.mergeStyles('mt-0.5 size-4.5 min-size-4.5 max-size-4.5', {
              grayscale: isHiddenToken,
            })}
            className="rounded-full"
          />

          <div className="flex min-w-0 flex-col gap-0.5">
            <Tooltip title={tokenBalance.token.symbol}>
              <p
                className={StyleHelper.mergeStyles(
                  'w-fit max-w-28 min-w-0 truncate text-sm leading-5 text-white uppercase',
                  {
                    'text-gray-100': isHiddenToken,
                  }
                )}
              >
                {tokenBalance.token.symbol}
              </p>
            </Tooltip>

            <p className="truncate text-xs leading-4 text-gray-100 uppercase">
              {tCommon(`blockchain.${tokenBalance.blockchain}`)}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-0.5">
          <p className="text-1xs leading-5 text-gray-300">{t('holdingsLabel')}</p>

          <p className="text-1xs leading-4 text-gray-300">{t('valueLabel')}</p>
        </div>

        <div className="flex w-26 flex-col gap-0.5">
          <p
            className={StyleHelper.mergeStyles('truncate text-right text-sm leading-5 text-white', {
              'text-gray-100': isHiddenToken,
            })}
          >
            {new BSBigHumanAmount(tokenBalance.amountNumber, tokenBalance.token.decimals).toFormatted()}
          </p>

          <p
            className={StyleHelper.mergeStyles('text-blue truncate text-right text-xs leading-4', {
              'text-gray-100': isHiddenToken,
            })}
          >
            {CurrencyHelper.format(tokenBalance.exchangeAmount, { currency })}
          </p>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isEditMode && (
          <motion.div
            className="flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0, scale: 0, width: 0 }}
            exit={{ opacity: 0, scale: 0, width: 0 }}
            animate={{ opacity: 1, scale: 1, width: 'auto' }}
          >
            <Tooltip
              title={match({ isHideTokenDisabled, isHiddenToken })
                .with({ isHideTokenDisabled: true }, () => '')
                .with({ isHiddenToken: true }, () => t('showTokenButtonLabel'))
                .otherwise(() => t('hideTokenButtonLabel'))}
              delayDuration={0}
            >
              <IconButton
                className="ml-3"
                aria-label={isHiddenToken ? t('showTokenButtonLabel') : t('hideTokenButtonLabel')}
                colorSchema={isHiddenToken ? 'neon' : 'error'}
                size="sm"
                disabled={isHideTokenDisabled}
                icon={isHiddenToken ? <TbEye aria-hidden /> : <TbEyeOff aria-hidden />}
                onClick={toggleHiddenToken}
              />
            </Tooltip>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
