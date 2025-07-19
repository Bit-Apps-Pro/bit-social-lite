import type platforms from '@config/platforms'

import { __ } from '@common/helpers/i18nWrap'
import AvatarPlatform from '@pages/Accounts/internals/Platforms/ui/AvatarPlatform'
import useGroupById from '@pages/Accounts/shared/Group/data/useGroupById'
import { Button, Card, Flex, notification, Popconfirm, theme, Typography } from 'antd'
import { LuTrash2 } from 'react-icons/lu'

import useRemoveAccountFromGroup from './data/useRemoveAccountFromGroup'

interface SocialCardType {
  accountType: string
  groupId: number
  id: number
  image: string
  isDeletable?: boolean
  name: string
  platform: keyof typeof platforms
}

export default function GroupAccountCard({
  accountType,
  groupId,
  id,
  image,
  isDeletable = false,
  name,
  platform
}: SocialCardType) {
  const { isLoadingGroupAccount, removeAccount } = useRemoveAccountFromGroup()
  const { token } = theme.useToken()

  const { refetchIds } = useGroupById(groupId)
  const handleRemove = async () => {
    const response = await removeAccount({ accountId: id, groupId: groupId })

    if (response.status === 'success') {
      notification.success({
        message: response.data,
        placement: 'topRight'
      })

      refetchIds()
    }
  }
  return (
    <Card
      style={{ borderColor: token.colorBorder }}
      styles={{
        body: {
          padding: '6px 8px'
        }
      }}
    >
      <Flex align="center" gap={20} justify="space-between">
        <Flex gap={20} style={{ overflow: 'hidden' }}>
          <AvatarPlatform avatarLink={image} platform={platform} size={24} />
          <Flex style={{ overflow: 'hidden' }} vertical>
            <Typography.Text ellipsis title={name}>
              {name}
            </Typography.Text>
            {accountType && (
              <Typography.Text ellipsis title={accountType} type="secondary">
                {accountType}
              </Typography.Text>
            )}
          </Flex>
        </Flex>
        {isDeletable && (
          <Popconfirm
            okButtonProps={{ danger: true, loading: isLoadingGroupAccount }}
            okText={__('Yes, Remove')}
            onConfirm={handleRemove}
            placement="top"
            title={__('Remove account from this group?')}
          >
            <Button className="m-1" danger icon={<LuTrash2 />} type="text" />
          </Popconfirm>
        )}
      </Flex>
    </Card>
  )
}
