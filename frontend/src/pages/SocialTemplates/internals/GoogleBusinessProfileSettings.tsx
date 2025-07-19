/* eslint-disable translate-obj-prop/translate-obj-prop */
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

export default function GoogleBusinessProfileSettings() {
  const { token } = theme.useToken()

  const templates = useAtomValue($socialTemplates)

  const setProModalOpen = useSetAtom($isBuyProModalOpen)

  const handleChange = () => {
    setProModalOpen(true)
  }

  const postingTypeOptions = [
    { label: __('Only custom message'), value: 'onlyMessage' },
    { label: __('Feature image'), value: 'isFeaturedImage' },
    {
      label: __('Product Image'),
      value: 'isProductImage'
    }
  ]

  const buttonOptions = [
    { label: 'No Button', value: 'none' },
    { label: 'SIGN UP', value: 'SIGN_UP' },
    { label: 'LEARN MORE', value: 'LEARN_MORE' },
    { label: 'SHOP', value: 'SHOP' },
    { label: 'ORDER', value: 'ORDER' },
    { label: 'BOOK', value: 'BOOK' }
  ]

  return (
    <Row gutter={20}>
      <Col span={14}>
        <Card size="small" style={{ backgroundColor: token.colorFillAlter }}>
          <Title level={4}> {__('Google Business Profile Template Settings')} </Title>
          <TemplateDocLink platform="Google Business Profile" />

          <Card>
            <Card.Meta description={__('Custom message settings.')} title={__('Custom Message')} />
            <div>
              <MessageBox
                onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                <Switch checked={templates.googleBusinessProfile.trimMessage} onChange={handleChange} />
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
