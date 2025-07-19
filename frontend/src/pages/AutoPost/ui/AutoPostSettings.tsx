import { $appConfig } from '@common/globalStates'
import $autoPostSettings, { type AccountsType } from '@common/globalStates/$autoPostSettings'
import { $isBuyProModalOpen } from '@common/globalStates/$buyPro'
import { __ } from '@common/helpers/i18nWrap'
import { autoSaveNotify } from '@common/helpers/toastMessage'
import useMemoDebounce from '@common/hooks/useMemoDebounce'
import usePostTypes from '@hooks/queries/schedule/usePostTypes'
import ConnectAccount from '@pages/Accounts/ConnectAccount'
import useAccounts from '@pages/Accounts/data/useAccounts'
import AccountEmpty from '@pages/Accounts/internals/AccountEmpty'
import useIntervalTypes from '@pages/Schedules/data/useIntervalTypes'
import {
  Card,
  Col,
  Flex,
  Input,
  message,
  notification,
  Row,
  Select,
  Space,
  Switch,
  theme,
  Typography
} from 'antd'
import { produce } from 'immer'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { LuCrown, LuMoveUpRight } from 'react-icons/lu'

import useAutoPostSettings from '../data/useAutoPostSettings'
import useUpdateAutoPostSettings from '../data/useUpdateAutoPostSettings'
import { DELAY_TYPE_IMMEDIATELY, formatPostDelayInput } from '../helper/delayTypeFormat'
import AccountTree from './AccountTree'
import TemplateBox from './TemplateBox'

const { Link, Paragraph, Text, Title } = Typography

