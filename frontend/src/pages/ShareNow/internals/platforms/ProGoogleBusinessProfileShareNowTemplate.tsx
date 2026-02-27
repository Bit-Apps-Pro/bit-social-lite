import $shareNowData from '@common/globalStates/$shareNowData'
import { __ } from '@common/helpers/i18nWrap'
import { propertiesToUploadFile } from '@pages/ShareNow/helpers/postBoxHelper'
import ShareNowPostTypeCheckBox from '@pages/ShareNow/internals/platforms/ShareNowPostTypeCheckBox'
import { type Attachment, type ShareNowType } from '@pages/ShareNow/ShareNowType'
import {
  Button,
  Card,
  Form,
  Input,
  Select,
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

const wordLength = 1500

export default function ProGoogleBusinessProfileShareNowTemplate() {
  const [shareNowData, setShareNowData] = useAtom($shareNowData)

  const postCheckBoxType = ['isAllImages']

  const handleTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setShareNowData((prevSchedule: ShareNowType) =>
      produce(prevSchedule, draftSchedule => {
        draftSchedule.templates.googleBusinessProfile.content = e.target.value
      })
    )
  }

  const handleCheckBox = (name: 'isAllImages' | 'isLinkCard', value: boolean) => {
    setShareNowData((prevSchedule: ShareNowType) =>
      produce(prevSchedule, draftSchedule => {
        draftSchedule.templates.googleBusinessProfile.isLinkCard = false
        draftSchedule.templates.googleBusinessProfile.isAllImages = false

        draftSchedule.templates.googleBusinessProfile[name] = value
      })
    )
  }

  const handleButton = (value: string) => {
    if (value === 'none') {
      setShareNowData((prev: ShareNowType) =>
        produce(prev, draft => {
          draft.templates.googleBusinessProfile.link = ''
        })
      )
    }
    setShareNowData((prevSchedule: ShareNowType) =>
      produce(prevSchedule, draftSchedule => {
        draftSchedule.templates.googleBusinessProfile.button = value
      })
    )
  }

  const handleLink = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    setShareNowData((prev: ShareNowType) =>
      produce(prev, draft => {
        draft.templates.googleBusinessProfile.link = value
      })
    )
  }

  const handleChange: UploadProps['onChange'] = ({ fileList }) => {
    const currentState = produce(shareNowData, draft => {
      draft.templates.googleBusinessProfile.media = fileList
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

      const previousSelection = shareNowData.templates.googleBusinessProfile.media.map(
        mediaFile => mediaFile.uid
      )
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
            value={shareNowData.templates.googleBusinessProfile.content}
          />
        </Form.Item>
        <Form.Item htmlFor="textBox" label={__('Add a button (optional)')}>
          <Select
            onChange={handleButton}
            options={[]}
            placeholder={__('Select Button')}
            showArrow
            value={shareNowData.templates.googleBusinessProfile.button}
          />
        </Form.Item>
        {shareNowData.templates.googleBusinessProfile?.button !== 'none' && (
          <Input
            id="link"
            onChange={e => handleLink(e)}
            placeholder={__('Link for your button*')}
            value={shareNowData.templates.googleBusinessProfile.link}
          />
        )}

        <Space className="py-2">
          <ShareNowPostTypeCheckBox
            handleCheckBox={handleCheckBox}
            templateData={shareNowData.templates.googleBusinessProfile}
            type={postCheckBoxType}
          />
        </Space>

        {!shareNowData.templates.googleBusinessProfile?.isLinkCard &&
          shareNowData.templates.googleBusinessProfile?.isAllImages && (
            <Upload
              fileList={shareNowData.templates.googleBusinessProfile.media}
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
