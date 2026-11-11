import { useMemo } from 'react'

import type { TBSToken } from '@cityofzion/blockchain-service'
import type { TBSStellarName, TTrustlineServiceStellarGetTrustlinesResponse } from '@cityofzion/bs-stellar'

import { Button } from '@renderer/components/Button'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'

import { useSelectedNetworkByBlockchainSelector } from '@renderer/hooks/useSettingsSelector'

import TbShieldCheck from '@renderer/assets/images/tb-shield-check.svg?react'

import { ConstantsHelper } from '@shared/helpers/ConstantsHelper'
import type { TAccount } from '@shared/types/store'

type TProps = {
  stellarAccount: TAccount<TBSStellarName>
  trustlines?: TTrustlineServiceStellarGetTrustlinesResponse[]
  onAddToken: (token: TBSToken) => void
}

export const StellarTrustlinesRecommendedButtons = ({ stellarAccount, trustlines, onAddToken }: TProps) => {
  const {
    selectedNetworkByBlockchain: { stellar: stellarNetwork },
  } = useSelectedNetworkByBlockchainSelector()

  const missingTokens = useMemo(() => {
    const recommendedTokens = ConstantsHelper.stellarRecommendedTrustlineTokensByNetworkType[stellarNetwork.type]
    if (!recommendedTokens || !trustlines) return []

    const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName.stellar

    return recommendedTokens.filter(
      recommendedToken =>
        !trustlines.some(trustline => service.tokenService.predicateByHash(trustline.token, recommendedToken))
    )
  }, [stellarNetwork.type, trustlines])

  if (missingTokens.length === 0) return null

  const isWatchAccount = stellarAccount.type === 'watch'

  return (
    <div className="mb-4 flex w-full gap-2">
      {missingTokens.map(token => (
        <Button
          key={`recommended-trustline-${token.hash}`}
          label={token.symbol}
          variant="outlined"
          className="flex-1"
          flat
          iconsOnEdge={false}
          disabled={isWatchAccount}
          leftIcon={<TbShieldCheck aria-hidden />}
          onClick={() => onAddToken(token)}
        />
      ))}
    </div>
  )
}
