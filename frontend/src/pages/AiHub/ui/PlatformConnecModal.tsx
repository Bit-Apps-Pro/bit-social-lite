import { $appConfig } from '@common/globalStates'
import { __ } from '@common/helpers/i18nWrap'
import { getAiIcon } from '@icons/PlatformIcon'
import { Avatar, Button, Form, Input, Modal, notification, Space, theme, Typography } from 'antd'
import { useAtomValue } from 'jotai'
import { useState } from 'react'

import useSaveAiPlatform from '../data/useSaveAiPlatform'

const { Text } = Typography

export default function PlatformConnectModal({
  authType,
  docLink,
  name,
  platform
}: {
  authType: string
  docLink?: string
  name: string
  platform: string
}) {
  const { token } = theme.useToken()
  const { isDarkTheme } = useAtomValue($appConfig)
  const [form] = Form.useForm()

  const { isAiSavingPlatform, saveAiPlatform } = useSaveAiPlatform()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [errorMessage, setErrorMessage] = useState<string>('')
  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    form.submit()
    setErrorMessage('')
  }

  const handleCancel = () => {
    form.resetFields()
    setErrorMessage('')
    setIsModalOpen(false)
  }

  const onFinishHandler = async (values: Record<string, string>) => {
    const response = await saveAiPlatform({
      authType: authType,
      key: values.apiKey,
      platform: platform
    })

    if (response.data.status === 'error') {
      setErrorMessage(response.data.message)
    } else {
      notification.success({
        message: response.data.message,
        placement: 'topRight'
      })
    }
  }

  return (
    <>
      <Button
        onClick={showModal}
        size="small"
        style={{
          border: `1px solid ${token.colorPrimary}`,
          color: isDarkTheme ? token.colorTextBase : token.colorPrimary
        }}
      >
        {__('Connect')}
      </Button>
      <Modal
        closable={{ 'aria-label': 'Custom Close Button' }}
        footer={[
          <Button key="Ok" loading={isAiSavingPlatform} onClick={handleOk} type="primary">
            {__('Connect')}
          </Button>
        ]}
        maskClosable={false}
        onCancel={handleCancel}
        onOk={handleOk}
        open={isModalOpen}
        title={
          <Space>
            <Avatar size={30} src={getAiIcon(platform)} />
            <Text strong>{name}</Text>
          </Space>
        }
      >
        <Form form={form} key={platform} layout="vertical" onFinish={onFinishHandler}>
          <Form.Item
            hasFeedback
            help={errorMessage}
            label={<Text strong>{__('Api Key')}</Text>}
            name="apiKey"
            required
            rules={[{ message: 'Please enter your api key', required: true }]}
            validateStatus={errorMessage ? 'error' : undefined}
          >
            <Input allowClear placeholder={__('Enter your api key')} />
          </Form.Item>
          {docLink && (
            <Text>
              {__('You can find your API key in  ')}
              <Typography.Link href={docLink} rel="noopener noreferrer" strong target="_blank" underline>
                {name}
                {__(' settings')}
              </Typography.Link>
            </Text>
          )}
        </Form>
      </Modal>
    </>
  )
}
