import { __ } from '@common/helpers/i18nWrap'
import { getAiIcon } from '@icons/PlatformIcon'
import useDeleteAccount from '@pages/Accounts/data/useDeleteAccount'
import { Avatar, Button, Card, Flex, Popconfirm, Space, theme, Typography } from 'antd'

import { useAiPlatformAccounts } from '../data/useAiPlatformAccounts'
import PlatformConnectModal from './PlatformConnecModal'

const { Text, Title } = Typography
export default function PlatformCard({
  docLink,
  name,
  platform
}: {
  docLink?: string
  name: string
  platform: string
}) {
  const { aiPlatformAccounts } = useAiPlatformAccounts()

  const { deleteAccount, deleteAccountLoading } = useDeleteAccount()

  const secretKey = aiPlatformAccounts?.find(account => account.platform === platform)?.key || ''

  const { token } = theme.useToken()

  const handleDelete = async () => {
    const accountId = aiPlatformAccounts.find(account => account.platform === platform)?.id
    if (accountId) {
      await deleteAccount(accountId)
    }
  }

  return (
    <Card
      size="small"
      style={{
        borderColor: token.colorBorder,
        boxShadow: '0 6px 11px -8px #afafaf'
      }}
    >
      <Flex align="center" gap={8} justify="space-between">
        <Space>
          <Avatar size={50} src={getAiIcon(platform)} />
          <Space direction="vertical" size={0}>
            <Title level={4} style={{ marginBottom: '0px', marginTop: '8px' }}>
              {name}
            </Title>
            <Text ellipsis type="secondary">
              {secretKey || __('Connect your key')}
            </Text>
          </Space>
        </Space>
        <div>
          {secretKey ? (
            <Popconfirm
              cancelText={__('No')}
              description={__('Are you sure to delete connection?')}
              okButtonProps={{ danger: true, loading: deleteAccountLoading }}
              okText={__('Yes, Disconnect')}
              onConfirm={handleDelete}
              placement="bottomRight"
              title={__('Delete the app')}
            >
              <Button danger size="small">
                {__('Disconnect')}
              </Button>
            </Popconfirm>
          ) : (
            <PlatformConnectModal
              authType={'keyAuth'}
              docLink={docLink}
              name={name}
              platform={platform}
            />
          )}
        </div>
      </Flex>
    </Card>
  )
}
