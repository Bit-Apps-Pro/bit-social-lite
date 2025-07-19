import type platforms from '@config/platforms'

import { $isBuyProModalOpen } from '@common/globalStates/$buyPro'
import { __ } from '@common/helpers/i18nWrap'
import { isProPlatform } from '@common/helpers/proPlatform'
import isPro from '@plugin-commons/utils/isPro'
import { Button } from 'antd'
import { useSetAtom } from 'jotai'

import freeOneClickAuth from '../freeOneClickAuth.free'
import proOneClickAuth from '../proOneClickAuth.pro'

interface ConnectButtonType {
  authType?: 'customAuth' | 'oneClickAuth'
  clientId: string
  closeConnectModal: () => undefined
  handleAuthCallback: () => void
  isConnectLoading?: boolean
  platform: string
  platformCredentialData: {
    apiVersion?: string
    appId: string
    appSecret: string
    platform: keyof typeof platforms
    redirectUri: string
  }
  setCustomModalOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ConnectButton({
  authType = 'oneClickAuth',
  clientId,
  closeConnectModal,
  handleAuthCallback,
  isConnectLoading,
  platform,
  platformCredentialData,
  setCustomModalOpen
}: ConnectButtonType) {
  const setProModalOpen = useSetAtom($isBuyProModalOpen)

  const oneClickAuth = isPro() ? proOneClickAuth : freeOneClickAuth

  const handleConnectButton = () => {
    const appAuthorization = oneClickAuth(platform, platformCredentialData.apiVersion)
    if (!isPro() && isProPlatform(platform)) {
      setProModalOpen(true)
      return
    }

    if (setCustomModalOpen) {
      setCustomModalOpen(false)
    }

    if (appAuthorization) {
      appAuthorization(platformCredentialData, handleAuthCallback, closeConnectModal, authType)
    }
  }

  return (
    <Button
      block
      disabled={!clientId}
      loading={isConnectLoading}
      onClick={handleConnectButton}
      size="small"
      type="primary"
    >
      {__('Connect')}
    </Button>
  )
}
