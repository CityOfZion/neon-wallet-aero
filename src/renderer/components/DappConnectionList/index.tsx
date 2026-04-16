import { Fragment } from 'react'

import type { SessionTypes } from '@walletconnect/types'
import { useTranslation } from 'react-i18next'
import { match, P } from 'ts-pattern'

import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { useWalletConnectSessionsByAccount } from '@renderer/hooks/useWalletConnectSessions'

import TbPlug from '@renderer/assets/images/tb-plug.svg?react'

import type { TAccount } from '@shared/types/store'

import { Button } from '../Button'
import { DappConnectionHeader } from './DappConnectionHeader'
import { DappConnectionItem } from './DappConnectionItem'
import { DappConnectionListEmpty } from './DappConnectionListEmpty'
import { DappConnectionListSkeleton } from './DappConnectionListSkeleton'

type TProps = {
  selectedAccount: TAccount
}

export const DappConnectionList = ({ selectedAccount }: TProps) => {
  const { modalNavigate } = useModalNavigate()
  const { t } = useTranslation('components', { keyPrefix: 'dappConnectionList' })

  const sessionsQuery = useWalletConnectSessionsByAccount(selectedAccount)

  const handleConnectDapp = () => {
    modalNavigate('dapp-connection', { state: { account: selectedAccount } })
  }

  const handleDisconnectAll = async () => {
    modalNavigate('dapp-disconnection', { state: { sessions: sessionsQuery.data! } })
  }

  const handleDisconnect = async (session: SessionTypes.Struct) => {
    modalNavigate('dapp-disconnection', { state: { sessions: [session] } })
  }

  return (
    <div className="flex flex-col">
      <Button
        iconsOnEdge={false}
        leftIcon={<TbPlug aria-hidden />}
        label={t('connectNewDappButtonLabel')}
        variant="card"
        className="w-full"
        onClick={handleConnectDapp}
      />

      {match(sessionsQuery)
        .with({ isLoading: true }, () => <DappConnectionListSkeleton />)
        .with({ data: P.when(value => !value?.length) }, () => <DappConnectionListEmpty />)
        .otherwise(() => (
          <Fragment>
            <DappConnectionHeader onDisconnectAll={handleDisconnectAll} />

            <ul className="flex min-w-0 flex-col gap-1">
              {sessionsQuery.data?.map(session => (
                <DappConnectionItem
                  key={session.topic}
                  session={session}
                  onDisconnect={() => handleDisconnect(session)}
                />
              ))}
            </ul>
          </Fragment>
        ))}
    </div>
  )
}
