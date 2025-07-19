import { $isBuyProModalOpen } from '@common/globalStates/$buyPro'
import $socialTemplates from '@common/globalStates/socialTemplates/$socialTemplates'
import { __ } from '@common/helpers/i18nWrap'
import platformsLimitations from '@rootConfig/platformsLimitations.json'
import MessageBox from '@utilities/MessageBox'
import { Card, Col, Flex, Row, Select, Switch, theme, Typography } from 'antd'
import { useAtomValue, useSetAtom } from 'jotai'

import { postingTypeOptions } from '../helpers/optionsHelper'
import TemplateDocLink from '../ui/TemplateDocLink'
import PreviewDummy from './preview/PreviewDummy'

const { Title } = Typography

export default function BlueskySettings() {
  const { token } = theme.useToken()

  const templates = useAtomValue($socialTemplates)

  const setProModalOpen = useSetAtom($isBuyProModalOpen)

  const handleChange = () => {
    setProModalOpen(true)
  }

  return (
    <Row gutter={20}>
      <Col span={14}>
        <Card size="small" style={{ backgroundColor: token.colorFillAlter }}>
          <Title level={4}> {__('Bluesky Template Settings')} </Title>
          <TemplateDocLink platform="Bluesky" />

          <Card>
            <Card.Meta description={__('Custom message settings.')} title={__('Custom Message')} />
            <div>
              <MessageBox
                onChange={handleChange}
                rows={5}
                style={{ minWidth: 200 }}
                value={templates.bluesky.content}
                wordCount={platformsLimitations.bluesky.content.length}
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
                  value={templates.bluesky.postingType}
                />
              </div>
            </Flex>
          </Card>

          <Card style={{ marginTop: 10 }}>
            <Card.Meta description={__('Your comment')} title={__('First comment')} />
            <div>
              <MessageBox
                onChange={handleChange}
                rows={2}
                style={{ minWidth: 200 }}
                value={templates.bluesky.comment}
                wordCount={platformsLimitations.bluesky.comment.length}
              />
            </div>
          </Card>

          <Card style={{ marginTop: 10 }}>
            <Flex gap={20} justify="space-between">
              <Card.Meta
                description={`Bluesky restricts the length of a post to ${platformsLimitations.bluesky.content.length} characters. If you enable this option, the first ${platformsLimitations.bluesky.content.length} characters of your personalized message will be shared; if not, the limit prevents the post from being shared.`}
                title={__('Trim Message')}
              />
              <div>
                <Switch checked={templates.bluesky.trimMessage} onChange={handleChange} />
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
