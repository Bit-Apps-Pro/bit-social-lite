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

export default function ProPinterestSettings() {
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

  const handleChange: KeyedValueHandler<SocialTemplates['pinterest']> = (key, val) => {
    setTemplates(prev =>
      produce(prev, draft => {
        draft.pinterest[key] = val
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
          <Title level={4}>{__('Pinterest Template Settings')}</Title>
          <TemplateDocLink platform="Pinterest" />

          <Card>
            <Card.Meta description={__('Custom message settings.')} title={__('Custom Message')} />
            <div>
              <MessageBox
                onChange={val => handleChange('content', val)}
                rows={5}
                style={{ minWidth: 200 }}
                value={templates.pinterest.content}
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
                  value={templates.pinterest.postingType}
                />
              </div>
            </Flex>
          </Card>

          <Card style={{ marginTop: 10 }}>
            <Flex gap={20} justify="space-between">
              <Card.Meta description={`Share the post link on Pinterest.`} title={__('Post link')} />
              <div>
                <Switch
                  checked={templates.pinterest.isLinkCard}
                  onChange={val => handleChange('isLinkCard', val)}
                />
              </div>
            </Flex>
          </Card>

          <Card style={{ marginTop: 10 }}>
            <Flex gap={20} justify="space-between">
              <Card.Meta
                description={`Pinterest restricts the length of a post to ${platformsLimitations.pinterest.description.length} characters. If you enable this option, the first ${platformsLimitations.pinterest.description.length} characters of your personalized message will be shared; if not, the limit prevents the post from being shared.`}
                title={__('Trim Message')}
              />
              <div>
                <Switch
                  checked={templates.pinterest.trimMessage}
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
