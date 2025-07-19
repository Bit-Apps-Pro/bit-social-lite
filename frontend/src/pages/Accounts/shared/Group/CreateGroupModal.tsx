import { $appConfig } from '@common/globalStates'
import { __ } from '@common/helpers/i18nWrap'
import useCreateGroup from '@pages/Accounts/shared/Group/data/useCreateGroup'
import useGroups from '@pages/Accounts/shared/Group/data/useGroups'
import { Button, Form, Input, Modal, notification, theme } from 'antd'
import { useAtomValue } from 'jotai'
import { useState } from 'react'
import { LuPlus } from 'react-icons/lu'

import { isGroupNameExist } from './helper/groupHelper'

export default function CreateGroupModal() {
  const { token } = theme.useToken()
  const { isDarkTheme } = useAtomValue($appConfig)
  const [form] = Form.useForm()
  const { groups } = useGroups()
  const { createGroup, isLoadingCreateGroup } = useCreateGroup()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleModalClose = () => {
    form.resetFields()
    setIsModalOpen(false)
  }

  const handleGroupCreate = async () => {
    form.submit()
  }

  const handleOnFinish = async ({ name }: { name: string }) => {
    const response = await createGroup(name)

    if (response?.code === 'SUCCESS') {
      form.resetFields()
      notification.success({
        message: `Group create successfully!`
      })

      setIsModalOpen(false)
    }
  }

  return (
    <>
      <Button
        className="mb-2"
        icon={<LuPlus size={22} />}
        onClick={() => setIsModalOpen(true)}
        style={{
          border: `2px solid ${token.colorPrimary}`,
          color: isDarkTheme ? token.colorTextBase : token.colorPrimary,
          fontWeight: 500
        }}
        type="text"
      >
        {__('Create Group')}
      </Button>

      <Modal
        footer={[
          <Button key="back" onClick={handleModalClose}>
            {__('Cancel')}
          </Button>,
          <Button key="submit" loading={isLoadingCreateGroup} onClick={handleGroupCreate} type="primary">
            {__('Create')}
          </Button>
        ]}
        onCancel={handleModalClose}
        open={isModalOpen}
      >
        <Form form={form} layout="vertical" onFinish={handleOnFinish}>
          <Form.Item
            label={__('Name')}
            name="name"
            rules={[
              { message: 'Please enter group name', required: true },
              {
                validator: (_, value) => {
                  if (value.length) {
                    return isGroupNameExist(value.trim(), groups)
                      ? Promise.reject(new Error(value + ' name already exist'))
                      : Promise.resolve()
                  }
                }
              }
            ]}
          >
            <Input name="name" placeholder={__('New group')} required />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
