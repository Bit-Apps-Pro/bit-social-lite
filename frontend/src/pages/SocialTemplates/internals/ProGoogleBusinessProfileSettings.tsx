/* eslint-disable translate-obj-prop/translate-obj-prop */
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

export const buttonOptions = [
  { label: 'No Button', value: 'none' },
  { label: 'SIGN UP', value: 'SIGN_UP' },
  { label: 'LEARN MORE', value: 'LEARN_MORE' },
  { label: 'SHOP', value: 'SHOP' },
  { label: 'ORDER', value: 'ORDER' },
  { label: 'BOOK', value: 'BOOK' }
]

export default function ProGoogleBusinessProfileSettings() {
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

  const handleChange: KeyedValueHandler<SocialTemplates['googleBusinessProfile']> = (key, val) => {
    setTemplates(prev =>
      produce(prev, draft => {
        draft.googleBusinessProfile[key] = val
      })
    )
  }

  const postingTypeOptions = [
    { label: __('Only custom message'), value: 'onlyMessage' },
    { label: __('Feature image'), value: 'isFeaturedImage' },
    {
      label: __('Product Image'),
      value: 'isProductImage'
    }
  ]

  return (
    <Row gutter={20}>
      {contextHolder}
      <Col span={14}>
        <Card size="small" style={{ backgroundColor: token.colorFillAlter }}>
          <Title level={4}> {__('Google Business Profile Template Settings')} </Title>
          <TemplateDocLink platform="Google Business Profile" />

          <Card>
            <Card.Meta description={__('Custom message settings.')} title={__('Custom Message')} />
            <div>
              <MessageBox
                onChange={val => handleChange('content', val)}
                rows={5}
                style={{ minWidth: 200 }}
                value={templates.googleBusinessProfile.content}
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
                  value={templates.googleBusinessProfile.postingType}
                />
              </div>
            </Flex>
          </Card>

          <Card style={{ marginTop: 10 }}>
            <Flex gap={20} justify="space-between">
              <Card.Meta description={__('Select a post link button.')} title={__('Add a button')} />
              <div>
                <Select
                  onChange={val => handleChange('button', val)}
                  options={buttonOptions}
                  style={{ minWidth: 200 }}
                  value={templates.googleBusinessProfile.button}
                />
              </div>
            </Flex>
          </Card>

          <Card style={{ marginTop: 10 }}>
            <Flex gap={20} justify="space-between">
              <Card.Meta
                // eslint-disable-next-line max-len
                description={`Google Business Profile restricts the length of a post to ${platformsLimitations.googleBusinessProfile.description.length} characters. If you enable this option, the first ${platformsLimitations.googleBusinessProfile.description.length} characters of your personalized message will be shared; if not, the limit prevents the post from being shared.`}
                title={__('Trim Message')}
              />
              <div>
                <Switch
                  checked={templates.googleBusinessProfile.trimMessage}
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
  )
}
