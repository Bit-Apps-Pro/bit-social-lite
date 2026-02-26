import { $accountConnect, $appConfig } from '@common/globalStates'
import { __ } from '@common/helpers/i18nWrap'
import { Button, Col, Modal, Row, theme } from 'antd'
import { useAtomValue } from 'jotai'
import { useState } from 'react'
import { LuPlus } from 'react-icons/lu'

import AccountSaveModal from './AccountSaveModal'
import useClientIds from './data/useClientIds'
import AppConnectCard from './internals/AppConnectCard'

interface ConnectAccountType {
  btnType?: 'custom' | 'default'
}

export default function ConnectAccount({ btnType = 'default' }: ConnectAccountType) {
  const { clientIds, isLoadingClientIds } = useClientIds()
  const { token } = theme.useToken()
  const { isDarkTheme } = useAtomValue($appConfig)

  const { isModalOpen: isAccountSaveModalOpen } = useAtomValue($accountConnect)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCancel = (): undefined => {
    const getClearInterval = localStorage.getItem('__bitSocial_platform_interval')

    if (getClearInterval) {
      clearInterval(Number(getClearInterval))
      localStorage.removeItem('__bitSocial_platform_interval')
    }

    setIsModalOpen(false)
  }

  const handleModalOpen = () => {
    setIsModalOpen(true)
  }

  return (
    <div>
      {btnType === 'default' ? (
        <Button icon={<LuPlus size={18} />} onClick={handleModalOpen} size="small" type="primary">
          {__('Connect Account')}
        </Button>
      ) : (
        <Button
          aria-label={__('Connect Account')}
          icon={<LuPlus size={30} />}
          onClick={handleModalOpen}
          style={{
            alignItems: 'center',
            border: `2px solid ${token.colorPrimary}`,
            color: isDarkTheme ? token.colorTextBase : token.colorPrimary,
            display: 'flex',
            fontSize: '17px',
            fontWeight: 600,
            height: '100%',
            justifyContent: 'center',
            minHeight: '110px',
            width: '100%'
          }}
          type="text"
        >
          {__('Connect Account')}
        </Button>
      )}

      <Modal
        centered
        footer={false}
        onCancel={handleCancel}
        open={isModalOpen}
        style={{ padding: '20px' }}
        title={__('Connect Account')}
        width={1000}
      >
        <Row className="p-2" gutter={[12, 12]}>
          <Col md={6} sm={12} xs={24}>
            <AppConnectCard
              clientId={clientIds?.facebook.id}
              closeConnectModal={handleCancel}
              isConnectLoading={isLoadingClientIds}
              platform="facebook"
              setAccountModal={setIsModalOpen}
              status={clientIds?.facebook.status}
              types={['oneClick', 'custom']}
            />
          </Col>

          <Col md={6} sm={12} xs={24}>
            <AppConnectCard
              clientId={clientIds?.linkedin.id}
              closeConnectModal={handleCancel}
              isConnectLoading={isLoadingClientIds}
              platform="linkedin"
              setAccountModal={setIsModalOpen}
              status={clientIds?.linkedin.status}
              types={['oneClick', 'custom']}
            />
          </Col>

          <Col md={6} sm={12} xs={24}>
            <AppConnectCard
              clientId={clientIds?.threads.id}
              closeConnectModal={handleCancel}
              isConnectLoading={isLoadingClientIds}
              platform="threads"
              setAccountModal={setIsModalOpen}
              status={clientIds?.threads.status}
              types={['oneClick', 'custom']}
            />
          </Col>

          <Col md={6} sm={12} xs={24}>
            <AppConnectCard
              clientId={clientIds?.googleBusinessProfile.id}
              closeConnectModal={handleCancel}
              isConnectLoading={isLoadingClientIds}
              name="Google Business"
              platform="googleBusinessProfile"
              setAccountModal={setIsModalOpen}
              status={clientIds?.googleBusinessProfile.status}
              types={['oneClick', 'custom']}
            />
          </Col>

          <Col md={6} sm={12} xs={24}>
            <AppConnectCard
              clientId={clientIds?.pinterest.id}
              closeConnectModal={handleCancel}
              isConnectLoading={isLoadingClientIds}
              platform="pinterest"
              setAccountModal={setIsModalOpen}
              status={clientIds?.pinterest.status}
              types={['oneClick', 'custom']}
            />
          </Col>

          <Col md={6} sm={12} xs={24}>
            <AppConnectCard
              clientId={clientIds?.discord.id}
              closeConnectModal={handleCancel}
              isConnectLoading={isLoadingClientIds}
              platform="discord"
              setAccountModal={setIsModalOpen}
              status={clientIds?.discord.status}
              types={['oneClick', 'custom']}
            />
          </Col>

          <Col md={6} sm={12} xs={24}>
            <AppConnectCard
              clientId={clientIds?.tumblr.id}
              closeConnectModal={handleCancel}
              isConnectLoading={isLoadingClientIds}
              platform="tumblr"
              setAccountModal={setIsModalOpen}
              status={clientIds?.tumblr.status}
              types={['oneClick', 'custom']}
            />
          </Col>
          <Col md={6} sm={12} xs={24}>
            <AppConnectCard
              clientId={clientIds?.instagram.id}
              closeConnectModal={handleCancel}
              isConnectLoading={isLoadingClientIds}
              platform="instagram"
              setAccountModal={setIsModalOpen}
              status={clientIds?.instagram.status}
              types={['oneClick', 'custom']}
            />
          </Col>

          <Col md={6} sm={12} xs={24}>
            <AppConnectCard
              closeConnectModal={handleCancel}
              name="TikTok"
              platform="tiktok"
              setAccountModal={setIsModalOpen}
              types={['custom']}
            />
          </Col>

          <Col md={6} sm={12} xs={24}>
            <AppConnectCard
              closeConnectModal={handleCancel}
              name="X (Twitter)"
              platform="twitter"
              setAccountModal={setIsModalOpen}
              types={['custom']}
            />
          </Col>
          <Col md={6} sm={12} xs={24}>
            <AppConnectCard
              closeConnectModal={handleCancel}
              name="Bluesky"
              platform="bluesky"
              setAccountModal={setIsModalOpen}
              status={0}
              types={['login']}
            />
          </Col>
          <Col md={6} sm={12} xs={24}>
            <AppConnectCard
              closeConnectModal={handleCancel}
              name="Line"
              platform="line"
              setAccountModal={setIsModalOpen}
              status={0}
              types={['login']}
            />
          </Col>
          <Col md={6} sm={12} xs={24}>
            <AppConnectCard
              closeConnectModal={handleCancel}
              name="Telegram"
              platform="telegram"
              setAccountModal={setIsModalOpen}
              status={0}
              types={['login']}
            />
          </Col>
        </Row>
      </Modal>

      {isAccountSaveModalOpen && <AccountSaveModal />}
    </div>
  )
}
