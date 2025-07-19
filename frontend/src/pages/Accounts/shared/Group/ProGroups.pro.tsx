import { type CSSProperties } from '@ant-design/cssinjs/lib/hooks/useStyleRegister'
import { $appConfig } from '@common/globalStates'
import { __ } from '@common/helpers/i18nWrap'
import useDeleteGroup from '@pages/Accounts/shared/Group/data/useDeleteGroup'
import useGroups from '@pages/Accounts/shared/Group/data/useGroups'
import {
  Button,
  type CollapseProps,
  Empty,
  Flex,
  notification,
  Popconfirm,
  Skeleton,
  Space,
  Typography
} from 'antd'
import { Collapse, theme } from 'antd'
import { useAtomValue } from 'jotai'
import React from 'react'
import { LuChevronDown, LuChevronRight, LuTrash2 } from 'react-icons/lu'

import AddGroupModal from './AddGroupModal'
import useUpdateGroup from './data/useUpdateGroup'
import GroupAccounts from './GroupAccounts'
import { type GroupType } from './GroupType'
import { isGroupNameExist } from './helper/groupHelper'

const { Text } = Typography

const getItems: (
  panelStyle: CSSProperties,
  groups: GroupType[],
  handleGroupName: (id: number, name: string) => void,
  handleDelete: (groupId: number) => void,
  isLoadingGroup: boolean
) => CollapseProps['items'] = (panelStyle, groups, handleGroupName, handleDelete, isLoadingGroup) =>
  groups.map(group => {
    const groupAccounts = group.accounts

    return {
      children: <GroupAccounts accounts={groupAccounts} groupId={group.id} />,
      key: group.id,
      label: (
        <Flex justify="space-between">
          <Text
            className="w-100"
            editable={{
              onChange: name => handleGroupName(group.id, name)
            }}
            ellipsis
            onClick={e => e.stopPropagation()}
            title={group.name}
          >
            {group.name}
          </Text>
          <Space>
            <AddGroupModal groupId={group.id} />
            <Popconfirm
              okButtonProps={{ danger: true, loading: isLoadingGroup }}
              okText={__('Yes, Remove')}
              onConfirm={() => handleDelete(group.id)}
              placement="top"
              title={__('Remove account from this group?')}
            >
              <Button
                className="bg-slate-50 dark:bg-slate-900"
                danger
                icon={<LuTrash2 />}
                onClick={e => e.stopPropagation()}
                type="text"
              />
            </Popconfirm>
          </Space>
        </Flex>
      ),
      style: panelStyle
    }
  })

export default function ProGroups() {
  const { groups, isLoadingGroups } = useGroups()

  const { deleteGroup, isLoadingDeleteGroup } = useDeleteGroup()
  const { token } = theme.useToken()
  const { isDarkTheme } = useAtomValue($appConfig)

  const { updateGroup } = useUpdateGroup()

  const panelStyle: React.CSSProperties = {
    background: `${isDarkTheme ? token.colorBgContainerDisabled : '#e2e8f0'}`,
    border: 'none',
    borderRadius: token.borderRadiusLG,
    marginBottom: 16
  }

  if (isLoadingGroups) {
    return <Skeleton active />
  }

  const handleGroupName = async (groupId: number, name: string) => {
    if (!name.length) {
      notification.error({
        message: `Name empty`,
        placement: 'topRight'
      })
      return
    }
    if (isGroupNameExist(name.trim(), groups, groupId)) {
      notification.error({
        message: `This ${name} already exist `,
        placement: 'topRight'
      })
    } else {
      const response = await updateGroup({ groupData: { name: name }, groupId })
      notification[response.status]({
        message: response.data,
        placement: 'topRight'
      })
    }
  }

  const handleDelete = async (groupId: number) => {
    const response = await deleteGroup(groupId)
    if (response.status === 'success' && response.status === 'success') {
      notification.success({
        message: response.data,
        placement: 'topRight'
      })
    }
  }

  if (!groups.length) {
    return <Empty description={__('No Groups found!')} />
  }

  return (
    <Collapse
      bordered={false}
      className="bg-slate-50 dark:bg-transparent"
      defaultActiveKey={['1']}
      expandIcon={({ isActive }) =>
        isActive ? <LuChevronDown size={22} /> : <LuChevronRight size={22} />
      }
      items={getItems(panelStyle, groups, handleGroupName, handleDelete, isLoadingDeleteGroup)}
    />
  )
}
