import { $isBuyProModalOpen } from '@common/globalStates/$buyPro'
import $socialTemplates from '@common/globalStates/socialTemplates/$socialTemplates'
import { __ } from '@common/helpers/i18nWrap'
import platformsLimitations from '@rootConfig/platformsLimitations.json'
import MessageBox from '@utilities/MessageBox'
import { Card, Col, Flex, Row, Select, Switch, theme, Typography } from 'antd'
import { useAtomValue, useSetAtom } from 'jotai'

import TemplateDocLink from '../ui/TemplateDocLink'
import PreviewDummy from './preview/PreviewDummy'

const { Title } = Typography

export default function InstagramSettings() {
  const { token } = theme.useToken()

  const templates = useAtomValue($socialTemplates)

  const setProModalOpen = useSetAtom($isBuyProModalOpen)

  const handleChange = () => {
    setProModalOpen(true)
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
    <Row gutter={20}>
      <Col span={14}>
        <Card size="small" style={{ backgroundColor: token.colorFillAlter }}>
          <Title level={4}> {__('Instagram Template Settings')} </Title>
          <TemplateDocLink platform="Instagram" />

          <Card>
            <Card.Meta description={__('Custom message settings.')} title={__('Custom Message')} />
            <div>
              <MessageBox
                onChange={handleChange}
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
                  onChange={handleChange}
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
                onChange={handleChange}
                rows={2}
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
                <Switch checked={templates.instagram.trimMessage} onChange={handleChange} />
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
