import { QRCodeSVG } from 'qrcode.react'
import { useTranslation } from 'react-i18next'

import { Banner } from '@renderer/components/Banner'
import { Button } from '@renderer/components/Button'
import { Loader } from '@renderer/components/Loader'
import { Separator } from '@renderer/components/Separator'

import { EncryptionHelper } from '@renderer/helpers/EncryptionHelper'
import { StringHelper } from '@renderer/helpers/StringHelper'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'

import { useActions } from '@renderer/hooks/useActions'
import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'
import { useModalState } from '@renderer/hooks/useModalRouter'
import { useMountUnsafe } from '@renderer/hooks/useMountUnsafe'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import MdContentCopy from '@renderer/assets/images/md-content-copy.svg?react'
import TbPrinter from '@renderer/assets/images/tb-printer.svg?react'

import type { TModalState } from '@shared/types/modal'

export const ExportKeyModal = () => {
  const { account } = useModalState<TModalState<'export-key'>>()
  const { loginSessionRef } = useLoginSessionSelector()
  const { t } = useTranslation('modals', { keyPrefix: 'exportKey' })
  const {
    actionData: { decryptedKey },
    actionState,
    setData,
    setError,
  } = useActions({
    decryptedKey: '',
  })

  const isDisabled = actionState.isActing || decryptedKey.length === 0

  const handlePrint = () => {
    const printContent = decryptedKey
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
      <html>
      <body>
        <pre>${printContent}</pre>
      </body>
      </html>
    `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const { isMounting } = useMountUnsafe(async () => {
    try {
      if (!loginSessionRef.current) {
        throw new Error('Login session not defined')
      }
      const decryptedKey = await EncryptionHelper.decrypt(
        account.encryptedKey,
        loginSessionRef.current.encryptedPassword
      )
      setData({ decryptedKey: decryptedKey })
    } catch {
      setError('decryptedKey', t('error'))
    }
  }, 500)

  return (
    <BottomModalLayout heading={t('title')} className="overflow-y-auto">
      <div className="mb-5 flex w-full flex-col items-center justify-between">
        <div className="bg-asphalt flex h-8 w-full items-center justify-center rounded">
          {StringHelper.truncateMiddle(account.name, 45)}
        </div>

        <p className="pt-4 text-center text-sm text-gray-100 print:hidden">{t('subtitle')}</p>
        <div className="mt-8 flex justify-center rounded-md">
          <div className="rounded">
            <QRCodeSVG id="QRCode" size={174} value={decryptedKey} includeMargin />
          </div>
        </div>

        <Separator className="my-8" />

        <div className="bg-asphalt flex w-full flex-col rounded px-3 py-2.5 text-sm">
          <div className="mb-2.5 flex items-center justify-center gap-x-2">
            <div className="text-sm">{t('keyDetailsTitle')}</div>
          </div>

          <Separator />

          <div className="flex flex-col">
            {isMounting || decryptedKey === '' ? (
              <Loader />
            ) : (
              <span className="px-3 pt-8 pb-6 text-wrap break-all">{decryptedKey}</span>
            )}
          </div>
        </div>

        <div className="mt-2.5 flex justify-center gap-3 print:hidden">
          <Button
            variant="text"
            leftIcon={<MdContentCopy aria-hidden />}
            label={t('copyButtonLabel')}
            onClick={() => UtilsHelper.copyToClipboard(decryptedKey)}
            clickableProps={{ className: 'px-4' }}
            flat
            disabled={isDisabled}
          />

          <Button
            variant="text"
            leftIcon={<TbPrinter aria-hidden />}
            label={t('printButtonLabel')}
            clickableProps={{ className: 'px-4' }}
            flat
            disabled={isDisabled}
            onClick={() => handlePrint()}
          />
        </div>

        <Banner
          className="mt-5 print:hidden"
          type="warningOrange"
          textClassName="py-4 print:hidden"
          message={t('warningDescription')}
        />
      </div>
    </BottomModalLayout>
  )
}

export default ExportKeyModal
