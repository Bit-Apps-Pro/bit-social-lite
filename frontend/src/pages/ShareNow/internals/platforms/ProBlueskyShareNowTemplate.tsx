import $shareNowData from '@common/globalStates/$shareNowData'
import { __ } from '@common/helpers/i18nWrap'
import { propertiesToUploadFile } from '@pages/ShareNow/helpers/postBoxHelper'
import ShareNowPostTypeCheckBox from '@pages/ShareNow/internals/platforms/ShareNowPostTypeCheckBox'
import { type Attachment, type ShareNowType } from '@pages/ShareNow/ShareNowType'
import platformsLimitations from '@rootConfig/platformsLimitations.json'
import {
  Button,
  Card,
  Form,
  Input,
  Space,
  Tooltip,
  Upload,
  type UploadFile,
  type UploadProps
} from 'antd'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { type ChangeEvent } from 'react'
import { LuUpload } from 'react-icons/lu'

export default function ProBlueskyShareNowTemplate() {
  const [shareNowData, setShareNowData] = useAtom($shareNowData)

  const postCheckBoxType = ['isLinkCard', 'isAllImages']

  const handleTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setShareNowData((prevSchedule: ShareNowType) =>
      produce(prevSchedule, draftSchedule => {
        draftSchedule.templates.bluesky.content = e.target.value
      })
    )
  }

  const handleCheckBox = (name: 'isAllImages' | 'isLinkCard', value: boolean) => {
    setShareNowData((prevSchedule: ShareNowType) =>
      produce(prevSchedule, draftSchedule => {
        draftSchedule.templates.bluesky.isLinkCard = false
        draftSchedule.templates.bluesky.isAllImages = false

        draftSchedule.templates.bluesky[name] = value
      })
    )
  }

  const handleLink = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    setShareNowData((prev: ShareNowType) =>
      produce(prev, draft => {
        draft.templates.bluesky.link = value
      })
    )
  }

  const handleChange: UploadProps['onChange'] = ({ fileList }) => {
    const currentState = produce(shareNowData, draft => {
      draft.templates.bluesky.media = fileList
    })

    setShareNowData(currentState)
  }

  const handleComment = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target

    setShareNowData((prev: ShareNowType) =>
      produce(prev, draft => {
        draft.templates.bluesky.comment = value
      })
    )
  }

  const setWpMedia = () => {
    const wpMediaLibrary = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp']

    if (typeof wp !== 'undefined' && wp.media) {
      const imgSelectionFrame = wp.media({
        button: { text: 'Select Image' },
        library: { type: wpMediaLibrary },
        multiple: 'add',
        title: __('Media')
      })

      const previousSelection = shareNowData.templates.bluesky.media.map(mediaFile => mediaFile.uid)
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

        if (selections.length > 4) {
          alert('You can only select up to 4 images.')
          return
        }
        let fileList: UploadFile[] = []

        fileList = selections.map((selection: Attachment) => propertiesToUploadFile(selection))

        const file = fileList.at(-1) || ({} as UploadFile)

        handleChange({ file, fileList })
      })

      imgSelectionFrame.open()
    }
  }

  return (
    <Card>
      <Form layout="vertical">
        <Form.Item htmlFor="textBox" label={__('Post')}>
          <Input.TextArea
            id="textBox"
            maxLength={platformsLimitations.bluesky.content.length}
            onChange={e => handleTextArea(e)}
            placeholder={__('Write your custom post')}
            showCount
            style={{ height: 120, resize: 'none' }}
            value={shareNowData.templates.bluesky.content}
          />
        </Form.Item>

        <Form.Item htmlFor="textBox" label={__('First comment')}>
          <Input.TextArea
            id="comment"
            maxLength={platformsLimitations.bluesky.comment.length}
            onChange={e => handleComment(e)}
            placeholder={__('Make comment')}
            rows={2}
            showCount
            value={shareNowData.templates.bluesky.comment}
          />
        </Form.Item>

        <Space className="py-2">
          <ShareNowPostTypeCheckBox
            handleCheckBox={handleCheckBox}
            templateData={shareNowData.templates.bluesky}
            type={postCheckBoxType}
          />
        </Space>

        {shareNowData.templates.bluesky?.isLinkCard && (
          <Form.Item htmlFor="link" label={__('Link')}>
            <Input
              id="link"
              onChange={e => handleLink(e)}
              placeholder={__('https://example.com')}
              value={shareNowData.templates.bluesky.link}
            />
          </Form.Item>
        )}

        {!shareNowData.templates.bluesky?.isLinkCard && shareNowData.templates.bluesky?.isAllImages && (
          <Upload
            fileList={shareNowData.templates.bluesky.media}
            listType="picture-card"
            onChange={handleChange}
            openFileDialogOnClick={false}
          >
            <Tooltip placement="right" title={__('Add Image')}>
              <Button onClick={setWpMedia} style={{ height: '100%', width: '100%' }}>
                <Space direction="vertical">
                  <LuUpload size={20} />
                  {__('Upload')}
                </Space>
              </Button>
            </Tooltip>
          </Upload>
        )}
      </Form>
    </Card>
  )
}
