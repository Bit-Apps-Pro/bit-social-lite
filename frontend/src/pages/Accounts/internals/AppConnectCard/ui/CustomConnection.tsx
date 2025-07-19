/* eslint-disable translate-obj-prop/translate-obj-prop */
import type platforms from '@config/platforms'

import { $bitSocial } from '@common/globalStates'
import { __ } from '@common/helpers/i18nWrap'
import DeveloperInfo from '@components/DeveloperInfo'
import { type CustomAppType, type CustomCredentialType } from '@pages/Accounts/AccountsType'
import useCreateCustomApp from '@pages/Accounts/data/useCreateCustomApp'
import useCustomApp from '@pages/Accounts/data/useCustomApp'
import useDeleteCustomApp from '@pages/Accounts/data/useDeleteCustomApp'
import {
  Button,
  Col,
  Form,
  Input,
  type InputRef,
  notification,
  Row,
  Select,
  Space,
  Typography
} from 'antd'
import { useAtomValue } from 'jotai'
import { useRef, useState } from 'react'
import { LuCopy } from 'react-icons/lu'

import AppCard from './AppCard'

interface CustomConnectionModalType {
  closeConnectModal: () => undefined
  handleAuthCallback: () => void
  platform: keyof typeof platforms
  setCustomModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

// type FieldType = 'appName' | 'appVersion'
type RequiredFieldType = Record<string, string[]>

const { Text, Title } = Typography

const requiredField = (platformName: string, field: string) => {
  const requireField: RequiredFieldType = {
    apiVersion: ['twitter'],
    appName: ['twitter', 'tumblr']
  }

  return requireField[field].includes(platformName)
}

export default function CustomConnection({
  closeConnectModal,
  handleAuthCallback,
  platform,
  setCustomModalOpen
}: CustomConnectionModalType) {
  const { apiURL, siteUrl } = useAtomValue($bitSocial)
  const redirectUri = `${apiURL.base}/redirect`
  const homepageUri = siteUrl

  const [form] = Form.useForm()
  const [errorMsg, setErrorMsg] = useState<Record<string, string[]>>({})
  const { createCustomApp, isLoadingCreateCustomApp } = useCreateCustomApp()
  const { deleteCustomApp, isLoadingDeleteCustomApp } = useDeleteCustomApp()
  const { customApps } = useCustomApp(platform)
  const uriInput = useRef<InputRef>(null)

  const handleCopyText = (uri: string) => {
    try {
      navigator.clipboard.writeText(uri)
      notification.success({
        message: 'Copied!'
      })
    } catch {
      if (uriInput.current != undefined) {
        uriInput.current.select()
        document.execCommand('copy')
        uriInput.current.blur()
      }
    }
  }

  const apiVersionChangeHandler = (value: string) => {
    form.setFieldsValue({ apiVersion: value })
  }
  const twitterApiVersion = [
    { label: 'v1.1 (media supported)', value: '1.1' },
    { label: 'v2.0 (media unsupported)', value: '2' }
  ]

  const onFinishHandler = async (values: CustomCredentialType) => {
    const customAppValues = { ...values, platform }
    const res = await createCustomApp(customAppValues)

    if (res?.code === 'SUCCESS') {
      form.resetFields()
      notification.success({
        description: res.data.message,
        message: `App successfully added!`
      })
    } else {
      if (res.data.errorField) {
        setErrorMsg(res.data.errorField)
      }
      notification.error({
        description: res.data.message,
        message: `App add failed`
      })
    }
  }

  const handleAppDelete = (id: number) => {
    deleteCustomApp(id)
  }

  return (
    <Row className="mt-4" gutter={[48, 0]} justify="center">
      <Col css={{ borderRight: '1px solid #B9B9B9' }} span={12}>
        <Form
          form={form}
          initialValues={{ redirectUri }}
          key={platform}
          layout="vertical"
          onFinish={onFinishHandler}
        >
          <Form.Item
            label={<Text strong>{__('Homepage URI')}</Text>}
            name="homepageUri"
            rules={[{ message: 'Please enter homepage url' }]}
          >
            <Space.Compact className="w-100">
              <Input
                defaultValue={`${homepageUri}`}
                ref={uriInput}
                style={{ width: 'calc(100% - 32px)' }}
              />
              <Button
                icon={<LuCopy size={12} />}
                onClick={() => handleCopyText(homepageUri)}
                title={__('Click to copy')}
              />
            </Space.Compact>
          </Form.Item>
          <Form.Item
            label={<Text strong>{__('Redirect URI')}</Text>}
            name="redirectUri"
            rules={[{ message: 'Please enter redirect url', required: true }]}
          >
            <Space.Compact className="w-100">
              <Input
                defaultValue={`${redirectUri}`}
                ref={uriInput}
                style={{ width: 'calc(100% - 32px)' }}
              />

              <Button
                icon={<LuCopy size={12} />}
                onClick={() => handleCopyText(redirectUri)}
                title={__('Click to copy')}
              />
            </Space.Compact>
          </Form.Item>

          {requiredField(platform, 'apiVersion') ? (
            <Form.Item
              label={<Text strong>{__('Api Version')}</Text>}
              name="apiVersion"
              rules={[{ message: 'Please select an API version', required: true }]}
            >
              <Select onChange={apiVersionChangeHandler} options={twitterApiVersion} />
            </Form.Item>
          ) : (
            ''
          )}

          {requiredField(platform, 'appName') ? (
            <Form.Item
              label={<Text strong>{__('App Name')}</Text>}
              name="appName"
              rules={[{ message: 'Please enter your app name', required: true }]}
            >
              <Input />
              {errorMsg.appName && (
                <Typography.Text type="danger">{errorMsg.appName?.[0]}</Typography.Text>
              )}
            </Form.Item>
          ) : (
            ''
          )}

          <Space className="pb-2">
            <DeveloperInfo platform={platform} />
          </Space>

          <Form.Item
            label={<Text strong>{__('App Key or Client ID')}</Text>}
            name="appKey"
            rules={[{ message: 'Please enter your app key', required: true }]}
          >
            <Input />
            {errorMsg.appKey && <Typography.Text type="danger">{errorMsg.appKey?.[0]}</Typography.Text>}
          </Form.Item>
          <Form.Item
            label={<Text strong>{__('App Secret or Client Secret')}</Text>}
            name="appSecret"
            rules={[{ message: 'Please enter your app secret', required: true }]}
          >
            <Input />
            {errorMsg.appSecret && (
              <Typography.Text type="danger">{errorMsg.appSecret?.[0]}</Typography.Text>
            )}
          </Form.Item>

          <Form.Item>
            <Button
              className="w-100"
              loading={isLoadingCreateCustomApp}
              onClick={() => {
                form.submit()
              }}
              size="large"
              type="primary"
            >
              {__('Add')}
            </Button>
          </Form.Item>
        </Form>
      </Col>
      <Col span={12}>
        <Title level={5}>{__('Connected Apps')}</Title>
        <Space direction="vertical">
          {customApps && customApps.length ? (
            customApps.map((app: CustomAppType) => (
              <AppCard
                appId={app.id}
                closeConnectModal={closeConnectModal}
                credential={app.credential}
                handleAuthCallback={handleAuthCallback}
                handleDelete={() => handleAppDelete(app.id)}
                isDeleteLoading={isLoadingDeleteCustomApp}
                key={app.id}
                name={app.name}
                platform={platform}
                setCustomModalOpen={setCustomModalOpen}
              />
            ))
          ) : (
            <Text>{__('No App Found')}</Text>
          )}
        </Space>
      </Col>
    </Row>
  )
}
