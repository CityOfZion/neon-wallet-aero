import { useTranslation } from 'react-i18next'

import { Link } from '@renderer/components/Link'

import { SettingsLayout } from '@renderer/layouts/SettingsLayout'

import TbExternalLink from '@renderer/assets/images/tb-external-link.svg?react'

export const ReleaseNotesPage = () => {
  const { t } = useTranslation('changelog')
  const { t: tSettings } = useTranslation('pages', { keyPrefix: 'settings.releaseNotes' })
  const releaseNotes = t('notes', { returnObjects: true })

  return (
    <SettingsLayout title={tSettings('title')}>
      <ul className="flex flex-col gap-6 px-4">
        {releaseNotes.map(note => (
          <li key={note.version} className="border-b-1 border-b-gray-300/15 pb-3 last:border-0">
            <ul className="list-inside list-disc pb-4">
              <p className="mb-1 block text-xs text-gray-300">{note.date}</p>
              <h2 className="mb-2 block text-xl text-white">{t('versionLabel', { version: note.version })}</h2>
              {note.changes.map((change, changeIndex) => (
                <li key={`change-${changeIndex}`} className="text-sm text-gray-100">
                  {change}
                </li>
              ))}

              {note.url && (
                <Link
                  target="_blank"
                  to={note.url}
                  label={tSettings('learnMoreButtonLabel')}
                  rightIcon={<TbExternalLink aria-hidden />}
                  variant="outlined"
                  iconsOnEdge={false}
                  clickableProps={{ className: 'w-fit mt-4' }}
                />
              )}
            </ul>
          </li>
        ))}
      </ul>
    </SettingsLayout>
  )
}
