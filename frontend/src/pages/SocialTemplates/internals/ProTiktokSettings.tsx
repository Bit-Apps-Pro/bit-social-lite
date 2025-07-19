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

export default function ProTiktokSettings() {
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

  const handleChange: KeyedValueHandler<SocialTemplates['tiktok']> = (key, val) => {
    setTemplates(prev =>
      produce(prev, draft => {
        draft.tiktok[key] = val
      })
    )
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
    <Card style={{ backgroundColor: token.colorFillAlter }}>
      {contextHolder}
      <Row gutter={20}>
        <Col span={14}>
          <Title level={4}>{__('Tiktok Template Settings')} </Title>
          <TemplateDocLink platform="Instagram" />

          <Card>
            <Card.Meta description={__('Custom message settings.')} title={__('Custom Message')} />
            <div>
              <MessageBox
                onChange={val => handleChange('content', val)}
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
                  onChange={val => handleChange('postingType', val)}
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
                  onChange={val => handleChange('privacyLevel', val)}
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
                <Switch
                  checked={templates.tiktok.allowComment}
                  onChange={val => handleChange('allowComment', val)}
                />
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
                <Switch checked={templates.tiktok.duet} onChange={val => handleChange('duet', val)} />
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
                <Switch
                  checked={templates.tiktok.stitch}
                  onChange={val => handleChange('stitch', val)}
                />
              </div>
            </Flex>
          </Card>

          <Card style={{ marginTop: 10 }}>
            <Flex gap={20} justify="space-between">
              <Card.Meta
                description={`Instagram restricts the length of a post to ${platformsLimitations.tiktok.description.length} characters. If you enable this option, the first ${platformsLimitations.tiktok.description.length} characters of your personalized message will be shared; if not, the limit prevents the post from being shared.`}
                title={__('Trim Message')}
              />
              <div>
                <Switch
                  checked={templates.tiktok.trimMessage}
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
