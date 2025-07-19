import type platforms from '@config/platforms'

import { __, sprintf } from '@common/helpers/i18nWrap'
import LoginInfo from '@components/LoginInfo'
import isPro from '@plugin-commons/utils/isPro'
import { Button, Form, Input, Typography } from 'antd'

import proLoginAuth from '../proLoginAuth.pro'

const { Text } = Typography

interface LoginConnectionModalType {
  closeConnectModal: () => undefined
  handleAuthCallback: () => void
  platform: keyof typeof platforms
}

export type LoginCredentialType = Record<string, string>

export default function LoginConnection({
  closeConnectModal,
  handleAuthCallback,
  platform
}: LoginConnectionModalType) {
  const [form] = Form.useForm()

  const loginAuth = isPro() && proLoginAuth(platform)

  const onFinishHandler = async (values: LoginCredentialType) => {
    if (!loginAuth) return

    loginAuth(values, handleAuthCallback, closeConnectModal)
  }

  return (
    <Form form={form} key={platform} layout="vertical" onFinish={onFinishHandler}>
      <Form.Item
        label={<Text strong>{__('Username or Email')}</Text>}
        name="id"
        rules={[{ message: 'Please enter your username or email', required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={<Text strong>{__('Password')}</Text>}
        name="password"
        rules={[{ message: 'Please enter your password', required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <LoginInfo platform={platform} />
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
