import { useTranslation } from 'react-i18next'

import { IconButton } from '@renderer/components/IconButton'
import { Radio } from '@renderer/components/Radio'

import { CurrencyHelper } from '@renderer/helpers/CurrencyHelper'

import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { useAppDispatch } from '@renderer/hooks/useRedux'
import { useCurrencySelector } from '@renderer/hooks/useSettingsSelector'

import { ScreenLayout } from '@renderer/layouts/ScreenLayout'

import TbMenu2 from '@renderer/assets/images/tb-menu-2.svg?react'

import { settingsReducerActions } from '@renderer/store/reducers/settings'
import type { TAvailableCurrency } from '@shared/types/store'

export const CurrencyPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'currency' })
  const { t: tCommonGeneral } = useTranslation('common', { keyPrefix: 'general' })
  const { modalNavigateWrapper } = useModalNavigate()
  const { currency } = useCurrencySelector()
  const dispatch = useAppDispatch()

  const handleChangeCurrency = (currencyLabel: TAvailableCurrency) => {
    const nextCurrency = CurrencyHelper.availableCurrencies.find(({ label }) => label === currencyLabel)!

    dispatch(settingsReducerActions.setCurrency(nextCurrency))
  }

  return (
    <ScreenLayout
      heading={t('title')}
      className="bg-asphalt text-white"
      rightComponent={
        <IconButton
          aria-label={tCommonGeneral('menu')}
          icon={<TbMenu2 aria-hidden />}
          onClick={modalNavigateWrapper('menu')}
        />
      }
    >
      <Radio.Group className="flex flex-col" required value={currency.label} onValueChange={handleChangeCurrency}>
        {CurrencyHelper.availableCurrencies.map(({ label, symbol }, index) => (
          <Radio.Item key={`${label}-${symbol}-${index}`} className="h-14 rounded" value={label}>
            <span className="grow truncate text-left text-sm">
              <strong className="font-bold">{symbol} -</strong> <span className="text-gray-100">{label}</span>
            </span>

            <Radio.Indicator />
          </Radio.Item>
        ))}
      </Radio.Group>
    </ScreenLayout>
  )
}

export default CurrencyPage
