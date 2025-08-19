import { cloneElement, ComponentProps, JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/Button'
import { StyleHelper } from '@/helpers/StyleHelper'
import { SettingsLayout } from '@/layouts/Settings'

import MdLooks3 from '@/assets/images/md-looks-3.svg?react'
import MdLooks4 from '@/assets/images/md-looks-4.svg?react'
import MdLooksOne from '@/assets/images/md-looks-one.svg?react'
import MdLooksTwo from '@/assets/images/md-looks-two.svg?react'

type TStepProps = {
  icon: JSX.Element
  colorSchema?: 'green' | 'blue'
  label: string
} & ComponentProps<'div'>

const Step = ({ icon, colorSchema, label, className, ...props }: TStepProps) => {
  return (
    <div
      {...props}
      className={StyleHelper.mergeStyles(
        'flex items-center gap-2.5 rounded border-l-3 border-transparent px-3.5 py-2.5 aria-selected:rounded-l-none',
        {
          'text-green aria-selected:border-green bg-green-700': colorSchema === 'green',
          'bg-blue/10 text-blue aria-selected:border-blue': colorSchema === 'blue',
        },
        className
      )}
    >
      {cloneElement(icon, { className: 'w-6 h-6' })}
      <span className="text-sm text-white">{label}</span>
    </div>
  )
}

export const MigrateFromNeon2 = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'settings.migrateFromNeon2' })
  const navigate = useNavigate()

  return (
    <SettingsLayout title={t('title')}>
      <div className="flex flex-grow flex-col">
        <p className="text-xs text-gray-100">{t('descriptionWhy')}</p>
        <h2 className="mt-8 text-xs font-bold text-gray-100 uppercase">{t('subtitleHow')}</h2>

        <div className="mt-5 w-full">
          <span className="text-neon mb-1 block text-sm font-light">{t('migrateSteps.inNeon2.label')}</span>

          <Step
            icon={<MdLooksOne aria-hidden={true} />}
            colorSchema="green"
            label={t('migrateSteps.inNeon2.step1')}
            aria-hidden
          />

          <span className="text-blue mt-5 mb-1 block text-sm font-light">{t('migrateSteps.inNeon3.label')}</span>

          <Step
            icon={<MdLooksTwo aria-hidden />}
            colorSchema="blue"
            label={t('migrateSteps.inNeon3.step2')}
            className="rounded-b-none"
            aria-hidden
          />
          <Step
            icon={<MdLooks3 aria-hidden />}
            colorSchema="blue"
            label={t('migrateSteps.inNeon3.step3')}
            className="rounded-none"
            aria-hidden
          />
          <Step
            icon={<MdLooks4 aria-hidden />}
            colorSchema="blue"
            label={t('migrateSteps.inNeon3.step4')}
            className="rounded-t-none"
            aria-hidden
          />
        </div>
      </div>

      <Button variant="card" onClick={() => navigate('2')}>
        {t('importButtonLabel')}
      </Button>
    </SettingsLayout>
  )
}
