import type { TSession } from '@cityofzion/wallet-connect-sdk-wallet-react'
import { useWalletConnectWallet } from '@cityofzion/wallet-connect-sdk-wallet-react'
import { useTranslation } from 'react-i18next'

import { AccountHelper } from '@renderer/helpers/AccountHelper'
import { WalletConnectHelper } from '@renderer/helpers/WalletConnectHelper'

import { useModalNavigate } from '@renderer/hooks/useModalRouter'

import TbPlug from '@renderer/assets/images/tb-plug.svg?react'
import TbPlugX from '@renderer/assets/images/tb-plug-x.svg?react'

import type { IAccountState } from '@shared/types/store'

import { Button } from '../Button'
import { DappConnectionItem } from './DappConnectionItem'
import { DappConnectionListEmpty } from './DappConnectionListEmpty'

type TProps = {
  selectedAccount: IAccountState
}

export const DappConnectionList = ({ selectedAccount }: TProps) => {
  const { sessions } = useWalletConnectWallet()
  const { modalNavigate } = useModalNavigate()
  const { t } = useTranslation('components', { keyPrefix: 'dappConnectionList' })

  const filteredSessions = sessions.filter(session => {
    const { address, blockchain } = WalletConnectHelper.getAccountInformationFromSession(session)
    return AccountHelper.predicate(selectedAccount)({ address, blockchain }) && selectedAccount.type !== 'watch'
  })

  const handleConnectDapp = () => {
    modalNavigate('dapp-connection', { state: { account: selectedAccount } })
  }

  const handleDisconnectAll = async () => {
    modalNavigate('dapp-disconnection', { state: { sessions: filteredSessions } })
  }

  const handleDisconnect = async (session: TSession) => {
    modalNavigate('dapp-disconnection', { state: { sessions: [session] } })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Button
          iconsOnEdge={false}
          leftIcon={<TbPlug aria-hidden />}
          label={t('connectNewDappButtonLabel')}
          variant="card"
          className="w-full"
          onClick={handleConnectDapp}
        />

        {filteredSessions.length > 0 && (
          <Button
            iconsOnEdge={false}
            leftIcon={<TbPlugX aria-hidden />}
            label={t('disconnectionAllButtonLabel')}
            variant="card"
            colorSchema="error"
            onClick={handleDisconnectAll}
          />
        )}
      </div>

      {filteredSessions.length <= 0 ? (
        <DappConnectionListEmpty />
      ) : (
        <ul className="flex min-w-0 flex-col gap-1">
          {filteredSessions.map(session => {
            return (
              <DappConnectionItem
                key={session.topic}
                session={session}
                onDisconnect={() => handleDisconnect(session)}
              />
            )
          })}
        </ul>
      )}
    </div>
  )
}
