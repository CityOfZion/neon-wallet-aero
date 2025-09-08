import { Fragment } from 'react/jsx-runtime'
import { useTranslation } from 'react-i18next'

import { StringHelper } from '@/helpers/StringHelper'
import { StyleHelper } from '@/helpers/StyleHelper'
import { useModalNavigate } from '@/hooks/useModalRouter'
import { TContactState } from '@/types/store'

import { Button } from '../Button'
import { Separator } from '../Separator'

type TProps = {
  groupedContacts: [string, TContactState[]][]
}

export const ContactsList = ({ groupedContacts }: TProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'contactsList' })
  const { modalNavigateWrapper } = useModalNavigate()

  if (!groupedContacts.length) {
    return (
      <div className="flex flex-grow items-center justify-center">
        <p className="text-gray-400">{t('noContactAddresses')}</p>
      </div>
    )
  }

  return (
    <ul className="flex min-h-0 w-full flex-grow basis-0 flex-col gap-y-5 overflow-y-auto text-xs">
      {groupedContacts.map(([letter, letterContacts]) => (
        <li key={letter}>
          <div className="bg-asphalt/50 text-blue flex h-6 items-center pl-4 font-bold">{letter}</div>
          {letterContacts.map((contact, index) => {
            return (
              <Fragment key={`contact-list-${contact.id}`}>
                <Button
                  variant="text"
                  colorSchema="white"
                  onClick={modalNavigateWrapper('contact-details', {
                    state: {
                      contact,
                    },
                  })}
                  className={StyleHelper.mergeStyles(
                    'hover:border-neon flex h-12 w-full items-center justify-between border-l-4 border-transparent py-4 pl-0'
                  )}
                >
                  <div className="flex w-full items-center">
                    <p
                      className={StyleHelper.mergeStyles(
                        'flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-300/30 text-xs text-gray-100'
                      )}
                    >
                      {StringHelper.getInitials(contact.name)}
                    </p>

                    <p className="truncate pl-2" title={contact.name}>
                      {contact.name}
                    </p>
                  </div>
                </Button>

                {index !== letterContacts.length - 1 && <Separator containerClassName="pl-11" />}
              </Fragment>
            )
          })}
        </li>
      ))}
    </ul>
  )
}
