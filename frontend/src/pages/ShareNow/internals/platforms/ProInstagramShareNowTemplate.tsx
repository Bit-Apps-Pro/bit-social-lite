import $shareNowData from '@common/globalStates/$shareNowData'
import { __ } from '@common/helpers/i18nWrap'
import { propertiesToUploadFile } from '@pages/ShareNow/helpers/postBoxHelper'
import { type Attachment, type ShareNowType } from '@pages/ShareNow/ShareNowType'
import platformsLimitations from '@rootConfig/platformsLimitations.json'
import {
  Alert,
  Button,
  Card,
  Checkbox,
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

export default function ProInstagramShareNowTemplate() {
  const [shareNowData, setShareNowData] = useAtom($shareNowData)

  const handleTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setShareNowData((prevSchedule: ShareNowType) =>
      produce(prevSchedule, draftSchedule => {
        draftSchedule.templates.instagram.content = e.target.value
      })
    )
  }

  const handleCheckBox = (value: boolean) => {
    setShareNowData((prevSchedule: ShareNowType) =>
      produce(prevSchedule, draftSchedule => {
        draftSchedule.templates.instagram.isAllImages = value
      })
    )
  }

  const handleChange: UploadProps['onChange'] = ({ fileList }) => {
    const currentState = produce(shareNowData, draft => {
      draft.templates.instagram.media = fileList
    })

    setShareNowData(currentState)
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

      const previousSelection = shareNowData.templates.instagram.media.map(mediaFile => mediaFile.uid)
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

        if (selections.length > 10) {
          alert('You can only select up to 10 images.')
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

  const handleComment = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target

    setShareNowData((prev: ShareNowType) =>
      produce(prev, draft => {
        draft.templates.instagram.comment = value
      })
    )
  }

  return (
    <Card>
      <Form layout="vertical">
        <Form.Item htmlFor="textBox" label={__('Post')}>
          <Input.TextArea
            id="textBox"
            maxLength={platformsLimitations.instagram.description.length}
            onChange={e => handleTextArea(e)}
            placeholder={__('Write your custom post')}
            showCount
            style={{ height: 120, resize: 'none' }}
            value={shareNowData.templates.instagram.content}
          />
        </Form.Item>

        <Form.Item htmlFor="textBox" label={__('First comment')}>
          <Input.TextArea
            id="comment"
            maxLength={platformsLimitations.instagram.comment.length}
            onChange={e => handleComment(e)}
            placeholder={__('Make comment')}
            rows={2}
            showCount
            value={shareNowData.templates.instagram.comment}
          />
        </Form.Item>

        <Alert
          message="Instagram media images must be 1.91:1 to 4:5 aspect ratio, 320-1440px resolution (recommended 1080px), and under 8MB."
          showIcon
          type="info"
        />
        <Space className="py-2">
          <Tooltip title={__('Enable to selected image shared')}>
            <Checkbox
              checked={shareNowData.templates.instagram.isAllImages}
              onChange={e => {
                handleCheckBox(e.target.checked)
              }}
            >
              {__('Media')}
            </Checkbox>
          </Tooltip>
        </Space>

        {shareNowData.templates.instagram?.isAllImages && (
          <Upload
            fileList={shareNowData.templates.instagram.media}
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
