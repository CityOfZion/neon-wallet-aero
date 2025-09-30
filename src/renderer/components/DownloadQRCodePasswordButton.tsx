import { useTranslation } from 'react-i18next'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'
import { QRCodeSVG } from 'qrcode.react'

import { Button, TButtonProps } from './Button'

type TProps = {
  onDownload?: () => Promise<void>
  password: string
} & TButtonProps

export const DownloadQRCodePasswordButton = ({
  label,
  variant,
  rightIcon,
  leftIcon,
  onDownload,
  loading,
  password,
  ...props
}: TProps) => {
  const { t } = useTranslation('common', { keyPrefix: 'general' })

  const handleDownload = async () => {
    await UtilsHelper.downloadSVGToPng('QRCode')

    if (onDownload) await onDownload()
  }

  return (
    <>
      {password && <QRCodeSVG id="QRCode" size={172} value={password} includeMargin className="hidden" />}
      <Button
        label={label ? label : t('downloadQRCodePassword')}
        rightIcon={rightIcon}
        leftIcon={leftIcon}
        variant={variant ? variant : 'outlined'}
        className={props.className}
        iconsOnEdge={false}
        loading={loading}
        onClick={handleDownload}
      />
    </>
  )
}
