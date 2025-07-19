import type platforms from '@config/platforms'

import { __, sprintf } from '@common/helpers/i18nWrap'
import isPro from '@plugin-commons/utils/isPro'
import { Button, Form, Input, Typography } from 'antd'

import { telegramBotAuthorization } from '../helper/telegram/telegramBotAuth'

const { Text } = Typography

interface LoginConnectionModalType {
  closeConnectModal: () => undefined
  handleAuthCallback: () => void
  platform: keyof typeof platforms
}

export interface LoginCredentialType {
  token: string
}

export default function TelegramBotConnection({
  closeConnectModal,
  handleAuthCallback,
  platform
}: LoginConnectionModalType) {
  const [form] = Form.useForm()

  const loginAuth = isPro() && telegramBotAuthorization

  const onFinishHandler = async (values: LoginCredentialType) => {
    if (!loginAuth) return

    loginAuth(values, handleAuthCallback, closeConnectModal)
  }

  return (
    <Form form={form} key={platform} layout="vertical" onFinish={onFinishHandler}>
      <Form.Item
        label={<Text strong>{__('Bot Token')}</Text>}
        name="token"
        rules={[{ message: 'Please enter your bot token', required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <Button
          className="w-100"
          onClick={() => {
            form.submit()
          }}
          size="large"
          type="primary"
        >
          {sprintf(__('Connect %s '), platform)}
        </Button>
      </Form.Item>
    </Form>
  )
}
