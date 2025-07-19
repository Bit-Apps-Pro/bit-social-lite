import $socialTemplates from '@common/globalStates/socialTemplates/$socialTemplates'
import { type SocialTemplates } from '@common/globalStates/socialTemplates/SocialTemplatesType'
import { __ } from '@common/helpers/i18nWrap'
import { autoSaveNotify } from '@common/helpers/toastMessage'
import useMemoDebounce from '@common/hooks/useMemoDebounce'
import useUpdateSocialTemplates from '@pages/SocialTemplates/data/useUpdateSocialTemplates'
import PreviewDummy from '@pages/SocialTemplates/internals/preview/PreviewDummy'
import TemplateDocLink from '@pages/SocialTemplates/ui/TemplateDocLink'
import platformsLimitations from '@rootConfig/platformsLimitations.json'
import MessageBox from '@utilities/MessageBox'
import { Card, Col, Flex, message, Row, Select, Switch, theme, Typography } from 'antd'
import { produce } from 'immer'
import { useAtom } from 'jotai'

const { Title } = Typography

export default function ProInstagramSettings() {
  const { token } = theme.useToken()

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

  const handleChange: KeyedValueHandler<SocialTemplates['instagram']> = (key, val) => {
    setTemplates(prev =>
      produce(prev, draft => {
        draft.instagram[key] = val
      })
    )
  }

  const postingTypeOptions = [
    { label: __('Feature image'), value: 'isFeaturedImage' },
    {
      label: __('Product Image'),
      value: 'isProductImage'
    },
    { label: __('All images'), value: 'isAllImages' }
  ]

  return (
    <Card style={{ backgroundColor: token.colorFillAlter }}>
      {contextHolder}
      <Row gutter={20}>
        <Col span={14}>
          <Title level={4}>{__('Instagram Template Settings')} </Title>
          <TemplateDocLink platform="Instagram" />

          <Card>
            <Card.Meta description={__('Custom message settings.')} title={__('Custom Message')} />
            <div>
              <MessageBox
                onChange={val => handleChange('content', val)}
                rows={5}
                style={{ minWidth: 200 }}
                value={templates.instagram.content}
                wordCount={platformsLimitations.instagram.description.length}
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
                  value={templates.instagram.postingType}
                />
              </div>
            </Flex>

            <div className="pt-2">
              <Typography.Text type="secondary">
                {__(
                  'Instagram media images must be 1.91:1 to 4:5 aspect ratio, 320-1440px resolution (recommended 1080px), and under 8MB.'
                )}
              </Typography.Text>
            </div>
          </Card>

          <Card style={{ marginTop: 10 }}>
            <Card.Meta description={__('Your comment')} title={__('First comment')} />
            <div>
              <MessageBox
                onChange={val => handleChange('comment', val)}
                rows={1}
                style={{ minWidth: 200 }}
                value={templates.instagram.comment}
                wordCount={platformsLimitations.instagram.comment.length}
              />
            </div>
          </Card>

          <Card style={{ marginTop: 10 }}>
            <Flex gap={20} justify="space-between">
              <Card.Meta
                description={`Instagram restricts the length of a post to ${platformsLimitations.instagram.description.length} characters. If you enable this option, the first ${platformsLimitations.instagram.description.length} characters of your personalized message will be shared; if not, the limit prevents the post from being shared.`}
                title={__('Trim Message')}
              />
              <div>
                <Switch
                  checked={templates.instagram.trimMessage}
                  onChange={val => handleChange('trimMessage', val)}
                />
              </div>
            </Flex>
          </Card>
        </Col>

        <Col span={10}>
          <PreviewDummy />
        </Col>
      </Row>
    </Card>
  )
}
