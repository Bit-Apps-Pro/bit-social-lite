import { $appConfig } from '@common/globalStates'
import { $isBuyProModalOpen } from '@common/globalStates/$buyPro'
import $socialTemplates from '@common/globalStates/socialTemplates/$socialTemplates'
import { type SocialTemplates } from '@common/globalStates/socialTemplates/SocialTemplatesType'
import { __ } from '@common/helpers/i18nWrap'
import { autoSaveNotify } from '@common/helpers/toastMessage'
import useMemoDebounce from '@common/hooks/useMemoDebounce'
import MessageBox from '@utilities/MessageBox'
import { Card, Col, Flex, message, Row, Select, Space, Switch, theme, Typography } from 'antd'
import { produce } from 'immer'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { LuCrown } from 'react-icons/lu'

import platformsLimitations from '../../../../../config/platformsLimitations.json'
import useUpdateSocialTemplates from '../data/useUpdateSocialTemplates'
import { isProPostingOption } from '../helpers/optionsHelper'
import TemplateDocLink from '../ui/TemplateDocLink'
import PreviewDummy from './preview/PreviewDummy'

const { Title } = Typography

export default function LinkedinSettings() {
  const { token } = theme.useToken()
  const { isProClient } = useAtomValue($appConfig)
  const setProModalOpen = useSetAtom($isBuyProModalOpen)

  const [templates, setTemplates] = useAtom($socialTemplates)
  const { isTemplatesUpdateSuccessfully, updateSocialTemplates } = useUpdateSocialTemplates()
  const [messageApi, contextHolder] = message.useMessage()

  useMemoDebounce(
    async () => {
      const { status } = await updateSocialTemplates(templates)
      if (isTemplatesUpdateSuccessfully && status) autoSaveNotify(messageApi, status)
    },
    400,
    [templates]
  )

  const handleChange: KeyedValueHandler<SocialTemplates['linkedin']> = (key, val) => {
    if (typeof val === 'string' && isProPostingOption(key, val)) {
      setProModalOpen(true)
      return
    }

    setTemplates(prev =>
      produce(prev, draft => {
        // Clear promptImage if changing postingType away from isPromptImage
        if (
          key === 'postingType' &&
          prev.linkedin.postingType === 'isPromptImage' &&
          val !== 'isPromptImage'
        ) {
          draft.linkedin.promptImage = ''
        }
        draft.linkedin[key] = val
      })
    )
  }

  const postingTypeOptions = [
    { label: __('Only custom message'), value: 'onlyMessage' },
    { label: __('Link card'), value: 'isLinkCard' },
    { label: __('Feature image'), value: 'isFeaturedImage' },
    {
      label: (
        <Space align="center">
          {__('Product Image')}
          {!isProClient && <LuCrown color="#ff8609" size={20} />}
        </Space>
      ),
      value: 'isProductImage'
    },
    {
      label: (
        <Space align="center">
          {__('All Images')}
          {!isProClient && <LuCrown color="#ff8609" size={20} />}
        </Space>
      ),
      value: 'isAllImages'
    },
    {
      label: (
        <Space align="center">
          {__('Prompt Image')}
          {!isProClient && <LuCrown color="#ff8609" size={20} />}
        </Space>
      ),
      value: 'isPromptImage'
    }
  ]

  return (
    <>
      {contextHolder}
      <Row gutter={20}>
        <Col span={14}>
          <Card size="small" style={{ backgroundColor: token.colorFillAlter }}>
            <Title level={4}> {__('Linkedin Template Settings')} </Title>
            <TemplateDocLink platform="Linkedin" />

            <Card>
              <Card.Meta description={__('Custom message settings.')} title={__('Custom Message')} />
              <div>
                <MessageBox
                  onChange={val => handleChange('content', val)}
                  rows={5}
                  style={{ minWidth: 200 }}
                  value={templates.linkedin.content}
                />
              </div>
            </Card>
            <Card style={{ marginTop: 10 }}>
              <Flex gap={20} justify="space-between">
                <Card.Meta description={__('Post styling and type setup.')} title={__('Posting type')} />
                <div>
                  <Select
                    onChange={val => handleChange('postingType', val)}
                    options={postingTypeOptions}
                    style={{ minWidth: 200 }}
                    value={templates.linkedin.postingType}
                  />
                </div>
              </Flex>
            </Card>

            {templates.linkedin.postingType === 'isPromptImage' && (
              <Card style={{ marginTop: 10 }}>
                <Flex gap={20} justify="space-between">
                  <Card.Meta
                    description={__('Select an AI prompt for image generation.')}
                    title={__('Prompt Name')}
                  />
                </Flex>
              </Card>
            )}

            <Card style={{ marginTop: 10 }}>
              <Flex gap={20} justify="space-between">
                <Card.Meta
                  description={`LinkedIn restricts the length of a post to ${platformsLimitations.linkedin.description.length} characters. If you enable this option, the first ${platformsLimitations.linkedin.description.length} characters of your personalized message will be shared; if not, the limit prevents the post from being shared.`}
                  title={__('Trim Message')}
                />
                <div>
                  <Switch
                    checked={templates.linkedin.trimMessage}
                    onChange={val => handleChange('trimMessage', val)}
                  />
                </div>
              </Flex>
            </Card>
          </Card>
        </Col>
        <Col span={10}>
          <PreviewDummy />
        </Col>
      </Row>
    </>
  )
}
