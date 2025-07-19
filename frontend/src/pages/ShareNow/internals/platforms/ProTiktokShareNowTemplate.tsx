import $shareNowData from '@common/globalStates/$shareNowData'
import { __ } from '@common/helpers/i18nWrap'
import { propertiesToUploadFile } from '@pages/ShareNow/helpers/postBoxHelper'
import {
  type Attachment,
  type ShareNowTemplatesType,
  type ShareNowType
} from '@pages/ShareNow/ShareNowType'
import useSocialTemplates from '@pages/SocialTemplates/data/useSocialTemplates'
import platformsLimitations from '@rootConfig/platformsLimitations.json'
import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Radio,
  Space,
  Tooltip,
  Upload,
  type UploadFile,
  type UploadProps
} from 'antd'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { type ChangeEvent, useEffect } from 'react'
import { LuUpload } from 'react-icons/lu'

export default function ProTiktokShareNowTemplate() {
  const [shareNowData, setShareNowData] = useAtom($shareNowData)

  const { socialTemplates } = useSocialTemplates()

  const changeState: KeyedValueHandler<ShareNowTemplatesType['tiktok']> = (name, value) => {
    setShareNowData((prev: ShareNowType) =>
      produce(prev, draft => {
        draft.templates.tiktok[name] = value
      })
    )
  }

  const handleTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setShareNowData((prevSchedule: ShareNowType) =>
      produce(prevSchedule, draftSchedule => {
        draftSchedule.templates.tiktok.content = e.target.value
      })
    )
  }

  const handleChange: UploadProps['onChange'] = ({ fileList }) => {
    const currentState = produce(shareNowData, draft => {
      draft.templates.tiktok.media = fileList
    })

    setShareNowData(currentState)
  }

  const setWpMedia = () => {
    const wpMediaLibrary = [
      'video/mp4',
      'video/quicktime',
      'video/ogg',
      'video/webm',
      'video/x-msvideo',
      'video/x-matroska'
    ]

    if (typeof wp !== 'undefined' && wp.media) {
      const imgSelectionFrame = wp.media({
        button: { text: 'Select video' },
        library: { type: wpMediaLibrary },
        title: __('Media')
      })

      const previousSelection = shareNowData.templates.tiktok.media.map(mediaFile => mediaFile.uid)
      imgSelectionFrame.on('open', () => {
        const selection = imgSelectionFrame.state().get('selection')

        previousSelection.forEach(imageId => {
          const attachment = wp.media.attachment(imageId)
          attachment.fetch().done(() => {
            selection.add(attachment)
          })
        })
      })

      imgSelectionFrame.on('select', () => {
        const selections = imgSelectionFrame.state().get('selection').toJSON()
        let fileList: UploadFile[] = []

        fileList = selections.map((selection: Attachment) => propertiesToUploadFile(selection))

        const file = fileList.at(-1) || ({} as UploadFile)

        handleChange({ file, fileList })
      })

      imgSelectionFrame.open()
    }
  }

  useEffect(() => {
    if (socialTemplates?.tiktok) {
      const { allowComment, duet, privacyLevel, stitch } = socialTemplates.tiktok
      setShareNowData((prev: ShareNowType) =>
        produce(prev, draft => {
          draft.templates.tiktok.allowComment = allowComment
          draft.templates.tiktok.duet = duet
          draft.templates.tiktok.privacyLevel = privacyLevel
          draft.templates.tiktok.stitch = stitch
        })
      )
    }
  }, [socialTemplates])

  return (
    <Card>
      <Form layout="vertical">
        <Form.Item htmlFor="textBox" label={__('Description')}>
          <Input.TextArea
            id="textBox"
            maxLength={platformsLimitations.tiktok.description.length}
            onChange={e => handleTextArea(e)}
            placeholder={__('Share more about your video here')}
            showCount
            style={{ height: 120, resize: 'none' }}
            value={shareNowData.templates.tiktok.content}
          />
        </Form.Item>

        <Form.Item htmlFor="textBox" label={__('Media')}>
          <Upload
            fileList={shareNowData.templates.tiktok.media}
            listType="picture-card"
            onChange={handleChange}
            openFileDialogOnClick={false}
          >
            <Tooltip placement="right" title={__('Add video')}>
              <Button onClick={setWpMedia} style={{ height: '100%', width: '100%' }}>
                <Space direction="vertical">
                  <LuUpload size={20} />
                  {__('Upload')}
                </Space>
              </Button>
            </Tooltip>
          </Upload>
        </Form.Item>

        <Form.Item htmlFor="textBox" label={__('Privacy settings')}>
          <Radio.Group
            onChange={e => changeState('privacyLevel', e.target.value)}
            options={[
              { label: __('Public to everyone'), value: 'PUBLIC_TO_EVERYONE' },
              { label: __('Mutual follow friends '), value: 'MUTUAL_FOLLOW_FRIENDS' },
              { label: __('Follower of creator'), value: 'FOLLOWER_OF_CREATOR' },
              { label: __('Self only'), value: 'SELF_ONLY' }
            ]}
            value={shareNowData.templates.tiktok.privacyLevel}
          />
        </Form.Item>

        <Form.Item htmlFor="textBox" label={__('Others')}>
          <Checkbox
            checked={shareNowData.templates.tiktok.allowComment}
            onChange={() => {
              changeState('allowComment', !shareNowData.templates.tiktok.allowComment)
            }}
          >
            {__('Allow Comment')}
          </Checkbox>
          <Checkbox
            checked={shareNowData.templates.tiktok.duet}
            onChange={() => {
              changeState('duet', !shareNowData.templates.tiktok.duet)
            }}
          >
            {__('Allow Duet')}
          </Checkbox>
          <Checkbox
            checked={shareNowData.templates.tiktok.stitch}
            onChange={() => {
              changeState('stitch', !shareNowData.templates.tiktok.stitch)
            }}
          >
            {__('Allow Stitch')}
          </Checkbox>
        </Form.Item>
      </Form>
    </Card>
  )
}