export default function AutoPost() {
  const { token } = theme.useToken()
  const [autoPostSettings, setAutoPostSettings] = useAtom($autoPostSettings)
  const { isSettingsUpdateSuccessfully, isUpdatingAutoPostSettings, updateAutoPostSettings } =
    useUpdateAutoPostSettings()
  const { isLoadingAutoPostSettings } = useAutoPostSettings()
  const [messageApi, contextHolder] = message.useMessage()
  const { accounts } = useAccounts()
  const { isProClient } = useAtomValue($appConfig)
  const setProModalOpen = useSetAtom($isBuyProModalOpen)
  const intervalTypes = useIntervalTypes()
  const { loadingPostType, postTypes } = usePostTypes()

  const postTypeOptions =
    postTypes &&
    Object.values<{ label: string; name: string }>(postTypes).map(postType => ({
      label: (
        <>
          {postType.label}{' '}
          {postType.name !== 'post' && !isProClient && <LuCrown color="#ff8609" size={16} />}
        </>
      ),
      value: postType.name
    }))

  useMemoDebounce(
    async () => {
      const { status } = await updateAutoPostSettings(autoPostSettings)
      if (isSettingsUpdateSuccessfully && status) autoSaveNotify(messageApi, status)
    },
    400,
    [autoPostSettings]
  )

  const handleChange = <T,>(key: keyof typeof autoPostSettings, val: T) => {
    const { accounts: allAccounts, isEnabled } = autoPostSettings

    const noAccounts = !allAccounts.accountIds.length

    if (key === 'isEnabled' && noAccounts && !isEnabled) {
      notification.warning({
        message: `Create and select an account first!`,
        placement: 'topRight'
      })

      return
    }

    if (!isProClient && key === 'postType' && Array.isArray(val) && val.length && val.includes('post')) {
      setProModalOpen(true)
      return
    }

    if (key === 'postType' && Array.isArray(val) && !val.length) {
      setAutoPostSettings(prev =>
        produce(prev, draft => {
          draft.postType = ['post']
        })
      )
      messageApi.open({
        content: 'You must have a type',
        type: 'warning'
      })
      return
    }

    if (!isProClient && key === 'postDelay' && val !== DELAY_TYPE_IMMEDIATELY) {
      setProModalOpen(true)
      return
    }

    if (key === 'postDelay') {
      setAutoPostSettings(prev =>
        produce(prev, draft => {
          draft.postDelay =
            val === 'delay'
              ? {
                  every: 1,
                  unit: 'minute'
                }
              : {
                  every: 0,
                  unit: ''
                }
        })
      )
      return
    }

    setAutoPostSettings(prev => ({ ...prev, [key]: val }))
  }

  const setAccountIds = (selectedAccount: AccountsType) => {
    handleChange('accounts', selectedAccount)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    setAutoPostSettings(prev =>
      produce(prev, draft => {
        draft.postDelay.every = Number(value)
      })
    )
  }

  const handlePostDelayUnit = (value: string) => {
    setAutoPostSettings(prev =>
      produce(prev, draft => {
        if (value !== '' && autoPostSettings.postDelay.every < 1) {
          draft.postDelay.every = 1
        }
        if (value === '') {
          draft.postDelay.every = 0
        }

        draft.postDelay.unit = value
      })
    )
  }

  const postDelayTypes = [
    { label: __('Immediately'), value: 'immediately' },

    {
      label: (
        <>
          {__('Delay')} {!isProClient && <LuCrown color="#ff8609" size={16} />}
        </>
      ),
      value: 'delay'
    }
  ]

  return (
    <Row gutter={20}>
      {contextHolder}
      <Col span={6}>
        <Flex className="mb-1" justify="space-between">
          <Typography.Title level={5}>{__('Accounts')}</Typography.Title>
          {accounts.length ? <ConnectAccount /> : ''}
        </Flex>

        {accounts.length ? (
          <AccountTree
            isLoading={isUpdatingAutoPostSettings}
            selectedAccount={autoPostSettings.accounts}
            setSelectedAccount={setAccountIds}
          />
        ) : (
          <>
            <AccountEmpty iconSize={40} textLevel={5} />
            <div style={{ textAlign: 'center' }}>
              <ConnectAccount />
            </div>
          </>
        )}
      </Col>
      <Col span={12}>
        <Card style={{ backgroundColor: token.colorFillAlter }}>
          <Title level={4}>{__('Auto Post Settings')}</Title>
          <Paragraph>
            {__('All auto post related settings here.')}
            <Link
              className="pl-2"
              href="https://bit-social.com/docs/auto-publish-wordpress-posts-on-social-media/"
              rel="noopener noreferrer nofollow"
              target="_blank"
              underline
            >
              {__('Doc here')}
              <LuMoveUpRight size={12} style={{ transform: 'translateY(-2px)' }} />
            </Link>
          </Paragraph>

          <Card style={{ marginTop: 10 }}>
            <Flex gap={50} justify="space-between">
              <Card.Meta
                description={__(
                  'When you publish a new wordpress post, the plugin shares the post on all active social accounts automatically.'
                )}
                title={__('Share posts automatically')}
              />

              <div>
                <Switch
                  checked={autoPostSettings.isEnabled}
                  disabled={isLoadingAutoPostSettings}
                  onChange={val => handleChange('isEnabled', val)}
                />
              </div>
            </Flex>
            <Space className="pt-2">
              <Text mark>
                {__('You have to create and select account first to enable this option!')}
              </Text>
            </Space>
          </Card>

          <Card style={{ marginTop: 10 }}>
            <Flex gap={50} justify="space-between">
              <Card.Meta
                description={__(
                  'Automatically share specific post types, like blogs or products, to your social accounts when published.'
                )}
                title={__('Share posts type')}
              />

              <div>
                <Select
                  allowClear
                  loading={isLoadingAutoPostSettings || loadingPostType}
                  mode="multiple"
                  onChange={val => handleChange('postType', val)}
                  options={postTypeOptions}
                  placeholder={__('Post Type: Post')}
                  style={{ minWidth: '150px' }}
                  value={autoPostSettings.postType}
                />
              </div>
            </Flex>
            <Space className="pt-2">
              <Text mark>
                <span dangerouslySetInnerHTML={{ __html: __('Share posts default type <b>Post</b>') }} />
              </Text>
            </Space>
          </Card>

          <Card style={{ marginTop: 10 }}>
            <Flex gap={50} justify="space-between">
              <Card.Meta
                description={__(
                  'Optimize your sharing strategy with flexible timing options: use the dropdown menu to select when your posts will be shared after publishing'
                )}
                title={__('Share post delay')}
              />

              <Flex gap={20} vertical>
                <Space>
                  <Select
                    css={{ minWidth: 180 }}
                    onChange={val => handleChange('postDelay', val)}
                    options={postDelayTypes}
                    value={formatPostDelayInput(autoPostSettings.postDelay)}
                  />
                </Space>

                {formatPostDelayInput(autoPostSettings.postDelay) === 'delay' && (
                  <Space className="w-100">
                    <Input
                      css={{ width: 80 }}
                      min={1}
                      onChange={handleInputChange}
                      type="number"
                      value={autoPostSettings.postDelay.every}
                    />
                    <Select
                      css={{ minWidth: 100 }}
                      onChange={handlePostDelayUnit}
                      options={intervalTypes}
                      value={autoPostSettings.postDelay.unit}
                    />
                  </Space>
                )}
              </Flex>
            </Flex>
          </Card>

          <Card style={{ marginTop: 10 }}>
            <Flex gap={50} justify="space-between">
              <Card.Meta
                description={__(
                  "If you don't want to keep the shared post logs, you need to disable the option. Disabling the option prevents you view your insights and you might encounter duplicate posts when you use the schedule module."
                )}
                title={__('Enable auto post log')}
              />
              <div>
                <Switch
                  checked={autoPostSettings.keepLogs}
                  disabled={isLoadingAutoPostSettings}
                  onChange={val => handleChange('keepLogs', val)}
                />
              </div>
            </Flex>
            <Space className="pt-2">
              <Text mark>
                {__('You have to create and select account first to enable this option!')}
              </Text>
            </Space>
          </Card>

          {/* TODO: feature not ready */}
          {/* 
      <Card style={{ marginTop: 10 }}>
      <Flex justify="space-between" gap={50}>
      <Card.Meta
      title="Taxonomies as hashtags"
      description="Select taxonomies that you want to share as social network hashtags. Adding the {terms} keyword to the custom message section will share selected terms as hashtags."
      />
      <div>
      <Select
      disabled={isLoadingAutoPostSettings}
      style={{ width: 180 }}
      allowClear
      mode="multiple"
      options={taxonomiesOptions}
      value={autoPostSettings.taxonomies}
      onChange={val => handleChange('taxonomies', val)}
      />
      </div>
      </Flex>
    </Card> */}
        </Card>
      </Col>
      <Col span={6}>
        <TemplateBox />
      </Col>
    </Row>
  )
}
