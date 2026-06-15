import { useTranslation } from 'react-i18next'

import { Radio } from '@renderer/components/Radio'

import { CurrencyHelper } from '@renderer/helpers/CurrencyHelper'

import { useAppDispatch } from '@renderer/hooks/useRedux'
import { useCurrencySelector } from '@renderer/hooks/useSettingsSelector'

import { SettingsLayout } from '@renderer/layouts/SettingsLayout'

import { settingsReducerActions } from '@renderer/store/reducers/settings'
import type { TAvailableCurrency } from '@shared/types/store'

export const CurrencyPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'currency' })
  const { currency } = useCurrencySelector()
  const dispatch = useAppDispatch()

  const handleChangeCurrency = (currencyLabel: TAvailableCurrency) => {
    const nextCurrency = CurrencyHelper.availableCurrencies.find(({ label }) => label === currencyLabel)!

    dispatch(settingsReducerActions.setCurrency(nextCurrency))
  }

  return (
    <SettingsLayout title={t('title')}>
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
    </SettingsLayout>
  )
}

export default CurrencyPage
