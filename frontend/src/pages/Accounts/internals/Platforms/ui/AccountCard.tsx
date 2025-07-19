import type platforms from '@config/platforms'

import { __ } from '@common/helpers/i18nWrap'
import useDeleteAccount from '@pages/Accounts/data/useDeleteAccount'
import useUpdateAccountStatus from '@pages/Accounts/data/useUpdateAccountStatus'
import { Button, Card, Flex, Popconfirm, Space, Switch, theme, Typography } from 'antd'
import { LuTrash2 } from 'react-icons/lu'

import AvatarPlatform from './AvatarPlatform'

interface SocialCardType {
  accountType: string
  id: number
  image: string
  name: string
  platform: keyof typeof platforms
  status: number
}

export default function AccountCard({ accountType, id, image, name, platform, status }: SocialCardType) {
  const { deleteAccount, deleteAccountLoading } = useDeleteAccount()
  const { updateAccountStatus, updateAccountStatusLoading } = useUpdateAccountStatus()
  const { token } = theme.useToken()

  const ACTIVE = 1
  const INACTIVE = 0

  return (
    <Card size="small" style={{ borderColor: token.colorBorder }}>
      <Flex className="w-100" justify="space-between">
        <AvatarPlatform avatarLink={image} platform={platform} />

        <Space>
          <Popconfirm
            description={
              status
                ? __(`It will no longer be able to automatic posting, scheduling, and sharing`)
                : __('Enable Automatic Posting, Scheduling, and Sharing')
            }
            okButtonProps={{ danger: Boolean(status), loading: updateAccountStatusLoading }}
            okText={status ? __('Disable') : __('Enable')}
            onConfirm={() => updateAccountStatus({ id, status: status === ACTIVE ? INACTIVE : ACTIVE })}
            placement="top"
            title={`Do you want to ${status === ACTIVE ? __('disable') : __('enable')} the account?`}
          >
            <Switch checked={Boolean(status)} size="small" />
          </Popconfirm>

          <Popconfirm
            description={__('This account also be deleted from related schedule!')}
            okButtonProps={{ danger: true, loading: deleteAccountLoading }}
            okText={__('Yes, delete')}
            onConfirm={() => deleteAccount(id)}
            placement="top"
            title={__('Are you sure?')}
          >
            <Button danger icon={<LuTrash2 />} type="text" />
          </Popconfirm>
        </Space>
      </Flex>

      <Typography.Paragraph ellipsis style={{ marginBottom: '0px', marginTop: '8px' }}>
        {name}
      </Typography.Paragraph>
      {accountType && (
        <Typography.Text ellipsis type="secondary">
          {accountType}
        </Typography.Text>
      )}
    </Card>
  )
}
