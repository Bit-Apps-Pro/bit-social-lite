import { $isBuyProModalOpen } from '@common/globalStates/$buyPro'
import $socialTemplates from '@common/globalStates/socialTemplates/$socialTemplates'
import { __ } from '@common/helpers/i18nWrap'
import MessageBox from '@utilities/MessageBox'
import { Card, Col, Flex, Row, Select, Switch, theme, Typography } from 'antd'
import { useAtomValue, useSetAtom } from 'jotai'

import platformsLimitations from '../../../../../config/platformsLimitations.json'
import TemplateDocLink from '../ui/TemplateDocLink'
import PreviewDummy from './preview/PreviewDummy'

const { Title } = Typography

export default function PinterestSettings() {
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
          <Title level={4}> {__('Pinterest Template Settings')} </Title>
          <TemplateDocLink platform="Pinterest" />

          <Card>
            <Card.Meta description={__('Custom message settings.')} title={__('Custom Message')} />
            <div>
              <MessageBox
                onChange={handleChange}
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
                  onChange={handleChange}
                  options={postingTypeOptions}
                  style={{ minWidth: 200 }}
                  value={templates.pinterest.postingType}
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
                <Switch checked={templates.pinterest.trimMessage} onChange={handleChange} />
              </div>
            </Flex>
          </Card>

          <Card style={{ marginTop: 10 }}>
            <Flex gap={20} justify="space-between">
              <Card.Meta description={`Share the post link on Pinterest.`} title={__('Post link')} />
              <div>
                <Switch checked={templates.pinterest.isLinkCard} onChange={handleChange} />
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
