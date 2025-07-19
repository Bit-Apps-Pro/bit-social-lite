import $shareNowData from '@common/globalStates/$shareNowData'
import { __ } from '@common/helpers/i18nWrap'
import ShareNowPostTypeCheckBox from '@pages/ShareNow/internals/platforms/ShareNowPostTypeCheckBox'
import { type ShareNowType } from '@pages/ShareNow/ShareNowType'
import platformsLimitations from '@rootConfig/platformsLimitations.json'
import { useWpMediaPicker } from '@src/hooks/useWpMediaPicker'
import { type UploadProps } from 'antd'
import { Button, Card, Form, Input, Space, Tooltip, Upload } from 'antd'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { type ChangeEvent } from 'react'
import { LuUpload } from 'react-icons/lu'

export default function ProTelegramShareNowTemplate() {
  const [shareNowData, setShareNowData] = useAtom($shareNowData)

  const postCheckBoxType = ['isLinkCard', 'isAllImages']

  const handleChange: UploadProps['onChange'] = ({ fileList }) => {
    const currentState = produce(shareNowData, draft => {
      draft.templates.telegram.media = fileList
    })

    setShareNowData(currentState)
  }

  const { openMediaPicker } = useWpMediaPicker({
    buttonText: 'Select Images',
    maxFiles: 4,
    mediaTypes: ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'],
    onChange: (file, fileList) => handleChange({ file, fileList }),
    selectedMediaIds: shareNowData.templates.telegram.media.map(file => file.uid),
    title: __('Telegram Media')
  })

  const handleTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setShareNowData((prevSchedule: ShareNowType) =>
      produce(prevSchedule, draftSchedule => {
        draftSchedule.templates.telegram.content = e.target.value
      })
    )
  }

  const handleCheckBox = (name: 'isAllImages' | 'isLinkCard', value: boolean) => {
    setShareNowData((prevSchedule: ShareNowType) =>
      produce(prevSchedule, draftSchedule => {
        draftSchedule.templates.telegram.isLinkCard = false
        draftSchedule.templates.telegram.isAllImages = false

        draftSchedule.templates.telegram[name] = value
      })
    )
  }

  const handleLink = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    setShareNowData((prev: ShareNowType) =>
      produce(prev, draft => {
        draft.templates.telegram.link = value
      })
    )
  }

  return (
    <Card>
      <Form layout="vertical">
        <Form.Item htmlFor="textBox" label={__('Post')}>
          <Input.TextArea
            id="textBox"
            maxLength={platformsLimitations.telegram.content.length}
            onChange={e => handleTextArea(e)}
            placeholder={__('Write your custom post')}
            showCount
            style={{ height: 120, resize: 'none' }}
            value={shareNowData.templates.telegram.content}
          />
        </Form.Item>

        <Space className="py-2">
          <ShareNowPostTypeCheckBox
            handleCheckBox={handleCheckBox}
            templateData={shareNowData.templates.telegram}
            type={postCheckBoxType}
          />
        </Space>

        {shareNowData.templates.telegram?.isLinkCard && (
          <Form.Item htmlFor="link" label={__('Link')}>
            <Input
              id="link"
              onChange={e => handleLink(e)}
              placeholder={__('https://example.com')}
              value={shareNowData.templates.telegram.link}
            />
          </Form.Item>
        )}

        {!shareNowData.templates.telegram?.isLinkCard &&
          shareNowData.templates.telegram?.isAllImages && (
            <Upload
              fileList={shareNowData.templates.telegram.media}
              listType="picture-card"
              onChange={handleChange}
              openFileDialogOnClick={false}
            >
              <Tooltip placement="right" title={__('Add Image')}>
                <Button onClick={openMediaPicker} style={{ height: '100%', width: '100%' }}>
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
