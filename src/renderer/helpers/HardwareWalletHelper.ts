import { BSKeychainHelper, hasLedger, type TBSAccount } from '@cityofzion/blockchain-service'
import type Transport from '@ledgerhq/hw-transport'
import TransportWebBluetooth from '@ledgerhq/hw-transport-web-ble'
import TransportWebHID from '@ledgerhq/hw-transport-webhid'
import cloneDeep from 'lodash/cloneDeep'

import { getBluetoothServiceUuids, ledgerUSBVendorId } from '@ledgerhq/devices/lib-es/index'
import { bsAggregator } from '@renderer/libs/blockchain-service'
import { getI18next } from '@renderer/libs/i18next'
import { rendererApi } from '@shared/message-api/renderer'
import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import type {
  THardwareWalletHelperConnectionType,
  THardwareWalletHelperConnectParams,
  THardwareWalletHelperEnsureConnectionParams,
  THardwareWalletHelperGetAccountParams,
} from '@shared/types/helpers'

import { AppError } from './ErrorHelper'

const { t } = getI18next()

export class HardwareWalletHelper {
  static onDisconnect: (() => void | Promise<void>) | undefined
  static transport?: Transport

  private static openTransportFnByType: Record<
    THardwareWalletHelperConnectionType,
    (device: any) => Promise<Transport>
  > = {
    usb: TransportWebHID.open.bind(TransportWebHID),
    bluetooth: TransportWebBluetooth.open.bind(TransportWebBluetooth),
  }

  private static async requestHidDevice() {
    if (!navigator.hid) {
      throw new AppError(t('hardwareWallet.errors.hidNotSupported'))
    }

    const devices = await navigator.hid
      .requestDevice({
        filters: [{ vendorId: ledgerUSBVendorId }],
      })
      .catch(() => {
        throw new AppError(t('hardwareWallet.errors.userCancelled'))
      })

    const device = devices[0]
    if (!device) {
      throw new AppError(t('hardwareWallet.errors.hardwareWalletNotFound'))
    }

    return device
  }

  private static async requestBluetoothDevice() {
    if (!navigator.bluetooth) {
      throw new AppError(t('hardwareWallet.errors.bluetoothNotSupported'))
    }

    const device = await navigator.bluetooth
      .requestDevice({
        filters: getBluetoothServiceUuids().map(uuid => ({
          services: [uuid],
        })),
      })
      .catch(() => {
        throw new AppError(t('hardwareWallet.errors.userCancelled'))
      })

    return device
  }

  private static async getGrantedHidDevices() {
    if (!navigator.hid) {
      throw new AppError(t('hardwareWallet.errors.hidNotSupported'))
    }

    const devices = await navigator.hid.getDevices()
    return devices.filter(device => device.vendorId === ledgerUSBVendorId)
  }

  private static async getGrantedBluetoothDevice() {
    // Web Bluetooth Api does not support getDevices yet
    const device = await this.requestBluetoothDevice()
    return [device]
  }

  private static setTransport(transport: Transport) {
    this.transport = transport

    transport.on('disconnect', HardwareWalletHelper.disconnect)
  }

  static async connect({ lastIndexesByWallet, type }: THardwareWalletHelperConnectParams) {
    if (this.transport) {
      throw new AppError(t('hardwareWallet.errors.disconnectFirst'))
    }

    const requestDeviceFnByType: Record<THardwareWalletHelperConnectionType, () => Promise<any>> = {
      usb: this.requestHidDevice.bind(this),
      bluetooth: this.requestBluetoothDevice.bind(this),
    }

    const device = await requestDeviceFnByType[type]()

    const openTransportFn = this.openTransportFnByType[type]

    const transport = await openTransportFn(device).catch(() => {
      throw new AppError(t('hardwareWallet.errors.hardwareWalletNotFound'))
    })

    const services = Object.values(bsAggregator.blockchainServicesByName)

    const accounts: TBSAccount<TBlockchainServiceKey>[] = []

    for (const service of services) {
      try {
        if (!hasLedger(service)) continue

        const hardwareAccounts = await service.ledgerService.getAccounts(transport, lastIndexesByWallet)

        accounts.push(...hardwareAccounts)
      } catch {
        /* empty */
      }
    }

    if (accounts.length === 0) {
      transport.close()
      throw new AppError(t('hardwareWallet.errors.accountsNotFound'))
    }

    await rendererApi.send('hardware-wallet:save-type', type)

    this.setTransport(transport)

    return cloneDeep(accounts)
  }

  static async disconnect() {
    if (this.transport) {
      this.transport.off('disconnect', HardwareWalletHelper.disconnect)
      await this.transport.close()
    }

    await rendererApi.send('hardware-wallet:save-type', undefined)

    this.transport = undefined

    await this.onDisconnect?.()
  }

  static async getAccount({ blockchain, index }: THardwareWalletHelperGetAccountParams) {
    if (!this.transport) {
      throw new AppError(t('hardwareWallet.errors.hardwareWalletNotFound'))
    }

    const service = bsAggregator.blockchainServicesByName[blockchain]
    if (!hasLedger(service)) {
      throw new AppError(t('hardwareWallet.errors.blockchainNotSupported', { blockchain }))
    }

    const account = await service.ledgerService.getAccount(this.transport, index)

    return cloneDeep(account)
  }

  static async ensureConnection({
    address,
    blockchain,
    bip44Path,
  }: THardwareWalletHelperEnsureConnectionParams): Promise<Transport> {
    if (!bip44Path) throw new AppError(t('hardwareWallet.errors.missingBip44Path'))

    const service = bsAggregator.blockchainServicesByName[blockchain]
    if (!hasLedger(service))
      throw new AppError(t('hardwareWallet.errors.blockchainNotSupported', { blockchain: blockchain }))

    const index = BSKeychainHelper.extractIndexFromPath(bip44Path)

    if (this.transport) {
      const hardwareAccount = await service.ledgerService.getAccount(this.transport, index)
      if (hardwareAccount.address !== address) {
        throw new AppError(t('hardwareWallet.errors.accountIsNotHardware'))
      }

      return this.transport
    }

    const type = await rendererApi.send('hardware-wallet:get-type')
    if (!type) {
      throw new AppError(t('hardwareWallet.errors.hardwareWalletNotFound'))
    }

    const getGrantedDeviceFnByType: Record<THardwareWalletHelperConnectionType, () => Promise<any[]>> = {
      usb: this.getGrantedHidDevices.bind(this),
      bluetooth: this.getGrantedBluetoothDevice.bind(this),
    }

    const devices = await getGrantedDeviceFnByType[type]()

    for (const device of devices) {
      try {
        const openTransportFn = this.openTransportFnByType[type]

        const transport = await openTransportFn(device)

        const hardwareAccount = await service.ledgerService.getAccount(transport, index)

        if (hardwareAccount.address === address) {
          this.setTransport(transport)

          return transport
        }
      } catch {
        /* empty */
      }
    }

    throw new AppError(t('hardwareWallet.errors.hardwareWalletNotFound'))
  }
}
