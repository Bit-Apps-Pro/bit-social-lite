import type platforms from '@config/platforms'

import { __, sprintf } from '@common/helpers/i18nWrap'
import { Button, Form, Input, Select, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { LuMoveUpRight } from 'react-icons/lu'

import { lineTokenAuthorization } from '../helper/line/lineTokenAuth.pro'

const { Link, Text } = Typography

interface connectionModalType {
  closeConnectModal: () => undefined
  handleAuthCallback: () => void
  platform: keyof typeof platforms
}

export type LoginCredentialType = Record<string, string>

export default function LineTokenConnection({
  closeConnectModal,
  handleAuthCallback,
  platform
}: connectionModalType) {
  const [form] = Form.useForm()
  const [type, setType] = useState('group')

  const onFinishHandler = async (values: LoginCredentialType) => {
    lineTokenAuthorization(values, handleAuthCallback, closeConnectModal)
  }

  useEffect(() => {
    form.setFieldsValue({ type })
  }, [type, form])

  return (
    <Form
      form={form}
      initialValues={{ type: 'group' }}
      key={platform}
      layout="vertical"
      onFinish={onFinishHandler}
    >
      <Form.Item label={<Text strong>{__('Type')}</Text>} name="type">
        <Select
          onChange={value => setType(value)}
          options={[
            { label: __('Group'), value: 'group' },
            { label: __('User'), value: 'user' }
          ]}
        />
      </Form.Item>

      <Form.Item
        extra={
          <Text type="secondary">
            {sprintf(__(`Enter the ID of the target recipient. Use a %s Id value returned in a`), type)}{' '}
            <Link
              href={'https://developers.line.biz/en/reference/messaging-api/#common-properties'}
              rel="noopener noreferrer nofollow"
              strong
              style={{ whiteSpace: 'nowrap' }}
              target="_blank"
            >
              {__('webhook event object')}
              <LuMoveUpRight size={12} style={{ transform: 'translateY(-2px)' }} />
            </Link>
          </Text>
        }
        htmlFor="id"
        label={
          <Text className="capitalize" strong>
            {sprintf(__('%s Id'), type)}
          </Text>
        }
        name="id"
        rules={[{ message: sprintf('Please enter your %s id', type), required: true }]}
      >
        <Input id="id" name="id" />
      </Form.Item>

      <Form.Item
        extra={
          <Text type="secondary">
            {__('To get token, Visit ')}
            <Link
              href={'https://developers.line.biz/console/'}
              rel="noopener noreferrer nofollow"
              strong
              style={{ whiteSpace: 'nowrap' }}
              target="_blank"
            >
              {__('developer console')}
              <LuMoveUpRight size={12} style={{ transform: 'translateY(-2px)' }} />
            </Link>
          </Text>
        }
        htmlFor="token"
        label={<Text strong>{__('Token')}</Text>}
        name="token"
        rules={[{ message: 'Please enter your channel access token', required: true }]}
      >
        <Input id="token" name="token" />
      </Form.Item>

      <Form.Item>
        <Button className="w-100 capitalize" onClick={() => form.submit()} size="large" type="primary">
          {sprintf(__('Connect %s'), platform)}
        </Button>
      </Form.Item>
    </Form>
  )
}
