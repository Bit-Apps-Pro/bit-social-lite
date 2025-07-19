import type platforms from '@config/platforms'

import { __ } from '@common/helpers/i18nWrap'
import { type CredentialType } from '@pages/Accounts/AccountsType'
import { Button, Card, Popconfirm, Row, Space, Typography } from 'antd'
import { LuTrash2 } from 'react-icons/lu'

import ConnectButton from './ConnectButton'

interface AppCardType {
  appId: number
  closeConnectModal: () => undefined
  credential: CredentialType
  handleAuthCallback: () => void
  handleDelete: () => void
  isDeleteLoading: boolean
  name: string
  platform: keyof typeof platforms
  setCustomModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const { Text } = Typography
export default function AppCard({
  closeConnectModal,
  credential,
  handleAuthCallback,
  handleDelete,
  isDeleteLoading,
  name,
  platform,
  setCustomModalOpen
}: AppCardType) {
  const platformCredentialData = {
    apiVersion: credential.apiVersion ?? undefined,
    appId: credential.appKey,
    appSecret: credential.appSecret,
    platform: platform,
    redirectUri: credential.redirectUri
  }

  return (
    <Card css={{ width: '400px' }} size="small">
      <Row align="middle" justify="space-between">
        <Text className="text-capitalize" ellipsis strong style={{ width: '200px' }}>
          {name}
        </Text>
        <Space>
          <ConnectButton
            authType={'customAuth'}
            clientId={credential.appKey}
            closeConnectModal={closeConnectModal}
            handleAuthCallback={handleAuthCallback}
            platform={platform}
            platformCredentialData={platformCredentialData}
            setCustomModalOpen={setCustomModalOpen}
          />
          <Popconfirm
            cancelText={__('No')}
            description={__('Are you sure to delete this app?')}
            okButtonProps={{ danger: true, loading: isDeleteLoading }}
            okText={__('Yes, Delete')}
            onConfirm={handleDelete}
            placement="bottomRight"
            title={__('Delete the app')}
          >
            <Button danger icon={<LuTrash2 />} type="text" />
          </Popconfirm>
        </Space>
      </Row>
    </Card>
  )
}
