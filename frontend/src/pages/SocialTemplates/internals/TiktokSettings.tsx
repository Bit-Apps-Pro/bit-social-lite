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

export default function TiktokSettings() {
  const { token } = theme.useToken()

  const templates = useAtomValue($socialTemplates)

  const setProModalOpen = useSetAtom($isBuyProModalOpen)

  const handleChange = () => {
    setProModalOpen(true)
  }

  const postingTypeOptions = [
    {
      label: __('Only Message'),
      value: 'onlyMessage'
    }
  ]

  const privacyOptions = [
    {
      label: __('PUBLIC TO EVERYONE'),
      value: 'PUBLIC_TO_EVERYONE'
    },
    {
      label: __('MUTUAL FOLLOW FRIENDS'),
      value: 'MUTUAL_FOLLOW_FRIENDS'
    },
    {
      label: __('FOLLOWER OF CREATOR'),
      value: 'FOLLOWER_OF_CREATOR'
    },
    {
      label: __('SELF ONLY'),
      value: 'SELF_ONLY'
    }
  ]

  return (
    <Row gutter={20}>
      <Col span={14}>
        <Card size="small" style={{ backgroundColor: token.colorFillAlter }}>
          <Title level={4}> {__('Tiktok Template Settings')} </Title>
          <TemplateDocLink platform="Tiktok" />

          <Card>
            <Card.Meta description={__('Custom message settings.')} title={__('Custom Message')} />
            <div>
              <MessageBox
                onChange={handleChange}
                rows={5}
                style={{ minWidth: 200 }}
                value={templates.tiktok.content}
                wordCount={platformsLimitations.tiktok.description.length}
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
                  value={templates.tiktok.postingType}
                />
              </div>
            </Flex>
          </Card>

          <Card style={{ marginTop: 10 }}>
            <Flex gap={20} justify="space-between">
              <Card.Meta description={__('Who can see your post')} title={__('Privacy settings')} />
              <div>
                <Select
                  onChange={handleChange}
                  options={privacyOptions}
                  style={{ minWidth: 200 }}
                  value={templates.tiktok.privacyLevel}
                />
              </div>
            </Flex>
          </Card>

          <Card style={{ marginTop: 10 }}>
            <Flex gap={20} justify="space-between">
              <Card.Meta
                description={__(
                  'Turn this on to let viewers share feedback or engage with your post through comments.'
                )}
                title={__('Allow comments')}
              />
              <div>
                <Switch checked={templates.tiktok.allowComment} onChange={handleChange} />
              </div>
            </Flex>
          </Card>

          <Card style={{ marginTop: 10 }}>
            <Flex gap={20} justify="space-between">
              <Card.Meta
                description={__(
                  'Enable this to let others create side-by-side reaction or collaboration videos with your post'
                )}
                title={__('Allow Duet')}
              />
              <div>
                <Switch checked={templates.tiktok.duet} onChange={handleChange} />
              </div>
            </Flex>
          </Card>

          <Card style={{ marginTop: 10 }}>
            <Flex gap={20} justify="space-between">
              <Card.Meta
                description={__(
                  'Allow others to clip up to 5 seconds of your post for their own content'
                )}
                title={__('Allow Stitch')}
              />
              <div>
                <Switch checked={templates.tiktok.stitch} onChange={handleChange} />
              </div>
            </Flex>
          </Card>

          <Card style={{ marginTop: 10 }}>
            <Flex gap={20} justify="space-between">
              <Card.Meta
                description={`Tiktok restricts the length of a post to ${platformsLimitations.tiktok.description.length} characters. If you enable this option, the first ${platformsLimitations.tiktok.description.length} characters of your personalized message will be shared; if not, the limit prevents the post from being shared.`}
                title={__('Trim Message')}
              />
              <div>
                <Switch checked={templates.tiktok.trimMessage} onChange={handleChange} />
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
