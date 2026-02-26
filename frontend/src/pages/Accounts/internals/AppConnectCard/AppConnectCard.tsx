import { $appConfig } from '@common/globalStates'
import { $isBuyProModalOpen } from '@common/globalStates/$buyPro'
import { __, sprintf } from '@common/helpers/i18nWrap'
import { isProPlatform } from '@common/helpers/proPlatform'
import config from '@config/config'
import platforms from '@config/platforms'
import PlatformIcon from '@icons/PlatformIcon'
import { type AppConnectCardType, type ConnectType } from '@pages/Accounts/AccountsType'
import useAccounts from '@pages/Accounts/data/useAccounts'
import DocsLink from '@utilities/DocsLink'
import YoutubeLink from '@utilities/YoutubeLink'
import { Button, Card, Flex, Modal, Space, theme, Typography } from 'antd'
import { useAtomValue, useSetAtom } from 'jotai'
import { useState } from 'react'
import { LuArrowLeft, LuCrown } from 'react-icons/lu'
import { useSearchParams } from 'react-router'

import ConnectionForm from './ConnectionForm'
import ConnectButton from './ui/ConnectButton'

const redirectUrl = `${config.REDIRECT_URL}`
const { Title } = Typography

const connectName = {
  custom: __('Connect Custom %s App'),
  login: __('Connect %s'),
  oneClick: __('Connect %s')
}

export default function AppConnectCard({
  clientId,
  closeConnectModal,
  isConnectLoading,
  name,
  platform,
  setAccountModal,
  types
}: AppConnectCardType) {
  const { refetchAccounts } = useAccounts()

  const [searchParams, setSearchParams] = useSearchParams({})
  const currentTabValue = searchParams.get('value') || 'all'

  const [currentConnectType, setCurrentConnectType] = useState<ConnectType>()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const { token } = theme.useToken()

  const setProModalOpen = useSetAtom($isBuyProModalOpen)
  const { isProClient } = useAtomValue($appConfig)

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleModalOpen = (type: ConnectType) => {
    setCurrentConnectType(type)

    if (isProPlatform(platform) && !isProClient) {
      setProModalOpen(true)
      return
    }
    closeConnectModal()

    setIsModalOpen(true)
  }

  const handleAuthCallback = () => {
    setSearchParams(prev => {
      prev.set('type', 'platform')
      prev.set('value', String(currentTabValue))
      return prev
    })
    refetchAccounts()
  }

  const handleBack = () => {
    handleOk()
    setAccountModal(true)
  }

  return (
    <Card style={{ borderColor: token.colorBorder, height: '100%' }}>
      <Flex gap={14} vertical>
        <Space align="center">
          <PlatformIcon name={platform} size={30} style={{ flexShrink: 0 }} />
          <Title className="text-capitalize" level={5} style={{ marginBottom: 0 }}>
            {name || platforms[platform].name}
          </Title>
          {isProPlatform(platform) && !isProClient && <LuCrown color="#ff8609" size={20} />}
        </Space>
        <Space size={0}>
          <DocsLink platform={platform} />
          <YoutubeLink platform={platform} />
        </Space>
        <Space direction="vertical" size="small">
          {types.includes('custom') && (
            <Button
              block
              onClick={() => handleModalOpen('custom')}
              size="small"
              style={{ borderColor: token.colorPrimary }}
            >
              {__('Custom App')}
            </Button>
          )}

          {types.includes('login') && (
            <Button block onClick={() => handleModalOpen('login')} size="small" type="primary">
              {__('Login')}
            </Button>
          )}

          {types.includes('oneClick') && clientId && (
            <ConnectButton
              clientId={clientId}
              closeConnectModal={closeConnectModal}
              handleAuthCallback={handleAuthCallback}
              isConnectLoading={isConnectLoading}
              platform={platform}
              platformCredentialData={{
                appId: clientId,
                appSecret: '',
                platform,
                redirectUri: redirectUrl
              }}
            />
          )}
        </Space>

        {currentConnectType && (
          <Modal
            centered
            footer={false}
            key={platform}
            onCancel={() => setIsModalOpen(false)}
            onOk={handleOk}
            open={isModalOpen}
            title={
              <div>
                <Flex align="center" gap={10}>
                  <Button
                    icon={<LuArrowLeft size={24} />}
                    onClick={handleBack}
                    title={__('Back')}
                    type="text"
                  />
                  <PlatformIcon name={platform} size={34} />
                  <Title className="text-capitalize" level={5} style={{ marginBottom: 0 }}>
                    {sprintf(__(connectName[currentConnectType]), platform)}
                  </Title>
                  <DocsLink platform={platform} />
                  <YoutubeLink platform={platform} />
                </Flex>
              </div>
            }
            width={900}
          >
            <ConnectionForm
              closeConnectModal={closeConnectModal}
              currentConnectType={currentConnectType}
              handleAuthCallback={handleAuthCallback}
              platform={platform}
              setCustomModalOpen={setIsModalOpen}
            />
          </Modal>
        )}
      </Flex>
    </Card>
  )
}
