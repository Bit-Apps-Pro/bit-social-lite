import $shareNowData from '@common/globalStates/$shareNowData'
import { __ } from '@common/helpers/i18nWrap'
import { propertiesToUploadFile } from '@pages/ShareNow/helpers/postBoxHelper'
import { type Attachment, type ShareNowType } from '@pages/ShareNow/ShareNowType'
import {
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

const wordLength = 3000

export default function ProPinterestShareNowTemplate() {
  const [shareNowData, setShareNowData] = useAtom($shareNowData)

  const handleTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setShareNowData((prevSchedule: ShareNowType) =>
      produce(prevSchedule, draftSchedule => {
        draftSchedule.templates.pinterest.content = e.target.value
      })
    )
  }

  const handleCheckBox = (value: boolean) => {
    setShareNowData((prevSchedule: ShareNowType) =>
      produce(prevSchedule, draftSchedule => {
        draftSchedule.templates.pinterest.isAllImages = value
      })
    )
  }

  const handleChange: UploadProps['onChange'] = ({ fileList }) => {
    const currentState = produce(shareNowData, draft => {
      draft.templates.pinterest.media = fileList
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

      const previousSelection = shareNowData.templates.pinterest.media.map(mediaFile => mediaFile.uid)
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

  const handleLink = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    setShareNowData((prev: ShareNowType) =>
      produce(prev, draft => {
        draft.templates.pinterest.link = value
      })
    )
  }

  return (
    <Card>
      <Form layout="vertical">
        <Form.Item htmlFor="textBox" label={__('Post')}>
          <Input.TextArea
            id="textBox"
            maxLength={wordLength}
            onChange={e => handleTextArea(e)}
            placeholder={__('Write your custom post')}
            showCount
            style={{ height: 120, resize: 'none' }}
            value={shareNowData.templates.pinterest.content}
          />
        </Form.Item>
        <Form.Item htmlFor="link" label={__('Link')}>
          <Input
            id="link"
            onChange={e => handleLink(e)}
            placeholder={__('Add a link')}
            value={shareNowData.templates.pinterest.link}
          />
        </Form.Item>
        <Space className="py-2">
          <Tooltip title={__('Enable to selected image shared')}>
            <Checkbox
              checked={shareNowData.templates.pinterest.isAllImages}
              onChange={e => {
                handleCheckBox(e.target.checked)
              }}
            >
              {__('Media')}
            </Checkbox>
          </Tooltip>
        </Space>

        {shareNowData.templates.pinterest?.isAllImages && (
          <Upload
            fileList={shareNowData.templates.pinterest.media}
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
