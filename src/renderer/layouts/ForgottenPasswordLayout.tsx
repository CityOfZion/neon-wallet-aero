import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import { IconButton } from '@renderer/components/IconButton'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

import NeonWalletFullImage from '@renderer/assets/images/neon-wallet-full.svg?react'
import TbArrowLeft from '@renderer/assets/images/tb-arrow-left.svg?react'

import { ScreenLayout } from './ScreenLayout'

type TProps = {
  heading: string
  children?: ReactNode
  contentClassName?: string
  withBack?: boolean
}

export const ForgottenPasswordLayout = ({ heading, contentClassName, children, withBack = true, ...props }: TProps) => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <ScreenLayout contentClassName={StyleHelper.mergeStyles('items-center', contentClassName)} {...props}>
      {withBack && (
        <IconButton
          icon={<TbArrowLeft aria-hidden />}
          className="absolute top-5 left-5"
          size="md"
          onClick={handleBack}
        />
      )}

      <NeonWalletFullImage className="mt-16 h-11" aria-hidden="true" />
      <h1 className="mt-4 text-center text-lg text-white">{heading}</h1>

      {children}
    </ScreenLayout>
  )
}
